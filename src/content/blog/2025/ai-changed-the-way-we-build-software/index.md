---
title: "Terraforming the Software Development Landscape with AI"
description: "Paradigm shifts and newer thinking models in an AI-first world"
date: "August 17 2025"
---

## Setting the Context

With the release of Gemini CLI and Claude Code, AI-code assistants are now 
right within the grasp of your terminal. I have been a relucntant user of AI 
where I have consciously chosen to keep them limited to the browser window and 
now allow them deadly close to my text editor. I chose this approach for a 
couple of reasons:

1. Coding agents can often read your secrets and environment variables `.env`. 
While we have specific files like `.cursorignore` and `.gitignore` which are 
parsed by these LLMs to avoid touching certain files for context, I am still 
quite skeptical about them. 

2. Skill atrophy with generating code instead of writing it by hand because 
humans learn from `time under tension` and productivity does not play well in 
this regard where time needs to be spent for learning.

## So, why the Switch ?

Lately, I have started feeling that I am not as productive as my co-workers. I 
have come across individuals who are able to balance between not sacrificing 
learnings while supplementing it with development speed and this got me 
thinking that there are probably more dimensions to thinking about AI than my 
currently held opinions. So, I decided to crawl the internet in search of 

_"How senior engineers use AI to accelerate development ?"_ - blogs. And sure 
enough I land up at this [video](https://youtu.be/3VQhdXcQ5qI?si=ZMdGzUfHpBPckL6n) 
by ForrestKnight. So, in this blog, I am going to summarize some of my key 
learnings surrounding this paradigm and how I have started coding better and 
faster with AI.

## Planning and Architecture
The conventional way to start with a project or developing a new feature for an 
existing project is to: 

1. Gather requirements

2. Whiteboarding the flow of data

3. Review and refactor schemas

4. Think of edge-cases and spikes

5. Get a green signal from your team

6. Document your new specifications

7. Start coding

While this has stood the test of time and will continue to do so in the future 
as well, there are ways to streamline and accelerate some of these steps. 

- Firstly, you can take all your initial requirements submitted to you by different
stakeholders. These requirements can be in different files, scattered text and 
photos. All of these can be dropped into a single LLM conversation (chat) and 
ask it to convert it into a [Product Requirement Document (PRD)](https://www.productplan.com/glossary/product-requirements-document/)

- Secondly, you can take photos of your whiteboarded data flow, drop them in your
chat and ask it to convert it into a [mermaid-diagram](https://mermaid.js.org/).

Within these two stages, you can have a couple of conversations asking AI about 
things that you might be missing or if there is something that the team has not 
empahsized sufficiently on. As indie developers or small teams, this can be quite
invaluable to ship clean and well-built products within competitive timespans.


> Make sure to be the source of truth and don't oursource your entire thinking 
to AI by giving it a `feature` and asking it to build the entire PRD for you 
along with reasoning for each step and implementation. Borrow a wide-range of 
ideas, prototype with them quickly and then finalize.

Something to bear in mind is that, currently (in 2025), AI loves to be the guy 
who says "yes" to everything you throw at it. You need to carefully structure 
your prompts -- asking it to be critical of the ideas and leave certain things 
open-ended.

## Project Setup and Scaffolding

Let's talk about tools such as [lovable.ai](https://lovable.dev/), 
[bolt.new](https://bolt.new/), [v0.app](https://v0.app/) which claim to be a 
one-stop prompts-only platform to build your entire application in minutes using
AI. Well, that's hardly the truth. In reality, these are scaffolding tools and 
nothing more. Currently, all of these tools are very tech-stack dependent. Most,
if not all are completely reliant on [shad.cn](https://ui.shadcn.com/), 
[tailwindcss](https://tailwindcss.com/) and [next.js](https://nextjs.org/) along 
with a few other opinonated choices by the companies behind these tools.

With the recent episode of [AI going rogue](https://www.pcmag.com/news/vibe-coding-fiasco-replite-ai-agent-goes-rogue-deletes-company-database) and deleting an entire database of a 
production application which blew a hole through a startup, it is safe to say 
that these tools cannot take up all decision on their own and must be limited 
to scaffolding. If you are writing THE smartest prompts mankind has ever seen, 
and are immediately hitting that deploy button on these websites for anything 
beyond your DEMO projects / university projects, then it is time to think again.

Avoid plugging in prouduction services into your AI.

## Actually Writing Code

In the context of actually writing code, we have [cursor](https://cursor.com/), 
[vscode](https://code.visualstudio.com/), [zed.ai](https://zed.dev/) which are 
full-blown IDEs that capture the context and the relevant coding patterns in 
your existing codebases and then generates new code for you based on your prompts. 

For folks like myself who prefer to work closer to the terminal and use 
[vim](https://en.wikipedia.org/wiki/Vim_(text_editor)) 
or [emacs](https://github.com/doomemacs/doomemacs), there has been the advent of 
CLI tools such as [claude code](https://docs.anthropic.com/en/docs/claude-code/overview), 
[open-ai codex](https://openai.com/index/openai-codex/), 
[sst-opencode](https://github.com/sst/opencode),
[crush](https://github.com/charmbracelet/crush)
and [gemini-cli](https://github.com/google-gemini/gemini-cli).

All these tools are great for tasks such as:

1. Add error handling to this

2. Improve the logging statements

3. Implement a new feature on top of this

4. Convert this to typescript

5. Go through stacktraces to debug compilation and runtime errors

6. Autocomplete

7. Test cases

8. Assign it tasks from your Jira board

Now regardless of whether you wrote the code or whether AI did it for you, when 
you are opening a Pull Request and pushing to the `master` branch of your project
then that is on you! Always review, test and verify the code that has been 
written/generated. Understand what is going on in each of the functions. 

Bear in mind, that despite being in an AI-first world, when all hell breaks 
loose, it is still humans who are going to be reading the code alongside AI. 
Hence, code responsibly and not sloppily.

While putting AI agents to work, give it very very small tasks instead of asking 
it to build full blown features. Perhaps communicating with a browser-based LLM
interface beforehand to do some planning and then asking it to break it down 
into an exhaustive task list which you can share with your coding agent is much 
better. Here's how you can go about it:

1. `tasks.md` containing a checklist of sub-problems
2. `problems.md` containing explainations of each sub-problem

You can generate this using AI and refactor it as you see fit. Then feed it to 
your coding agent with explicit instructions on now to modify these. Now, as you 
finish each task, you can check them off at `tasks.md` and remove it's 
description from `problems.md`.

## Tests and Debugging

Let's face it, nobody really likes to begin writing test suites from scratch but 
often times, we do like extending them to increase coverage. Allowing AI to 
write the first batch of tests is great for your application if you intend to 
productionize it. This way, you atleast have some tests going on and later, you 
can expand it further to cover domain-specific edge cases.

For example: Your AI can validate emails through test cases, but you need the 
email to contain a certain set of character like `amrita.edu` to highlight that 
it is a university email only. These are specific bits of knowledge that you 
bring to the table.

Coming to the debugging part, developers can ask AI to run comamnds like 
`npm run dev` or `go run main.go` and this way, when the application errors out, 
AI would have direct access to the stack trace and can suggest tips as part of a 
debugging workflow.

## Leveraging Model Context Protocol (MCP)

Model Context Protocol has been an amazing addition to the AI-developers' 
toolbox. With this protcol, we can standardize access to different tools across 
the developer ecosystem. Being able to interact with different services without 
having to leave your coding environment is a huge plus for productivity and 
focus.

Some beginner friendly use-cases are:

1. GitHub MCP: Allowing LLMs to write relevant commit messages and good pull 
request drafts after completing of work

2. Postgres MCP: Allowing quick READ-ONLY data access for developers without the 
hassle of SQL and allowing non-developers for better insight through natural 
language queries

3. Supabase MCP: Developing and debugging the Supabase stack

Apart from these, a more sophisticated MCP workflow could look something like:

- Fetching logs from Elastisearch or ClickHouse for a certain duration using 
their respective MCP servers

- Fetching monitoring data from Prometheus for certain durations to correlate 
logs with incidents using Prometheus MCP

- Faster incident debug and response time

- Prepare incident report via a specialized agent

> Be careful with permissions and tool access while setting up you MCP server. 
Either work in READ-ONLY mode or have backups and work on them instead of 
querying data stores.

## Documentation

If you are one of those developers who do not like to write documentation, you 
can always outsource it to AI. Sometimes, you need to write JavaDoc or JsDoc 
within your codebase to document your code, you can ask AI to do that too as it 
is just comments which need very little testing. 

The human in the loop proof-reads it and then passes it off.

## Dockerfiles, Terraform Configs, k8s Manifests and GitHub Actions

Often times, writing configurations by hand is tedious and getting a boilerplate
to work out of is great. Now, bear in mind that if you are absolutely new to 
these configurations then generating a configuration file for the first time 
would mostly lead to an error or misbehaving configurations because you don't 
exactly know what you want and how certain configs collide with each other.

There is no general specification as configurations are specific to the tool. But 
that being said, grabbing an existing config from an open-source codebase and 
asking the LLM to explain it line by line is quite helpful.

> Documentation still is the best resource but is often overwhelming when you 
are breaking into a new technology and need a simple and dirty config that 
just works out of the box.

## API Testing and Security with AI

For testing your API using [Postman](https://www.postman.com/downloads/) or 
[Bruno](https://www.usebruno.com/), you can pass in your API schema and 
validators to generate tests and check for edge-cases. 

Some general tips:

1. Test your regex patterns with edge cases
2. Test your query parameters
3. Test your path parameters
4. Test SQL injection attacks
5. Bombard your API endpoints with requests
6. Write load testing scripts

Today, we also have tools like [Snyk](https://snyk.io/) and [CodeQL](https://codeql.github.com/) 
which are using AI to scout out security vulnerabilities. Not all developers are 
equipped with the knowledge of scouting and auditing their code for 
vulnerabilities. Not every company can hire a dedicated cyber-ops team. These 
tools come in handy by allowing teams to have some level of security analysis 
going on, on their codebases.

## Closing Thoughts

Let's sit down for a moment and acknowledge that skill atrophy is real. If you 
are using AI to write all of your code and your tests and your docs, then you 
are going to get worse at it because you are not exercising the mental muscles.
And if you cannot debug without AI then you are screwed if it decides to 
hallucinate. Mind you, that with the advent of newer models every other week, 
all the AI companies are subjected to extreme server pressure and face downtimes
too.

Here's a website that can help check downtimes - [aidownstatus.com](https://aidownstatus.com/)

Additionally, security is another big concern. AI will introduce vulnerabilities.
It can suggest patterns that seem clever but are actually dangerous. It can 
also point out certain patterns as dangerous and suggest a refactor but you and 
your team perfectly understand the context behind writing something a certain 
way despite it's unconventional-ness.

## Enough Talk! Off to The Keyboard.

The dev world has changed, whether we appreciate it or not. It is not about AI 
taking away the jobs of programmers. It is about recruiters prioritize developers
who use AI efficiently over those who don't.

- Install `Cursor` or `VSCode` and hook up your AI models

- Play around with `Claude Desktop` or `mcphub.nvim`

- Plan your projects with AI, ask it to teach you newer concepts without giving
you the entire code for it

- Use it as a mentor that crafts you simple and timebound roadmaps. Use it as an 
intern that can pick-up low-priority tasks or tasks that do not bring much 
learnings to you.

- Avoid outsourcing your entire thinking. Ask AI for sources, go to the originals
and learn properly.

You are not behind. You can start today. Get upto speed. And learn as much as 
you can.

---

**Ritesh Koushik**
