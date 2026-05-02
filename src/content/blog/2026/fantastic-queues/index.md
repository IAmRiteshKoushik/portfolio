---
title: "Fantastic Queues and Where to Use Them"
description: "A practical intro to queues, messaging patterns, and where each approach fits."
date: "May 02, 2026"
image: "https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ultwhh7pCOLQ5yWkSIMz7vG2H3BXZhAacPYdg0"
---

In almost every discussion of queues or message brokers, the ever-present 
technologies have been [Apache Kafka](https://kafka.apache.org/)
or [RabbitMQ](https://www.rabbitmq.com/) 
or [AWS - SQS](https://aws.amazon.com/sqs/). Interestingly, they solve very 
different problems and cannot be used interchangeably.

This blog covers some of the most common scenarios and gives you insight into 
this. It's broken down into 5 acts, each dealing with a specific problem.

# The First Act...

Suppose you have a checkout page which needs to contact an `inventory service`
downstream before actually proceeding with the payment. Now, if there is some 
latency in the inventory service, then the checkout process slows down. More requests 
keep coming in and are waiting to be processed.

![sync-coupling-services](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulQmz4WStCtMY4T0W21P6vJRAlyhfkVsUcdnQK)

After a point, the checkout page goes unresponsive; requests start to timeout, 
retries kick in, all while the inventory takes its own sweet time to process 
things.

Therefore, one slow dependency can lead to cascading failures across upstream 
services. It primarily arises from `synchronous coupling` of services.

# Solution: Decoupling

However, if we were to add in a queue to which all these requests could be 
published then the requests would stay there without slowing down the checkout 
process. A slow `inventory` is not affecting the health of `checkout`.

![async-processing-services](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulckeqg97hpIaBCgAwo5QTzmOPxtfMKjUHvqkW)

So essentially, the producer is decoupled from the consumer of the events within 
the system. This leads to three interesting observations:
1. The producer and the consumer do not run at the same time
2. If one service is down, it doesn't take the other one down with it
3. The slowest service does not choke the faster service

# The Second Act...

Suppose you built a system to send marketing emails to 10,000 users. The idea 
is that all the targeted users of the product get the marketing email. As a 
data engineer, you drop in the mailing list and the content to be sent to 
each one and call it a Friday. 

It's Monday, and your boss is fuming! Each user received 50 copies of the same 
email. Your email has been blacklisted and spam filters are kicking you out. 
What exactly happened?

Turns out, your system had `50 workers` which were supposed to send emails to the
users in parallel. The problem is that instead of doing a round-robin 
on them, your system `fanned-out` each email to every single worker.

# Solution: Work-Queue vs Pub/Sub

![work-queue-over-pub-sub](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulsSDcjQq3uOeodMxqJjRVgb5BDXYkAHCh2mas)

The critical question that could have saved your job is:

> Should this event be handled by one?
> Or should this event be handled by many?

A `work-queue` is ideal when you have multiple workers each doing one task. A 
`pub/sub` system makes sense in situations where a single event needs to go to 
multiple systems for processing.

For example:
1. Transcoding a video to a different resolution involves a payload like 

```json
{
  "video_url": "mycoolcdn.com/pipeline/video-1",
  "result": "720p",
  "save_at": "mycoolcdn.com/destination/*"
}
```

This can be picked up by any worker and should be handled only once. 

2. An order placed on Swiggy/Doordash means

```bash
1. Notify the restaurant 
2. Find a driver
3. Notify the customer
```

When a single event triggers multiple actions from different sub-systems, then 
you need a fan-out system. Each system gets a copy of the event to handle 
independently.

# Delivery Guarantees (where subtle bugs arrive)

![delivery-guarantees](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ul7BC1GLtYJzADdRvBgfwXSZ2NGkoPMyHO4e6b)

1. `At-most-once` is great for use-cases like readings and metrics where a 
dropped data point is not very consequential.

2. `At-least-once` is what most systems use by default. The sender keeps retrying 
until it gets an acknowledgement. While you don't lose events, you do end up 
delivering duplicate events. It is the job of the consumer on the other end to process 
it only once, aka `idempotency`.

3. `Exactly-one` delivery across a network is not achievable in general. Whether 
you use Kafka, RabbitMQ, SQS, Pulsar, Redis Streams or anything else!

The reason why it is impossible in general is because of the [Two Generals Problem](https://medium.com/@ali.gelenler/two-generals-problem-and-idempotency-4d28f4b07694).

In simple terms, let's say
- A producer sends a message, and the consumer sends an acknowledgement `ACK`
- The `ACK` gets lost over the network, so now the producer is in a dilemma because
    1. It can retry and cause a **duplicate**
    2. Drop the message but potentially **lose it**

The network doesn't tell which situation you are in!  
So, if a system claims to have exactly-once delivery, what it means is

```python
at-least-once delivery + idempotent processing = effective exactly-one processing
```

> Within Kafka, there is an exactly-once guarantee, but that is within the cluster 
where deduplication mechanisms exist. Once the event has stepped out of the 
Kafka cluster,   
you are on your own! Roll out your own idempotency solution.

Hence, assume `at-least-once` delivery and build `idempotent` consumers. You avoid 
a whole class of bugs like
- Duplicate customer emails
- Inventory drift due to double addition/subtraction of items
- Double charges on payments

# The Third Act...

![dead-letter-queue](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulygUEofWBhluaiFSobRVPp8zCvQXnMdxqK904)

While dropping a message into the queue, let's say that the message was 
malformed. Let's call it a `poison message`. When this comes up to the consumer 
for processing, then it throws an error and retries. The problem is that a 
retry is not useful in this scenario as newer messages are piling up and the 
consumer is stuck.

One poison message can take down a pipeline handling `1M messages/min.`

# Solution: Dead-Letter Queue (DLQ)

After a fixed number of retries, the message is moved to a different queue while 
the main pipeline resumes healthy operations. The poisoned message is available 
for auditing and troubleshooting but it is not a pipeline choker any longer.

However, your DLQ is quickly becoming a graveyard of messages.

After cleaning up these messages, there should either be some tooling to push 
them back to the main queue. If you forgot to write this, then:
1. Write a one-off script to move to the main queue
2. Replay each message's payload by hand
3. Accept your fate and forget the messages :(

Most underprepared teams don't design the replay path through which messages can 
move from the dead-letter queue to the primary queue. That tends to destroy the 
whole point of the DLQ.

That being said, things to consider when building the replay path are:
- Cap the number of `max_retries`
- Alert on the `dead_letter_queue_size`
- Attach `metadata::{error, timestamp, retries_count}` 

# The Fourth Act...

![producer-outpacing-consumer](https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulWrudhVUDDtzFmA3uUjrP8fWpJRvENZ6H0n5e)

You get alerted at 2 AM, and your queue is out of memory. 
What happened? Everything was designed perfectly so far. Turns out your 
producers outpace your consumers and the queue got full!

Let's do some napkin math here to gain perspective

1. Producers drop `10,000 messages/s` during peak load
2. Consumers process `2,000 messages/s` at max capacity
3. There is a delta of `8,000 messages/s` at peak load
4. Within an hour, `8,000 messages/s x 3600s` leads to `28.8 million` messages 
on-disk

An alternate version of the same problem is where the processing delays are 
enormous due to massive queue sizes. Take, for example, an Aadhaar verification 
taking hours the first time around.

# Solution: Backpressure

When the producer is outpacing the consumer, the consumer needs to inform the 
producer to slow down. There are a few ways to achieve this:

1. `Bounded Queues:` Cap the queue size after which the producer fails fast.
    - Very simple to implement, errors surface early, loud alarms everywhere
2. `Auto-Scaling:` If the `queue_size` crosses a certain threshold, then spin up 
   more consumers and have them join the pool.
     - This works when the consumer is stateless and traffic is unpredictable
3. `Credit-Based Flow Control:` The consumer tells the producer that it is 
ready to handle   
X number of messages only. Then the producer sends that many messages to 
the consumer and waits for the next credit message. This is the idea behind `Reactive Streams`.
Nothing moves without downstream's permission.

# The Final Act...

So the question to answer is: Kafka, RabbitMQ, or SQS?

## `RabbitMQ`: Routing Control

In RabbitMQ, messages are published to an `exchange`. This is a router which 
connects to multiple different queues and is the deciding authority on which 
queues a message must go to. The routing rules are configurable.

```bash
routing_key = orders.eu.high_volume

# Exact match
queue_1: orders.eu.high_volume

# Pattern Match
queue_2: orders.eu.*

# Header match
queue_3: orders.#
```

Once the consumer `ACK`s the message, it is gone. It does not stay 
in the system anymore. You would typically reach for RabbitMQ when:
1. There are different worker pools for background jobs
2. Message shape decides destination
3. Per-message control is more important over raw throughput

## `Apache Kafka`: Append-Only Log

In Kafka, messages are written to an `append-only log`. They stay there based 
on your retention policy. Consumers attach to this log and track their own 
position

```bash
consumer-1: offset=0 # beginning
consumer-2: offset=9 # end, caught up with all messages
consumer-3: offset=5 # midway
```

This means that any consumer at any time can rewind. You get to replay old 
events due to the persisting nature of Kafka. The log is the history. Teams 
which use Kafka are usually:
1. Analytics over every event produced
2. Data warehouse for history and auditing
3. Search indexing on new items added

A new consumer can join in any time and jump to an offset based on timestamp.

Additionally, it is built for throughput. It can handle `1 million msg/s`

The caveat is that there is serious operational weight to running Kafka clusters, 
and a `Kafka Admin` needs a very different resume.

> Recently, Kafka has made some updates so it can act as a simple queue as well.

## `AWS - Simple Queue Service (SQS)`: Zero-Ops Overhead

SQS is a fully managed service that comes down to three API calls

1. create-queue
2. send-message
3. receive-message

There is no operational overhead. AWS manages it all for you. It comes in two 
flavors based on your workload

1. `Throughput-first:` At-least-once processing and effectively unlimited throughput
but messages can go out of order.
2. `Order-first`: Exactly-once processing with strict FIFO ordering of messages. 
The throughput can scale from **300 TPS** to **70K TPS**

But as we know, exactly-one processing is a myth! What actually happens is that 
there is a visibility time-out window of 5 minutes within which your consumer 
is supposed to do the necessary deduplication and maintain idempotency and send 
back the `ACK`. Otherwise, SQS will send it to another consumer for processing.

Now, by itself, SQS is a queuing service and does not do fan-out behavior. But 
in order to achieve that, you usually pair it with other services like 
`AWS SNS`, `EventBridge` or `Kinesis`.

Teams use SQS when they want zero-ops burden.

# Conclusion

Picking the right queue for the job is essential, but answering the fundamental 
questions about your data flow is even more important. There are teams which 
shoot themselves in the foot by reaching for Kafka from day 1 because it 
has the biggest data-flow diagram on Netflix or in big tech.

Don't make every engineer on the team go through a Kafka tutorial. The tool gets 
more complicated than the problem it is solving. Pick the simplest 
tool, and if you have a real reason, migrate later. 

Don't be afraid of migrations!

Organic growth over architecture madness.
