---
title: "Weeknotes: Week #34 - 2026"
description: "Back to Bangalore, and hello homelab ?"
date: "Aug 23, 2026"
draft: false
---

Well, back to home and hello Homelab!

Now, I have been looking into tinkering around with Kubernetes for a while but 
the prohibitive cloud costs have always kept me at bay. While I have gotten 
my hands dirty with it earlier last year, it is safe to say that I did not 
go much further than writing a few `manifests`. 

This time around I wanted to dig deep into:
1. Stateful deployments (Databases, Queues, etc)
2. Backups through Jobs and Cron Jobs
3. Secret Managers
4. CRDs specifically
5. Cilium networking
6. And explore the kubernetes ecosystem of tools in general.

Earlier this year I got my employer to reimburse [iximiuz labs](https://labs.iximiuz.com/pricing)
for me so that I can lean a bit more towards DevOps and SRE. This set of 
experiments is an extension of that enthusiasm.

In addition to all of this, I have been meaning to setup my homelab too and I 
came across this [video](https://youtu.be/pfgiZUFUuhg?si=u5_XuXqAshojNtSK) by 
[Misha van deb Burg](https://www.youtube.com/@mischavandenburg) and it seems 
like a beautiful marriage between both ideas.

Currently I do not really have much hardware so everything will be running 
between my two laptops with 16GB and 32GB RAM each. More heavier experiments 
will be running on the [k3s playground on iximiuz labs](https://labs.iximiuz.com/playgrounds)

With that in mind, I'm off :)
