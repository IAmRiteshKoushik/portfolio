---
layout: ../../layouts/MarkdownPageLayout.astro
title: Papershelf
pageTitle: Papershelf
description: A reading list of papers on storage, distributed systems and security.
---

# Papershelf

I read papers around storage engines, distributed systems and vector databases.
The list is grouped by topic so I can follow a thread instead of working through
one very long queue.

`✓` means read. `✗` means still to read.

## Suggested reading paths

- **Storage:** The Google File System → LSM-Tree → Bigtable → WiscKey → Spanner
- **Consensus:** Time and clocks → distributed snapshots → Raft → Paxos → ZooKeeper
- **Replication:** Epidemic algorithms → CRDTs → Dynamo → TAO → consistency trade-offs
- **Distributed processing:** MapReduce → Borg → Quincy → Dataflow → Dapper

## Distributed-systems foundations

- ✓ [The Google File System](https://research.google/pubs/the-google-file-system/)
- ✗ [Time, Clocks, and the Ordering of Events in a Distributed System](https://www.google.com/search?q=https://www.microsoft.com/en-us/research/uploads/prod/2016/12/Time-Clocks-and-the-Ordering-of-Events-in-a-Distributed-System.pdf)
- ✗ [Timestamps in Message-Passing Systems](https://www.google.com/search?q=https://zoo.cs.yale.edu/classes/cs426/2012/bib/fidge88timestamps.pdf)
- ✗ [Logical Physical Clocks and Consistent Snapshots](https://www.google.com/search?q=https://cse.ohio-state.edu/~kulkarni.137/hlc-tods.pdf)
- ✗ [Distributed Snapshots: Determining Global States](https://www.google.com/search?q=https://www.microsoft.com/en-us/research/uploads/prod/2016/12/Distributed-Snapshots-Determining-Global-States-of-Distributed-Systems.pdf)
- ✗ [Linearizability: A Correctness Condition for Concurrent Objects](https://www.google.com/search?q=https://cs.cmu.edu/~wing/publications/HerlihyWing90.pdf)
- ✗ [Impossibility of Distributed Consensus with One Faulty Process](https://www.google.com/search?q=https://www.cs.princeton.edu/courses/archive/fall16/cos518/papers/flp.pdf)
- ✗ [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://www.google.com/search?q=https://gsd.di.uminho.pt/members/cbm/ps/p24-gilbert.pdf)
- ✗ [A Critique of the CAP Theorem by Martin Kleppmann](https://www.cl.cam.ac.uk/research/dtg/archived/files/publications/public/mk428/cap-critique.pdf)

## Consensus and coordination

- ✗ [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf)
- ✗ [The Part-Time Parliament](https://www.google.com/search?q=https://www.microsoft.com/en-us/research/uploads/prod/2016/12/The-Part-Time-Parliament.pdf)
- ✗ [Paxos Made Simple](https://www.google.com/search?q=https://www.microsoft.com/en-us/research/uploads/prod/2016/12/paxos-made-simple.pdf)
- ✗ [Viewstamped Replication Revisited](https://www.google.com/search?q=https://pmg.csail.mit.edu/papers/vr-revisited.pdf)
- ✗ [Practical Byzantine Fault Tolerance](https://www.google.com/search?q=https://pmg.csail.mit.edu/papers/osdi99.pdf)
- ✗ [Elections in a Distributed Computing System](https://www.google.com/search?q=https://www.cs.princeton.edu/courses/archive/fall11/cos518/papers/bully.pdf)
- ✗ [ZooKeeper: Wait-free Coordination for Internet-Scale Systems](https://www.google.com/search?q=https://www.usenix.org/system/files/conference/usenixatc10/atc10_hunt.pdf)
- ✗ [The Chubby Lock Service for Loosely-Coupled Systems](https://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf)

## Replication and consistency

- ✗ [Epidemic Algorithms for Replicated Database Maintenance](https://github.com/papers-we-love/papers-we-love/blob/main/distributed_systems/epidemic-algorithms-for-replicated-database-maintenance.pdf)
- ✗ [Conflict-Free Replicated Data Types](https://www.google.com/search?q=https://inria.hal.science/hal-00932851/document)
- ✗ [A Comprehensive Study of Convergent and Commutative Replicated Data Types](https://inria.hal.science/inria-00555588/document)
- ✗ [Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- ✗ [TAO: Facebook's Distributed Data Store for the Social Graph](https://www.usenix.org/system/files/conference/atc13/atc13-bronson.pdf)
- ✗ [Consistency Tradeoffs in Modern Distributed Database System Design](https://www.google.com/search?q=https://www.cs.umd.edu/~abadi/papers/abadi-ieee2012.pdf)

## Storage engines and indexing

- ✗ [Ceph: A Scalable, High-Performance Distributed File System](https://www.usenix.org/legacy/events/osdi06/tech/full_papers/weil/weil.pdf)
- ✗ [Organization and Maintenance of Large Ordered Indexes](https://link.springer.com/article/10.1007/BF00288683) by Rudolf Bayer and Edward M. McCreight (1972)
- ✗ [The Log-Structured Merge-Tree (LSM-Tree)](https://www.cs.umb.edu/~poneil/lsmtree.pdf) by Patrick O'Neil, Edward Cheng, Dieter Gawlick and Elizabeth O'Neil (1996)
- ✗ [ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks](https://web.stanford.edu/class/cs345d-01/rl/aries.pdf)
- ✗ [Bigtable: A Distributed Storage System for Structured Data](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)
- ✗ [WiscKey: Separating Keys from Values in SSD-Conscious Storage](https://www.usenix.org/system/files/conference/fast16/fast16-papers-lu.pdf)

## Distributed databases and transactions

- ✗ [Spanner: Google's Globally Distributed Database](https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf)
- ✗ [Sagas](https://www.google.com/search?q=https://www.cs.princeton.edu/courses/archive/fall16/cos518/papers/sagas.pdf)
- ✗ [Life Beyond Distributed Transactions](https://www.google.com/search?q=https://cidrdb.org/cidr2007/papers/cidr07p11.pdf)

## Distributed processing and infrastructure

- ✗ [MapReduce: Simplified Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)
- ✗ [The Dataflow Model](https://www.google.com/search?q=https://static.googleusercontent.com/media/research.google.com/en//archive/the-dataflow-model-vldb2015.pdf)
- ✗ [Resilient Distributed Datasets](https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf)
- ✗ [Kafka: A Distributed Messaging System for Log Processing](https://www.google.com/search?q=https://www.microsoft.com/en-us/research/wp-content/uploads/2011/06/kafka_netdb11.pdf)
- ✗ [Large-Scale Cluster Management at Google with Borg](https://www.google.com/search?q=https://static.googleusercontent.com/media/research.google.com/en//archive/borg-eurosys15.pdf)
- ✗ [Quincy: Fair Scheduling for Distributed Computing Clusters](https://www.microsoft.com/en-us/research/wp-content/uploads/2009/10/quincy_sosp09.pdf)
- ✗ [Dapper, a Large-Scale Distributed Systems Tracing Infrastructure](https://www.google.com/search?q=https://static.googleusercontent.com/media/research.google.com/en//archive/dapper-2010.pdf)

## Hashing, lookup and load balancing

- ✗ [Consistent Hashing and Random Trees](https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf)
- ✗ [Chord: A Scalable Peer-to-Peer Lookup Service](https://pdos.csail.mit.edu/papers/chord:sigcomm01/chord_sigcomm.pdf)
- ✗ [Kademlia: A Peer-to-peer Information System Based on XOR Metric](https://www.google.com/search?q=https://www.scs.stanford.edu/~dm/home/papers/kademlia.pdf)
- ✗ [The Power of Two Choices in Randomized Load Balancing](https://www.eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf)
- ✗ [The Anatomy of a Large-Scale Hypertextual Web Search Engine](https://www.google.com/search?q=https://infolab.stanford.edu/~backrub/google.pdf)

## Security and access control

- ✓ [JSON Web Token](https://www.google.com/search?q=https://www.ietf.org/rfc/rfc7519.pdf)
- ✗ [The Transport Layer Security Protocol Version 1.3](https://www.google.com/search?q=https://www.ietf.org/rfc/rfc8446.pdf)
- ✗ [The OAuth 2.0 Authorization Framework](https://www.google.com/search?q=https://www.ietf.org/rfc/rfc6749.pdf)
- ✗ [Role-Based Access Control Models](https://www.google.com/search?q=https://profsandhu.com/journals/computer/i96rbac.pdf)
