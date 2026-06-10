---
title: "The Missing Beginner's Guide to GCP Pub/Sub with Golang"
description: "Hands-on introduction to GCP Pub/Sub completely on localhost"
date: "June 11, 2026"
image: "https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ul2PMxo6WEwT6kfus1Vyd3Y98nxOXiQS0tKGMJ"
---

# Introduction

When I decided to learn [GCP Pub/Sub](https://cloud.google.com/pubsub?hl=en) with Go for my job, 
I was surprised at how difficult it was to find a practical guide that covered 
more than just publishing and consuming a message. Most resources either stop 
at basic examples or assume that you have used [Kafka](https://kafka.apache.org/) with familiarity of Pub/Sub concepts. 

This blog is the guide I wish I had found.

In here, we'll be building an `Event-Driven Order Processing System` entirely on 
our local machine using the Pub/Sub Emulator and Go. Along the way, we'll 
explore concepts like topics, subscriptions, acknowledgements, retries, fan-out, 
filtering and dead letter queues.

# Why We're Building This Entirely on Localhost ?

Whenever I am experimenting with new infrastructure, I attempt to remove as 
many moving parts as possible. The last thing I want is to spend half of my 
time creating cloud projects, configuring IAM permissions and figuring out 
why some API isn't enabled.

Thankfully, GCP provides [many emulators](https://medium.com/@mrpadigala/cloud-emulators-in-gcp-azure-and-aws-a-developers-guide-c8a108f7cc43) 
that behaves like the real service while running entirely on your machine. 
This allows us to focus on Pub/Sub without worrying about cloud bills! Hence, 
we stay on `localhost`, move quickly and break things freely while focusing on 
learning the parts that actually matter.

# Bootstrapping Our Pub/Sub Playground

Before we begin, you need to install the [Google Cloud CLI](https://docs.cloud.google.com/sdk/docs/install-sdk).
I am on a Linux machine, so I'll list down the commands that I follow. You 
can follow the commands of your corresponding Operating System.

```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
```

Extract the contents of the tarball and run the installation script

```bash
# Extract
tar -xf google-cloud-cli-linux-x86_64.tar.gz
# Installation script
./google-cloud-sdk/install.sh
```

To see all available emulators, you can run

```bash
gcloud components list
```

And to download the emulator for Pub/Sub

```bash
gcloud components install pubsub-emulator
# Verify installation
gcloud components list | grep pubsub
```

Finally, to start the emulator on port `8085`

```bash
gcloud beta emulators pubsub start --project=local-dev --host-port=localhost:8085
```

Now that we have the emulator running. Let's quicky bootstrap our Go project.

```bash
mkdir go-gcp-pubsub
cd go-gcp-pubsub

# You can add your github username below
go mod init github.com/IAmRiteshKoushik/go-gcp-pubsub
```

One last step is to use a simple UI to see what's going on inside our pub/sub. 
We'll be doing this by using [pubsub-emulator-ui](https://github.com/NeoScript/pubsub-emulator-ui)
as a docker container talking to our emulator.

```yaml
# docker-compose.yml
services:
  emulator-ui:
    image: ghcr.io/neoscript/pubsub-emulator-ui
    ports:
      - "7200:80"
    environment:
      PUBSUB_EMULATOR_HOST: host.docker.internal:8085
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Set this up using `docker compose up -d` and then navigate to [http://localhost:7200](http://localhost:7200)

In the UI, setup the current host as `http://localhost:8085` and create a 
project `local-dev`. Once inside `local-dev` you'll a **Create New Topic** option.

If you have gotten this far, your setup is complete. 

> There is a possibility of the pubsub-ui not being able to talk to the emulator 
due to networking issues if you are on `Windows`. I'll let you figure that out 
in-case you encounter it.

# Sending Our First Event Into the System

# Listening for Orders

# Nobody Said "I Got It" ... ?

# One Worker Isn't Enough!

# One Order, Three Services

# Adding Context Without Touching the Payload

# Let Pub/Sub Do the Routing

# When Things Go Wrong: Retries and Dead Letter Queues

# The Complete Event-Driven Order Pipeline

# Where to Go From Here...
