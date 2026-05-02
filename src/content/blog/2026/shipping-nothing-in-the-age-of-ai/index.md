---
title: "Shipping Nothing In The Age of AI"
description: "A reflection on AI, output obsession, and what meaningful shipping still means."
date: "April 27 2026"
---

# We are all AI-pilled

Year 2026. Everyone is building fast. From prompt to scaffold to deployment. 
Everything works (on the surface) and we are shipping at the speed of inference.
The loop is tight, the feedback is immediate and the barrier to software 
development is lower than ever before.

Iteration cycles are insanely cheap now. It has become easier to test out 
different ideas and going from zero to prototype is a matter of hours and not 
weeks. 

While all of this great, I feel a tension that has become hard to ignore. The 
depth of knowledge has not kept pace with the output generation capabilities. A 
lot of what is getting built today is thin-wrappers over APIs put together with 
ducktape-y knowledge and little brainpower is spent over failure modes, system 
evolution and productionizing software.

Somewhere, I think the problem is not AI, but the human behaviors that it 
incentivizes...

# Let's talk "real software" shall we

Software that survives contact with reality (users) is what this is all about. 
It is not an abstract / absolutist ideal to chase.

It handles failure modes explicitly. Developers take ownership of it, are 
willing to maintain it and improve it overtime. There are clear boundaries and 
separation of concerns with intentional trade-offs.

However, it is also unglamorous in appropriate ways. It has logs, metrics and 
retries. And lastly there are comments like `here there be dragons` sprinkled 
all over it :) 

It's got a fundamentally different mental model from a demo-ware that works 
only on the happy path.

# Traps and threats

It has come to my observation that the current environment rewards visible 
output. A working UI, an integration and a fast demo. What is not visible 
however is the reliability, the constraints, the operational thinking. 

It is seldom difficult to drift into this mode given how the current agentic 
tooling makes you feel more productive because of how you are always generating 
something. In your head, you are always on the move. A good way to summarize 
this would be 

1. Immediate feedback from AI tools short-circuits the loop
2. Shipping "something" is easier than owning "something"
3. Social validation favours demos over durability
4. Hard problems get naturally deferred to a different timeline

At this juncture, it is important to realize that generating is not the same as 
building. None of this is malicious in and itself, however it is simply the path 
of least resistance!

# You are underqualified to be the harness

There is a subtle shift happening right now in how software is being written.
The developer has moved away from writing code to being a harness. His job is 
to take generated output, stitching it coherently and deciding what is acceptable.

Now that is a role assumes something important: **judgement**

If you do not have technical depth to do a comprehensive evaluation of the 
generated code, then you are failing as a harness. You are just a conduit.

You lean towards accepting what "looks right", often optimizing for local 
correctness without capturing the global intentions, correctness and 
trade-offs being made by this change.

This becomes more and more dangerous as you move up the stack.

A simple function generated has very little blast radius. However, when it 
starts influencing system design. Things like service boundaries, data-flow, 
retry semantics and consistency models; that's when the consequences can 
start compounding. Poor decision at the higher level are not obvious 
immediately. They surface their ugly head under load, failure and when 
software has to evolve.

At that point, the system has lost its malleability and hardened itself 
around those poor decisions. The problems at the level of architecting the 
system itself cannot be patched immediately. They are fundamental.

Without a strong mental model, you cannot push back on what AI suggests. You 
find yourself unable to reject a solution that works in isolation but breaks 
the global state. This loop reinforces itself as you rely more on generated 
output due to its velocity. Your evaluation capabilities do not keep up 
pace with this and eventually you have a system out of your control.

This is not an argument against AI. It is an argument about responsibility. If 
you are using AI as a force multiplier, you need to have something worth 
multiplying. That something is judgement built from experience and accumulating 
scar-tissue with real systems, real failures and real constraints.

In the absence of sound judgement, you are not accelerating. You are snowballing 
bad decisions which you do not fully comprehend. 

The bill comes due.

# My current state

With that being said, I am not outside of it. I am exactly in this radioactive 
vat of chemicals, decaying by the minute ...

It feels like I have not shipped anything meaningful in a long time. Ofcourse 
I have written code, explored newer systems, learned tools and started in 
a multitude of directions, however, matter of fact is that I have not taken 
something from idea to a durable, usable artifact that I own end-to-end.

It's not a knowledge problem, it a failure in execution.

Starting is comfortable, finishing is not. Starting smells like momentum but 
finishing forces constraints, edge cases, failure planning and decisions that 
would be irreversible. The moment something is real, it can be evaluated and 
criticized. Without more eye balls on software, it remains sheltered and safe.

I have been playing it safe...

# Diagnosis

So, what has actually gone wrong in the past 2 months. Here are the patterns 
that I have noticed:
1. Over-optimization for learning instead of output
2. Too many parallel tracks with no primary direction
3. Lack of deadline, accountability and constraints
4. Bias towards starting but not finishing

All of this culminates into motion without completion signals.

# Time to rollout a fix

The adjustment to make here would not be to reject AI tools or quick 
iteration outright. Those are definitely useful. The adjustment would be to 
anchor them within a system that prioritizes depth and completion.

This means, committing to a single project with a clear definition of being done.

Let's start with the negative space. Things not to do:
1. No scope expansion for novelty
2. No parallel projects
3. No mid-cycle direction changes

So, here's the direction that I am taking. Build a production-grade **calling 
agent system** end-to-end. It is a system that handles external state, manages 
state overtime, and operates under real constraints.

The system addresses the following backend challenges:
1. Call orchestration: initiating and managing outbound calls
2. Scheduling: maintaining call windows, retries and rescheduling logic
3. Webhooks: sending out call completion status as well as summary reports
4. Job queues: decoupling the call execution service 

"Done" will mean:
- A working system that can execute discovery calls
- Reliable handling of webhook events with idempotency guarentees
- Queue-based processing with retries and failure isolation
- A clear and observable flow

# Deep work is the requirement

This kind of system cannot be built on shallow cycles. The underlying 
sub-problems need sustained long-term attention. Deep work is not a preference 
here but a requirement.

So, the mode of operating shifts as follows:
1. Fewer inputs, longer cycles
2. Focus on resolving one problem fully before moving on
3. Output measured in completed components, not activity

Ground rules:
1. Fixed blocks on uninterrupted work
2. One problem at a time
3. No tool of context switching within a block
4. Daily output as code and not notes of vapour-ware 

While this is slow, it is also the only way in which I can produce something that
would hold up!

# Commitments

This blog is not an outlook on the industry. It is just a collection of 
gaps and corrections on how I need to operate.

I need to narrow the scope, commit to finishing, and accept the slower process 
of building something real.

The metric to optimize for is to define problems clearly, build the system 
that addresses it and carry it through till completion with reliability, 
observability and maintainability.

That's what I am going to ship.

---

# Honourable Mention

[Kiran Rajeev KV](https://github.com/KiranRajeev-KV) for suggesting the 
section on [you are underqualified as a harness](#you-are-underqualified-to-be-the-harness)
and proof reading the blog as always.
