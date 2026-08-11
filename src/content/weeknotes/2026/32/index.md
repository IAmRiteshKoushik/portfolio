---
title: "Weeknotes: Week #32 - 2026"
description: "I missing the war"
date: "Aug 10, 2026"
draft: false
---

I am finally travelling back home. This is one of the few occasions that I 
actually get to travel alone. There isn't much to recap from the week other 
than the fact that I have taken an active interest into learning about LLMs 
and their internal working. 

Earlier this week, Vishwaa reached out to me with an idea to create an 
inference platform and here I am picking up resources and trying to make head 
or tail of a domain that I know absolutely nothing about.

The massive trail of resources can be found [here](https://slipstream-docs.karatlabs.in/inference/000-memory/) incase you are reading this 
and happen to be interested in `inference engineering`.

Keeping this aside, I think I am finally becoming a slightly better Go 
developer. There is better standardization to my patterns and thinking. I think 
reading the codebase of one enterprise does that to you. Lucky me that we do 
not have Java engineers writing Go the way they do with Java. Boy, that's a 
messy situation.

I have wrapped up the monorepo setup at work, the first of its kind. It is not 
much but it's honest work. Parallely, I am trying to read up on other services 
as and when I can. 

While there is a gut feeling that we have over-compartmentalization when it 
comes to services, I do not have concrete evidence to justify it given how each 
repository has become massive enough over the course of time. 

I was able to run a few early experiments and try out the following tech:

1. Dozzle (container logs)
2. Flipt (feature flags)

I tried to get OpenBao, Jenkins and Harbour running but I think I will have to 
save all of that for the following week. Currently, I am experimenting with 
trying to get a deployment pipeline up so that we can have stable releases. 

I want to talk to Ritwik sir about adopting this into the workflow so that 
next year onwards, Anokha and other projects can have a better workflow rather 
than manually SSH-ing into the server and deploying things one by one. Frankly 
causes more errors. But that being said, this also slows down hotfixes. Will 
have to find a hybrid solution in the long term, but it is a start. 
