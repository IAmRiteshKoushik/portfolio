---
title: "Cache Me If You Can: A Primer"
description: ""
date: "April 29 2026"
---

## The Failure You Don't See Coming

The incident starts ... innocently.

A hot key expires. The user profile of a celebrity with 10M followers gets 
cache evicted. Suddenly, thousands of concurrent requests miss the cache and 
fall through to the database. The DB spikes. Latency explodes. Retries kick in. 
All of a sudden you are not handling a 1000 requests, you are handling tens 
of thousands of them.

In a matter of minutes, the connection pool is exhausted and starts throwing 
`failured to acquire connection with X time`. Timeouts start cascading upstream.
What started as a cache expiry is now a full-blown system outage!

Nothing <u>broke</u>. 

Nothing <u>changed</u>. 

The cache did exactly what you programmed it to do and this is what makes 
caching deceptively difficult to pull off! It was never just about storing 
data - it was about controlling inconsistency under traffic.

## Mental Model of Caching

I think most discussions about caching are fragmented between what TTL to use, 
whether to use `redis` or `memcached` and whether to just cache everything.
This approach breaks very early in production because it focuses on **tools**
and not on the **behavior** of the data.

A more useful model is to think about caching along two orthogonal axes:

![cache-axes-diagram](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulkxKbBmxuCVuZXEw7GhgMebfqlKWrcoPDaJj3)

#### Axis X: Write Path (aka where does truth flow)
Your write path determines how data moves between your cache and database.

On one end of the spectrum you have **write-through** where every write updates 
both the DB and the cache in the request path. On the other end, you have 
**write-behind** where writes are accepted into the cache and then persisted 
asynchronously in the DB.

Most real-systems don't sit cleanly at either of the extremes. There is usually 
a mixture of strategies:
- Write to DB and invalidate cache
- Write-through for some entities and write-behind for some
- Bypass cache entire for critical paths that demand consistency

While both strategies work on a sunny day, on a rainy day they diverge:
- Write-through risks dual-write inconsistency
- Write-behind risks data loss and reordering

You are not choosing the better method. You are only choosing your preferred 
failure mode.

#### Axis Y: Read Path (aka when data stops being valid)

#### The Interaction Matters
Most cache bugs don't come from picking up the wrong point on one axis. They 
come from examined interactions between the two.

For example:
1. **Write-through + TTL:** You assume fresh data but TTL silently introduces staleness

2. **Write-behind + TTL:** You now have two independent delays: persistence lag + expiry lag

3. **Explicit invalidation + high write volume:** Your invalidation system becomes the
   bottleneck

4. **TTL-only + hot keys:** Expiration becomes a coordinated attack on your DB

The system behaves perfectly in isolation, but fails under composition.

Questions to ask here would be:
- Where can I tolerate inconsistency ?

- How long can inconsistent data live ?

- What happens if invalidation fails ?

- What happens if writes succeed but partially ?

Once you start seeing it this way, things like `stampede prevention`, `TTL jitter` and
`singleflight` become implementation details.

## Pros and Cons of the Cache Write Strategies

![cache-write-patterns](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulJ9P9b5LId16n7FPkfzygV8oEmTQtJweNU9cA)


## Time-To-Live and Invalidation

At first glance, TTL looks like the simplest solution to cache invalidation. 
Set an expiry and let time handle the correctness.

```python
# TTL Lifecycle
cache.set(ttl: 2s) -> ValidWindow(2s) -> expire -> cache.setAgain()
```

In practice however, TTL is not a strategy but a fallback mechanism for uncertainity.
You use TTL when you don't know exactly when data changes or when it's too 
expensive to track every change.

#### What TTL Actually Does
TTL does not guarantee freshness. It guarantees **bounded staleness.** When you 
are setting a TTL for 60 seconds, the idea is as follows

```bash
# wrong
This data is fresh for 60 seconds
# right
We are willing to serve data that may be upto 60 seconds stale
```

#### Where TTL Breaks Down
1. **Synchronized Expiry**  
If many keys share the same TTL, they tend to expire together. This creates
bursty load patterns:
    - cache entries expire
    - requests spike to DB
    - latency increases
    - retries amplify the spike

You effectively "schedule" a micro-outage for yourself.

2. **Hot Keys**    
A single high-traffic key expiring can overwhelm your system. TTL does nothing 
to protect against:
    - stampedes
    - thundering herds
    - retry amplification

Again, without additional control TTL becomes the trigger for cascading failure.

3. **Silent Staleness**
TTL-based systems have no awareness of when the data changes. If the upstream 
data changes immediately after a cache set:
    - you serve stale data for the full TTL duration
    - no signal exists to correct it early

This is acceptable for some domains like product catalog but unacceptable 
for pricing changes and permission-altering systems.

## Cache Stampedes

```bash
# Stampede scenario
Many clients -> Cache miss -> DB (spike)
```

