---
title: "Weeknotes: Week #35 - 2026"
description: "Quite the whirlwind, and more homelab experiments"
date: "Aug 29, 2026"
draft: false
---

This week has been an exploratory deep dive into quite a few of 
[Planetscale's engineering blogs](https://planetscale.com/blog/category/engineering). 

As I started tinkering with [k3s](https://k3s.io/) on my homelab I realized how 
fast the ecosystem is how sane the defaults of this lightweight kubernetes 
distribution are. It's the easiest one to quickly get up and running with for 
my homelab and most homelab needs and does not compromise on capability. 

Currently I do not see any particular reason to switch out any of the default 
components with it's alternatives with the exception of `Flannel` in favour of 
a different CNI plugin like `Cilium`. This is less about me finding a better 
alternative and more along the lines of trying out a new component.

For the first set of explorations, I have been wanting to try out `forgejo` as 
an alternative to GitHub, with the recent GitHub outages I might actually feel 
more comfortable having a private copy of it as well and it can actually come 
in handy. What I did discover interestingly is that it does provide runners 
too for CI/CD tasks. 

Earlier I was thinking more along the lines of using webhooks with Jenkins but 
now I think it might just be better to use Forjego runners and get it done for 
my homelab. Although, I am curious about a couple of other CI runners like 
Woodpecker CI and Circle CI, all in due time. 
