---
title: "The Anokha Runtime - 2026 Edition"
description: ""
date: "January 17 2026"
---

## Setting the Context

With Anokha 2026 recently concluded, I believe it is time that we pop the hood 
and take anyone who is interested in computer science, through a journey of our 
choices and principles in designing the backend of this year's fest. 

There has been a realization that the knowledge and experience gained during 
building the tech that powers this massive fest of 5000+ students, 100s of
organizers, admins and hospitality staff over a month and 3 nights; is quite siloed!
So, I have decided that that's gotta change.

If you are someone, who wants to jump directly into the code, [here you go.](https://github.com/Infinite-Sum-Games/anokha-2025-backend)

> Beaware, it's not very documented. That's why this blog :)

A quick rundown of the tech-stack and links to their corresponding libraries:
1. [Go 1.24.1](https://go.dev/)
2. [Paseto Auth Tokens](https://aidanwoods.dev/go-paseto)
3. [Gin - HTTP Web Framework](https://github.com/gin-gonic/gin)
4. [Goose - Database Migration Toolkit](https://github.com/pressly/goose)
5. [SQLC - ORM without an ORM](https://github.com/sqlc-dev/sqlc)
6. [PostgreSQL - Relational Database](https://github.com/jackc/pgx/v5)
7. [RabbitMQ - Message Queue](https://github.com/rabbitmq/amqp091-go)
8. [KSUID - Trace IDs](https://github.com/segmentio/ksuid)
9. [Prometheus - Metrics](https://github.com/prometheus/client_golang)
10. [Gofakeit - Test Data Generator](https://github.com/brianvoe/gofakeit/v7)
11. [Ozzo-Validaton - Input Validator](https://github.com/go-ozzo/ozzo-validation/v4)
12. [Gomail v2 - Mailer](https://gopkg.in/gomail.v2)
13. [Viper - Configuration Management](https://github.com/spf13/viper)
14. [Zerolog - High Performance Logger](https://github.com/rs/zerolog)
15. [Bruno - Git-Friendly API Client](https://www.usebruno.com/)
16. [Drizzle Gateway - DB Viewer](https://gateway.drizzle.team/)
17. [Air - Hot Reload for Go](https://github.com/air-verse/air)

## Understanding our Scale

Before we begin, let's take a look some of the numbers so that we can have an 
understanding of the scale that we are handling.

1. Number of portal registrations: 5500+
2. Number of tickets sold: 5000+
3. Number of events: 50+
4. Number of admins, organizers and logistics staff: ~150

Now, while these numbers may look big to some of you, the things to understand 
is the nature of the traffic that this brings in.

- The portal registrations and ticket traffic is split across 3 weeks.
- The check-in and check-out process for logistics and the event attendance 
process is concentrated on the 3 days of Anokha.

For this scale, you **DO NOT NEED** fancy software! You can choose any 
language, any framework and any database and it would work just fine!

A common sense principle here is to **NOT** reach for languages like Rust/Elixir
or try using NoSQL databases on the pre-tense that they "scale-better". You do 
not start thinking of database replication strategies, multi-server deployments, 
crazy load-balancing ideas or worse - throwing **Kubernetes** at the problem!

At our scale, writing better SQL queries using *Common Table Expressions*, 
monitoring database performance using [**pg_exporter**](https://grafana.com/oss/prometheus/exporters/postgres-exporter/), 
turning the knobs on different Postgres and [**pg_bouncer**](https://www.pgbouncer.org/) 
configurations and dumb caching are the common sense principles to apply.

The current API can handle - 10,000 concurrent connections but the bottleneck 
is the database. It can only do ~500 queries at one time.

---

We were provided with a **16GB RAM, 2.1GHz, 512GB SSD** server to host all of our 
portals, backend services and the database and not once have we crossed more than 
30% RAM utilization.

The few times, that the portals went unresponsive, it was our fault! It was 
code written poorly out of inexperience.

## All You Need is Postgres

With the drama and the warnings out of the way, let's take a bottom-up approach.
Where does the data reside ? In the previous iterations, Anokha ran successfully 
on MySQL. This time around, we wanted to try out PostgreSQL.

The reasoning behind this decision came about like this:

1. PostgreSQL has a very rich extension system. We wanted to be able to tap into 
some of that. Here's an [exhaustive list](https://supabase.com/docs/guides/database/extensions?queryGroups=database-method&database-method=sql) 
for the curious.

2. PostgreSQL is known to have good support for arrays and JSONs. The current 
team of developers love to write less code in the application layer. Letting 
SQL do the heavy lifting was playing well with our vices.

3. The team had good experience in using PostgreSQL and Go due to our previous 
work at [ACM's - Amrita Winter of Code](https://woc.anokha.amrita.edu) and 
using [Supabase](https://supabase.com/) for hobby projects.

Although, if you are a MERN stack developer and are questioning why not to go 
with something like MongoDB or Cassandra, here's my answer: 

RDBMS works, almost always! 95% of business problems can be reduced to CRUD 
represented as relational data that needs ACID guarantees and can be queried
very easily using SQL. There is no necessity to look for a NoSQL or a distributed 
database by sacrificing curcial RDBMS business features at the peril of 
reinventing them in application code. 

Harness the strength of SQL. For combining our application code with SQL, we 
used a code generation tool called - `sqlc`. Here's our configuration:
```yaml
version: "2"

sql:
  - engine: "postgresql"
    queries: "db/queries"
    schema: 
      - db/migrations
    gen:
      go:
        emit_methods_with_db_argument: true
        emit_json_tags: true
        package: "db"
        out: "db/gen"
        sql_package: "pgx/v5"
        overrides:
          - db_type: "uuid"
            go_type:
              import: "github.com/google/uuid"
              type: "UUID"
          - db_type: "timestampz"
            go_type:
              import: "time"
              type: "Time"
          - db_type: "json"
            go_type: "encoding/json.RawMessage"
          - db_type: "jsonb"
            go_type: "encoding/json.RawMessage"
```

Using `sqlc` allowed us to just write SQL queries and type-safe Go code would be 
automatically generated for us. Personally, I have found this approach better 
than using ORMs where you start contorting the ORM-specific syntax to reach 
for complicated JOINs, subqueries, nested queries and CTEs.

## Database Schema, Beyond the Classroom

Writing database schema is usually a boring and mudane task in classrooms and 
assignments, but when building a production-worthy system, this is one of the 
most crucial steps. 

Good API design stems from good database design. A well-thought out database
allows us to write simple queries and grab all the necessary data in a single 
shot. Making multiple round trips to the database adds **latency**. A good 
database design also allows us to write less application code and let SQL 
do the heavy lifting for us.

However, good database design does not mean you pull out a textbook and start 
reaching for **3rd Normal Form** or **BCNF**. Normalization is great is theory, 
but only decent in practice. As a developer you need to understand, that 
the more you normalize data, the more **JOINS** you need to aggregate simple data.

Queries with too many joins are inherently slow.

Denormalizing is an approach used by companies to avoid costly JOIN operations. 
A good way to analyze this is to check for query performance using 
`EXPLAIN ANALYZE().` You must realize that disk storage is nearly endless in 
2025. Redundancy is an acceptable trade-off to gain performance benefits.

In case this is difficult to digest, treat it like dynamic programming from DSA
lectures. Trade space to save time. Memoize.

As for a quick rundown of the DB schema, here's an oversimplification of the 
essentials:

1. Students
2. Admins
3. Events
4. Bookings
5. Attendance
6. Accommodations
7. Favourites

You can view the complete schema by cloning the repository, migrating the DB 
using `goose` and using something like `pg_admin` or `drizzle-gateway` for UI.

## Why Did We Use Golang

A few paragraphs earlier, you heard me urging you to use any technology and not 
reach for optimized and unknown tech like Rust, but here we are, having used 
Golang. 

Hypocrisy ? You find out.

Previously, the backend was written in JavaScript and even before that, it was 
perhaps PHP. While we could have written it in Python, the seniormost folks 
in the team had extensive experience with Go.

This language seems to make the perfect trade-off between simplicity, performance,
ease of building concurrency and ease of deployment. There were battle-tested 
libraries for everything we needed. 

As more and more developers start building, the need for software to be simple 
to read and implement is of utmost importance. Having written the system in Go, 
we do hope that it'll cause a chain reaction leading to birthing of more Go 
developers in the future.

## Cookie Based Authentication

Another new paradigm we wanted to roll out was moving away from token-based 
authentication to a cookie-based system. While this came with it's own 
challenges, the motivation to build it was as follows:

- Simplify auth for frontend developers. They do not have to manage and move 
around tokens as a shared state across different web pages.
- Mint new auth cookies based on refresh cookies automatically without a dedicated 
`/refresh` endpoint that is seen in token-based auth systems. Leads to less API calls.
- Forbid access and ban individuals as and when necessary.
- Better security and less chances of tampering.
- CSRF protection on all form submissions.

Here's a small code snippet for your understanding:

```go
func SetCookie(c *gin.Context, authTokenString string) {
	if viper.GetString("env") == "PRODUCTION" {
		c.SetSameSite(http.SameSiteStrictMode)
	} else {
		c.SetSameSite(http.SameSiteNoneMode)
	}
	c.SetCookie(
		"token_type",       // access, refresh, csrf
		tokenString,        // value
		3600,                 // maxAge (1 hour)
		"/",                  // path
		cmd.Env.CookieDomain, // domain
		cmd.Env.CookieSecure, // secure
		true,                 // httpOnly
	)
}

// We would revoke the token that is being sent in the cookie 
// incase of logouts
func RevokeRefreshToken(c *gin.Context, email string) {
    ctxTime := 15 * time.Second
	ctx, cancel := context.WithTimeout(context.Background(), ctxTime)
	defer cancel()

	conn, err := cmd.DBPool.Acquire(ctx)
	if HandleDbAcquireErr(c, err, "AUTH") {
		return
	}
	defer conn.Release()

	isStudent := c.GetBool("STUDENT-ROLE")
	isOrganizer := c.GetBool("ORGANIZER-ROLE")
	isAdmin := c.GetBool("ADMIN-ROLE")
	isHospitality := c.GetBool("HOSPITALITY-ROLE")

	q := db.New()

	if isStudent {
		_, err = q.RevokeRefreshTokenQuery(ctx, conn, email)
	} else if isOrganizer {
		_, err = q.RevokeOrganizerRefreshTokenQuery(ctx, conn, email)
	} else if isAdmin {
		_, err = q.RevokeAdminRefreshTokenQuery(ctx, conn, email)
	} else if isHospitality {
		_, err = q.RevokeHospitalityRefreshTokenQuery(ctx, conn, email)
	}

	if err != nil {
		Log.ErrorCtx(c, "[AUTH-ERROR]: Failed to revoke in DB", err)
		return
	}
	Log.InfoCtx(c, "[AUTH-INFO]: Successfully revoked in DB")
}
```

## Special Events and RabbitMQ

While quite a late addition to the stack, there was this lurking problem of 
having to dispatch data to two uniquely positioned stake-holders:

1. The organizers of AI-Verse Hackathon
2. The organizers of ACM's Winter of Code 2.0

Both of these parties wanted to have the data sent directly to their backend 
servers for further processing. Initially, we thought we would send over CSV 
files to the organizers at the end of each day, but where's the fun in that ? 
We spoke to each of them and decided to build a webhook service :)

The workflow is as follows:

- The corresponding events was tagged with a special string, like - `!woc`
- As soon a payment is successful for any event, we scan for the special string
- If the event bears a special tag, we craft a customized payload bearing the 
data the respective organizers needed. Here's an example:

```json
{
    "team_name": "Fight Club",
    "leader_name": "Tyler Durden"
    "leader_email": "tylerdurden@fightclub.com",
    "leader_phone_number": "9999955555"
    "leader_college_name": "Fight Club Insitution",
    "problem_statements": ["agentic_ai", "generative_ai"]
    "team_members": [
        {
            "name": "Srikant Tiwari"
            "email": "srikanttiwari@fightclub.com",
            "phone_number": "9999911111",
            "college_name": "Fight Club Institution"
        },
        {
            "name": "Bhiku Mhatre"
            "email": "bhikumhatre@police.com",
            "phone_number": "9999922222",
            "college_name": "Police Insitution"
        },
        {
            "name": "Sardan Khan"
            "email": "sardarkhan@gow.com",
            "phone_number": "9999933333",
            "college_name": "Gangs of Wasseypur"
        },
    ]
}
```

- The payload would then get pushed to different queues inside of RabbitMQ 
awaiting to the consumed.
- On the other end of the queue, our consumer process - [termite](https://github.com/IAmRiteshKoushik/termite)
would be listening for any enqueued events and immediately dequeue them and 
make an HTTP request to the pre-configured webhook URL.

This approach made the data dispatch asynchronous from the backend's operations. 
In-case there was a failure on the dispatch side, retries are built in and the 
primary API stays unaffected.

This also proved that we would make data better available to other organizers 
in the future. Termite can be a fully fledged platform for webhook dispatch, 
retries and monitoring.

## On Managing Infrastructure

### a. Caddy - Reverse Proxy and Load Balancer
On our server, we ran an instance of [Caddy](https://caddyserver.com/) to 
serve all of our applications. Historically, we have used Nginx and for good 
reason. It is undoubtedly the most perfromant load-balancer and reverse proxy 
out there, however for our needs, we wanted to use something that offers 
decent performance and has minimal syntax to make changes.

1. Caddy comes with very minimal configuration to serve static pages or be a 
reverse proxy.
2. It has automatic HTTPS and SSL renewal, so we do not have to configure a 
`certificate authority`.
3. It can serve certificates by itself through `internal tls` so that we can 
get HTTPS even when the outside world is blocked by our VPN.

Here's what our config looked like:
```bash
anokha.amrita.edu {
    # Grafana UI
    reverse_proxy /grafana* localhost:9100

    # Admin portal
    reverse_proxy /admin/* localhost:5173

    # Organizer portal
    reverse_proxy /org/* localhost:4173

    # Hospitality portal
    reverse_proxy /room/* localhost:4174

    # QR Scanning App
    reverse_proxy /app/* localhost:4175

    # Backend
    reverse_proxy /api/v1* localhost:9000

    # Main Website
    reverse_proxy localhost:3000
}
```

### b. pm2 - The Background Process Manager
We have all done - `npm run dev` and `npm run start` to run our applications 
while developing locally, but the question is - how do you serve them as a 
background process which keep running after you have logged out of the SSH 
window to your server.

The traditional way to do it in a linux machine is to use `.service` files and 
start them as follows:
```bash
sudo systemctl start app.service
sudo systemctl status app.service
```

A more convenient solution was to offload this entire process to [**pm2.**](https://pm2.io/)

Initial setup:
```bash
pm2 start "make run" --name backend
# or 
pm2 start "npm run start" --name frontend
```

Redeployments:
```bash
git pull <repo-name>
make build # (or) npm run build
pm2 restart <app-name>
```

### c. Prometheus, Grafana and Exporters
As part of our monitoring stack, we use Prometheus as a time-series database 
and added the prometheus middleware to our Go application for scraping metrics.

Additionally, we used:
1. Postgres exporter and
2. Node exporter

To pull metrics and data from PostgreSQL server and the VM itself that was 
running everything. Grafana became our pretty visualization dashboard where we 
used pre-built dashboards by the community.

---

This allowed us to have a quick, and zero-configuration observability setup that 
came in handy when we faced a `Denial-Of-Service` attack. The Grafana dashboard 
highlighted a network traffic spike and when we checked the logs and found 
out the IP addresses attacking us, we were able to block them instantly using 
minimal configs in Caddy.



## An Ode to The Next Generation of Builders

This blog would have given you an extensive breakdown of how the 
backend works, there are still a bunch of pain-points that need solving. Here 
are the problems that we left unsolved:

1. Current logger, while shows more information, is not absolutely unreadable in 
production. Additionally, it can log the incoming requests and responses.

We need a better logging solution which is cheap of resources. I would 
use something like [**Vector**](https://vector.dev/docs/setup/deployment/roles/)
to transform the logs. It comes with **Vector Remap Language (VRL)** which is 
great for parsing logs and redacting sensitive information. For the log-sink I 
recommend [**VictoriaLogs**](https://victoriametrics.com/products/victorialogs/),
it has great ingestion capabilities of different log formats and pairs pretty 
well with Vector.

2. We need to move configuration management from **viper** to [**koanf**](https://github.com/knadh/koanf). 
It is a newer library from the Zerodha team that has cleaner syntax, and does not 
bloat up your final compiled binary by adding in all kinds of parsers even if 
you don't need them. It is also free of [data races that occur in viper.](https://github.com/spf13/viper/issues/174)

3. Due to constraints of time and other feature requests taking precedence, we 
could not roll out a rate limiter. It would be a great addition to the current 
backend. Ideally, we would need something as follows:
    - Token-Bucket algorithm on unprotected routes
    - UserID based rate-limiting on protected routes

4. Webhooks based solution for managing Payment infrastructure. Currently, we 
use PayU, which in all sincerety is a terrible payment gateway to deal with!
They have an frequent issue of payments being marked as **SUCCESS** but their 
**Payment Verification API** misreporting it as **FAILED**. 

This problem made us release seats that we hold until the payment has either 
failed or succeeded to avoid the overbooking problem. However, in the end, there 
was a decent level of manual work involved in retrying failed payments. Managing 
this via webhooks is a much better option.

At the time of writing, there is a [hanging PR](https://github.com/Infinite-Sum-Games/anokha-2025-backend/pull/237) 
which allows the admins to create a dispute whenever a payment discrepancy issue 
is reported. Another PR which has a [better reverify mechanism](https://github.com/Infinite-Sum-Games/anokha-2025-backend/pull/228) was also written 
but could not be merged due to constraints of time and prioritization issues.

If there is any possibility,  please opt for something better like Razorpay!

5. Separate out the data for prices. Allowing an event to have multiple price 
tiers is a beneficial feature in my opinion. You can enable offers and 
discounts by removing the 1:1 mapping of event to price.

6. Setup continuous deployment using GitHub's webhooks and our 
[self-hosted Dokploy](https://dokploy.com/) instance on CORE lab's infrastructure.

7. Unify all the different roles into a single user table. This time, while we 
rolled out cookies, there was an acute problem. Once you sign into one portal, 
you were mandatorily signed out of another one. This happened due to each user 
persona - admin, student, etc; getting unique accounts with unique roles. Next 
time around, it's imperative to have all the roles added to the same user and 
change the claims of the auth token. This would bring forth a couple of changes 
in DB schema as well. Here's a [suggested schema.](https://www.better-auth.com/docs/concepts/database#core-schema)

8. Apart from these, there are a few [open issues.](https://github.com/Infinite-Sum-Games/anokha-2025-backend/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen)

## Closing Thoughts

We tried do the best with what we had within the time we were given. This is 
probably our best work yet. We hope that you would take up the codebase and 
grow it further. This time around, we wrote it with the motivation that it can 
be extended and grown instead of being rewritten every year. 

If you are interested, you can find a more comprehensive wishlist [here.](https://www.notion.so/Anokha-27-Tech-Wishlist-2e27a16c8837804bad23d22932104b14)

Cheers! To the entire Anokha '26 Web Team, in no particular order:
- [Tharun Kumarr A - 4th Year (Head)](github.com/TharunKumarrA/)  
- [Thanus Kumaar A - 4th Year](https://github.com/Thanus-Kumaar/)
- [Naganathan M - 4th Year](https://github.com/Naganathan05)
- [Revanth Singothu - 4th Year](https://github.com/rev-sin)
- [Adithya Menon R - 3rd Year (Co-Head)](https://github.com/adithya-menon-r)
- [Kiran Rajeev - 3rd Year](https://github.com/KiranRajeev-KV)
- [Vijay SB - 3rd Year](github.com/vijay-sb/)
- [Shivanesh M - 3rd Year](https://github.com/shivanesh1495)
- [Keerthivasan V - 3rd Year](https://github.com/Keerthivasan-Venkitajalam)
- [Amrith B - 3rd Year](https://github.com/AMRITH03)
- [Akshay KS - 3rd Year](https://github.com/akshayks13)
- [Nandgopal Nair - 3rd Year](https://github.com/Nandgopal-R)
- [Saran Hiruthik - 3rd Year](https://github.com/SaranHiruthikM)
- [Minoti Gupta - 2nd Year](https://github.com/MinotiGupta)
- [Samith Reddy - 2nd Year](https://github.com/samithreddychinni)
- [Shruhath Reddy - 2nd Year](https://github.com/Shruhath)

and myself.

Once again, you can find all the code [here.](https://github.com/Infinite-Sum-Games/anokha-2025-backend)

---

Thank you for reading! Keep playing the infinite sum games.

**Ritesh Koushik**
