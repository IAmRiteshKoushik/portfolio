---
title: "TIL: Napkin Math for Engineers"
description: ""
date: "July 4, 2026"
draft: false
---

Quick notes from the [napkin math tutorial by Ben Dicken](https://www.youtube.com/watch?v=PFEBo7SMX3M).

The entities that we are dealing with include
- CPU (4 Ghz = 4 billion instructions/s)
- CPU Cache
- RAM (volatile memory)
- Disk (permanent memory)
- Networking

| Entity | Latency |
|----------|----------|
| cpu instruction | 1ns |
| l1 cpu cache    | 1ns  |
| l2 cpu cache    | 3ns  |
| l3 cpu cache    | 10ns  |
| RAM | 100ns  |
| NVME SSD | 50 micro-s  |
| HDD | 1-10ms  |
| storage (same region) | 1ms |
| east-west US | 70ms  |
| east-US to EU | 150ms  |
| east-US to APAC | 200ms  |
| east-US to APAC | 200ms  |

Keeping the above table in mind can help in interviews.

A complete resource for this is here - [github repo](https://github.com/sirupsen/napkin-math).

There is no need to memorize every single number from the README of the repo. 
This primarily comes in handy when you are looking for sites of optimization 
and you start checking latency scores to find the gap.
