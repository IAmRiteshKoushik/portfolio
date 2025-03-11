# ---
title: "Mar 11 : Blazingly Fast Bounties at Winter of Code!"
description: "Cloudflare is severely underrated. Period."
date: "Mar 11 2025"
---

## Setting the Context

Recently, on February 28th, 2025; my university concluded it's first open-source
fest - [ACM Amrita's Winter of Code : S1](https://woc-leaderboard.vercel.app).
A program that brought in 15 projects, 10 maintainers and 50 active
contributors with a bounty total amassing upto 7k over a span of two months.

In this article, I am going to dive into the tech behind our `leaderboard` and
`bounty-dispatcher` and how it operated for 2 months at 0 infrastructure-cost!

## Why A Bounty Program ?

When [Ashwin Narayanan S](https://github.com/Ashrockzzz2003) and
[Abhinav Ramakrishnan](https://github.com/Abhinav-ark/) invited me to join the
the organizing committee for an open source program, there were no plans of having a
leaderboard, let alone a bounty program. We borrowed ideas from the very popular **Hacktoberfest**
and decided that it would be better if the rewards could be dispatched amongst
all contributors as opposed to keeping it only for the top 3 finishers.

Thus, came the challenge of maintaining a leaderboard, updating it LIVE,
dispatching bounty points to each contributor and keeping it cost-effective.

## Tools in The Toolbox

1. With previous experience in the MERN stack and having dealt with [Next.js]()
codebases, it was a no-brainer that the website would be built with it and
hosted without any cost on [Vercel](https://vercel.com/).
![Next.js and Vercel Logo](https://media.licdn.com/dms/image/D5612AQGjXxMYZMN4qA/article-cover_image-shrink_600_2000/0/1721181280248?e=2147483647&v=beta&t=TOPNaWfuwSyS7RLHzjTuHQCZ08vZWN_vI3pT4xSth1k)

2. Our database requirements were met using [Neon - Serverless PostgreSQL]()
which offers a very generous free tier of hosting a PostgreSQL node at 0.25
vCPU and 112 concurrent connections every month for a lifetime.

![Neon Postgres](https://repository-images.githubusercontent.com/351806852/89a8b7e1-0686-4503-8d3f-c76e06047a00)

> Interestingly, with the sporadic nature of distributing bounties and marking
issues as "acceptable" from the Winter of Code program, our choices came down to
writing a full [Express.js]() backend or using a serverless platform.

For serverless platforms, our options spanned across
1. [Firebase - Google's Mobile and App Dev Platform](https://firebase.google.com/)
2. [Appwrite - Build Like a Team of 100s](https://appwrite.io/)
3. [Supabase - Build in a Weekend, Scale to Millions](https://supabase.com/)

Each one of these came with a `database` and an `oAuth` integration too. The
only problem with these three were that we would not require their extensive
capabilities. Additionally, we didn't trust ourselves enough to not write
something incredibly stupid like -
```js
const API_LIMITS = 1000000
for (let i = 0; i < API_LIMITS; i++){
  await fetch("api.url.here", { methods: "GET" })
}

// If you know, you know :)))
```

Jokes apart, I have never been a big fan of the pay-as-you-go model which Firebase
employed. Supabase and Appwrite were more approachable in that regard but time and
development speed were of essence, and I had seen what Cloudflare could do!

`1,00,000` free api invocations per-day,
logging and metrics dashboard, and an average deployment time of `~3 seconds`
using their `wrangler-cli`. Perfect place for messing up at-scale :)

Alternatively, we did consider self-hosting an Express server on a Raspberry
Pi, courtsey of Abhinav Ramakrishnan's home-lab shenanigans :) but it was
ruled out in-favour of Cloudflare for reasons yet-to-be-discovered.

3. Hence, final piece of the puzzle, [Cloudflare Workers]() written in the
serverless framework [Hono.js]() that would interface with GitHub and Neon to
capture all bounties and update them in the database.

![Cloudflare](https://cf-assets.www.cloudflare.com/slt3lc6tev37/51lajZjkeMPRXXEJJSjcVm/de01b00d3bba248d3a833ab7af9fa504/Network_Connectivity_plus_Zero_Trust_Security_Diagram.svg)

## Off to The Code Editors (VSCode / Neovim)

- For the UI, we quickly laid the scope that we would only build a leaderboard
and display all the projects. There would not be anything fancy other than a
pile of snow and snowflakes.
- `Auth.js (prev. NextAuth)` and `GitHub oAuth Provider` were our go-tos for
handling authentication and session management inside of `Next.js`
- The database schema was whipped and migrated in less than 20 minutes using
`Prisma`, with enough seed-data to help out with all our testing procedures.

## GitHub WebHooks to Dispatch Bounty, Handle Issues and Pull Requests

With our fallback plan being a `google-sheet` where each maintainer manually
records the bounty and we update the database every night to display the updated
stats of the leader, we started looking for better solutions.

At this stage, we came across GitHub's event-driven architecture and how they
have a webhook integration service where you could setup URLs and every time an
event occured, GitHub would make an API call to your backend.

We decided to generate a `cuid` for each of our repos and hardcoded a
record-map.
```ts
const Hooks: Record<string, string[]> = {
  // QSE
  "c147g7ek100009l2001": ['Abhinav-ark', 'Ashrockzzz2003'],
  // Amrita PYQ
  "c147g7ek100009l2002": ['Abhinav-ark', 'Ashrockzzz2003'],
  // Amrita Map
  "c147g7ek100009l2003": ['Abhinav-ark', 'Ashrockzzz2003'],
  // ... +10 more
}
```

Our webhook URL looked like `riteshkoushik39.cloudflare.dev/:unique-cuid-here`

Each repository was configured to send requests to their unique URLs and handle
the following events :

```js
"ping" // Onboarding a repo to the program
"issue.labelled" // For marking an issue with "AMWOC" tag
"issue.unlabelled" // For removing an issue's "AMWOC" tag
"issue.assigned" // For handling assignments to contributors
"issue.unassigned" // For removing assignments to contributors with no progress
"issue.closed"
"issue.reopened"
"issue.issue_comment" // For capturing "/bounty <amount> @username"
"pull_request.labeled" // For marking PR with "AMWOC-accepted" tag
"pull_request.unlabelled" // For removing PR's "AMWOC-accepted" tag
```

Here, we made use of the above created `Hooks` record-map in TypeScript to
map the maintainers who are allowed access to each repos' actions such as
marking an issue as completed, assigning issues and dispatching bounties.

All database calls were writting in raw-SQL with transactions and rollback
mechanisms to handle errors. Cloudflare's logging dashboard came in handy to
test things post-deployment as all `console.logs()` were directly visible without
the need of a separate logging library.

While we did run into some JSON serialization bugs from time to time with the
dreadful `[Object object]` popping up occassionally, those bugs were squashed
with an hour.

And then, distaster struck ...

## Meta didn't add support for Recoil in Next.js v15 :((

We had previously worked with `recoil` the popular and React friendly
state management library by `Meta (prev. Facebook)` and were incredibly confident
of using it for the leaderboard. However, during development of the leaderboard,
`Next.js v15` was being used as it had come out 2-3 weeks prior and it
had `react19-canary-release` as a dependency. The `recoil` project had been
in a state of mess where no efforts to migrate the package to support React-19
were being made and we, the naive developers reamined blissfully unaware of it.

Check out the issue: [React 19 support #2318](https://github.com/facebookexperimental/Recoil/issues/2318)

Well, we were not the ones to give-up.
![Zustand: Bear Necessities for State Management](https://i.ytimg.com/vi/fZPgBnL2x-Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB2hbhUEcv52h8eq2L1X51N-iq1QQ)
- Post dinner, we picked up [Zustand](https://zustand-demo.pmnd.rs/), a new and optimized
state management library and rewrote all of our in-browser data stores in it.
- With 30+ hours of building, testing and prettifying under the belt.
[Vijay SB](https://github.com/vijaysb0613) and [Kiran Rajeev](https://github.com/KiranRajeev-KV) had the platform ready and deployed at `11:52PM`.
- Interestingly, this was way-past Ashwin's bedtime but I was obviously gonna
torture him to wake up, onboard the projects and all the participants to the platform.
- `1:12AM` at night, we are online and ready to send out a university wide
notification during the early hours of the day.

Inner peace.

## Footnotes for our Successors

![Torch Passing Image](https://media.istockphoto.com/id/1485095544/vector/torch-relay.jpg?s=612x612&w=0&k=20&c=8PvRV1RPMmww0Yl-37bKgRq1ofr-tYMqiwF6yKmKSWk=)

Some obvious improvements required in the future iterations of this program:
- Use `<image>` tags instead of `next/image` as we ran out of [Vercel's -
Image Optimization Limits]() on the final day of the program. This led to
profile photos not loading for anyone who cleared the browser-cache or loaded
the website for the first time.
- Cache out requests in `cloudflare kv` or any other service such that
calls to the entire database could be reduced. While it affects, the instant
updation of the leaderboard; it is a good trade-off to save compute resources.
- Setup CI/CD for the serverless function instead of manually depoloying via
`wrangler-cli`.

Here are the repositories which contains the code to our `leaderboard` and
`bounty-dispatcher` service.
- [woc-leaderboard](https://github.com/Infinite-Sum-Games/woc-leaderboard)
- [woc-workers](https://github.com/Infinite-Sum-Games/woc-workers)

Credits to the batch of 2023-27 for building the platform:
- [Vijay SB - CSE C](https://github.com/vijaysb0613)
- [Kiran Rajeev - CSE G](https://github.com/KiranRajeev-KV)

<br>

*Until next time. RK out!*
