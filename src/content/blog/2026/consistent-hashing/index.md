---
title: "Why We Put Servers on A Ring"
description: "Expanding capacity is easy until your hashing mechanism gets in the way"
date: "June 15, 2026"
image: "https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ul2CT5GzWEwT6kfus1Vyd3Y98nxOXiQS0tKGMJ"
draft: true
---

Imagine you have a <u>file storage unit</u> that is partitioned into three different servers.
You determine which server would be queried based on 

```python
server = hash(key) % 3
```

Everything is working peacefully until one of the storage units starts filling 
up faster than others and more and more traffic starts overloading it. You decide 
to add a 4th server to absorb some of the traffic thus spreading the load.

However, in reality, this births a chaos. Your new formula becomes -

```python
server = hash(key) % 4
```

This means, the traffic that was previously going to one server may be routed 
to an entirely different server which does not have the file. 

Consider a few example keys

| Key | hash(key) % 3 | hash(key) % 4 | 
|-----|---------------|---------------| 
| file-a | 0 | 1 | 
| file-b | 1 | 0 | 
| file-c | 2 | 3 | 
| file-d | 0 | 2 |

Notice something interesting ? We only added a single server, yet almost every 
key got reassigned. The `hash(key)` which was divisible by 3 now leaves a 
remainder of `1` when done by 4 and so on.

Now if your storage servers contain millions of files then millions of 
`file-to-server` mappings are invalid all of a sudden. The files exist 
but the clients are looking for them in the wrong server. You can restore 
correctness by moving large portions of data across the cluster but this means 
migrations, network spikes across all servers and increased writes to disk. 

Ironically, adding a server for [scaling horizontally](https://wa.aws.amazon.com/wellarchitected/2020-07-02T19-33-23/wat.concept.horizontal-scaling.en.html)
is triggering an exponentially expensive operation of moving around data across 
the entire system. This could almost guarantee downtime!

Therefore, what we want is a scheme where adding or removing a server 
affects only a small fraction of keys. Here enters - `consistent hashing!`

# Hash Functions (a.k.a the prerequisites)

# Working with a Sharded Database

# Consistent Hashing

# Scaling Up

# Scaling Down

The entire source code of Consistent Hashing in Go with Redis could 
be found at [github.com/IAmRiteshKoushik/consistent-hashing-go.](https://github.com/IAmRiteshKoushik/consistent-hashing-go)
# Conclusion

This algorithm has gained prominence not only in sharded systems but also 
in load balancers, routing algorithms and scalable databases which handle 
monstrous loads. 

Below are the papers that laid the foundation and spearheaded the adoption of 
this algorithm respectively.

- [Consistent Hashing and RandomTrees: Distributed Caching Protocols for 
Relieving Hot Spots on the World Wide Web](https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf)
- [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