Cache systems optimize for steady stage but nothing for transition states like 

- Valid -> expired

- Cached -> recomputed

Every request independently decides to recompute on cache misses. Your cache 
effectively becomes a load multiplier with a retry storm.

#### Mitigation Strategies

1. **Request Coalescing aka Singleflight**

![single-flight-diagram](https://miro.medium.com/v2/1*fPBG_kAQ1BOZZQCNVj9khA.png)

One request performs recomputation and others wait for the result. This prevents 
duplicate work and reduces DB load to a single request. The tradeoff is that 
the concurrent requests are blocked and latency increases a bit for waiting 
callers.

However this is the most effective first layer for defense.

2. **Distributed Locking:**
Consider the following cache miss pattern

```bash
Instance-A: cache miss -> DB
Instance-A: cache miss -> DB
Instance-A: cache miss -> DB
```

Each instance believes it is responsible for recomputing the value. With 
distributed locking the recomputation is coordinated across the cluster.

This actually addresses the downside of the `singleflight` solution because 
that is bound to the requests coming to a single instance. If you have `10 pods` 
of the same process then you are still requesting `10 concurrent recomputation 
requests`. 

Another scenario is when you have a `distributed cache` with multiple nodes, 
the recomputation needs to be propagated across all nodes.

3. **Stale-While Revalidating:** Instead of blocking while recomputing cache, you 
serve stale data and begin a refresh in the background. As a result, there is no 
request blocking and the latency is stable under load.

The trade-off is that users see stale data and it requires tolerance for this 
temporary inconsistency. Ideally, you send a message to the client to retry 
again in 2-3 seconds as that's your predicted time to finish computation. 

If your system is a high-read and low-criticality system then this is the most 
resilient default setting.

4. **TTL Jitter:** Stampedes after often synchronized If many keys share the same TTL, it creates 
a coordinated load spike. Adding randomness to the TTL spreads the load. 

```python
final_ttl = fixed_ttl(60s) + randomness(0..10s)
```

This smooths backend load and reduces coordinated expiry. It is a low-effort 
mitigation strategy to prevent predictable bursts.

5. **Negative Caching:** Not all stampedes arise from existing data, some also come from missing data.
If a key does not exist then every request is a `cache miss` and hits the DB.

Sending `CACHE_NOT_FOUND` is an acceptable way of avoiding this issue. You can 
use this for user lookups or feature flags. The trade-off is that you require 
careful invalidation and you risk caching a temporary absence state.


## Some Examples in Production
#### Example 1: User Profile Service

- Use a read-through cache with explicit invalidation + TTL

- Profiles are read heavy, updates are not frequent but correctness matters.

- A slight staleness window after the update is acceptable for all viewers 
  except the user to whom the profile belongs to. You can set a cookie flag for 
  this particular user's request to directly hit the DB.

#### Example 2: Product Catalog in eCommerce

- Use a stale-while revalidating with long TTLs

- Again the read volume is high and data changes infrequently

- The difference from previous example is that previously we have to invalidate 
cache quickly so that it reflects fast. Cache is evicted on write immediately.

- But here, we need to prioritize serving and then slowly warming up the 
correctness in the background. There is no cache eviction but overwrite.

#### Example 3: High-Frequency Counters

- Use a write-behind cache with batch writes to DB

- Due to the massive write volume when it comes to counters, the exact 
real-time value is often not required.

- Eventual consistency is acceptable. All you need is a flush logic that 
triggers periodically and must be idempotent to avoid duplicate.

- Duplicate updates in the case of counters can be a very scary situation  
`x becoming 4x instead of 2x`

#### Example 4: Auth / Permission Systems

- Use a short TTL with explicit invalidation strategy

- Incorrect data in this scenario creates a security nightmare.

- Systems like this have high cache churn and increase backend load so you need 
to look for tools and technologies to combat that.

## Common Pitfalls to Avoid 

- Cache is not a source of truth. The DB is the source of truth.
- Don't use TTL blindly as it leads to subtle bugs.
- Most systems are not uniform. A small subset of keys dominate traffic. Design 
  for **hot keys** explicitly.
- Every cache interaction is a distributed system problem and they do happen in prod
    - Cache write fails
    - DB write succeeds
    - Network partition
- Don't use **write-behind** caching for critical data. This is how you lose 
  data without noticing.

## Conclusion

Before you introduce caches into your system, always make sure to answer the 
following questions:
1. What is the source of truth ? 

2. How much staleness of data can the system allow ?

3. What happens on partial failure ?

4. What happens under load ?

Caching ought not to be treated just as a performance optimization. It's a 
trade-off between speed, consistency and failure handling. Most cache-related 
outages are not caused by the cache itself. They are a byproduct of 
assumptions about freshness, traffic patterns and failure modes that do not 
hold in production.

Caching as a first-class citizen of your system absorbs load. As a shortcut, 
it amplifies failure!

---
