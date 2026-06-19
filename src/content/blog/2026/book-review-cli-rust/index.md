---
title: "My Journey through The Command-Line Rust Book"
description: "Working on terminal tools as a Rust beginner"
date: "June 20, 2026"
image: "https://w2tkg6h17v.ufs.sh/f/328EZ2MyU1ulyAzO2fBhluaiFSobRVPp8zCvQXnMdxqK9046"
draft: true
---

# Why I Picked Up Rust ... Again ...

I feel that over the last few years, Rust has seeped into conversations 
surrounding databases, package managers, performance sensitive infrastructures, 
cloud-native service meshes and all things low-latency.

Rust has been sitting on my radar for a good 3+ years and as someone who 
spends most of my time working in backend, distributed systems and systems 
programming in Go, I kept encountering Rust in all kinds of places.

Honestly, I have given this some thought in the past and tried to learn Rust 
from [the rust book](https://doc.rust-lang.org/book/). Additionally, I have 
dabbled a little into [Solana development](https://solana.com/), which is again 
dominated by Rust. It is safe to say that most of my previous expeditions have 
had little success and I have had to re-learn the language from the basics 
quite a few times.

This time around, rather than starting with language theory, syntax tutorials, I 
wanted to learn Rust by building things that are highly familiar to me. Not 
REST APIs, but CLI tools. Having written CLIs in Go using the [cobra-cli](https://github.com/spf13/cobra)
framework, I want to make my inroads into Rust from the terminal instead of 
playing with different abstractions and spiralling into asynchronous 
programming using [tokio](https://tokio.rs/).

Lastly, I felt the slope is gradual enough for me to not quit mid-way and 
stay interested enough that I would FAFO my way through it and 
learn to read the documentation, look for the right things and finally start 
thinking like a Rust developer.


# Who Should Read This Book ?

I think one of the tenets of the book is that it does not wait around to teach 
all the language semantics and syntax around Rust but directly jumps into building 
programs. It introduces concepts like ownership, borrowing, and lifetimes 
gradually over the course of its 14 chapters by building the basic command line 
utilities like `ls`, `grep`, `cat`, `wc`, etc.

Keeping this in mind, I honestly feel that this book is best suited for:

- If you are already comfortable with a language like Go, Java or C++ and have 
an understanding of programming fundamentals so that you can correlate with 
solving similar problems in the "Rust-way".

- If you have experience in dealing with processing files, input and output 
streams, parsing data, writing tests or having written a CLI tool or two before.
If your work involves daily-driving Linux and writing bash scripts, then this 
one is right up your alley.

- If you are someone who loves learning in a project-first way and are 
comfortable with taking a top-down approach instead of trying to learn every 
single detail and seeking answers to every-line of code.

That being said, I think this book might not be best suited for folks who are:

- Complete beginners to programming languages. Rust is not the programming 
language for you because of how different it's mental model is with all the 
other languages out there.

- Developers looking for advanced Rust expertise, especially in asynchronous Rust.
This book is only an intermediate material and does not go into those aspects at 
all. You are probably better off reading

    - [Zero to Production in Rust by Luca Palmieri](https://www.zero2prod.com/index.html?country=India&discount_code=SEA60)
    - [Rust for Rustaceans by Jon Gjengset](https://rust-for-rustaceans.com/)

# A Review Of the Ecosystem

# My Key Learnings

# My Road From Here

My next read is going to be [Zero to Production in Rust](https://www.zero2prod.com/index.html?country=India&discount_code=SEA60). At my current company, there are talks going 
on about writing certain hotpath services into Rust for extracting better 
performance on same hardware while lowering infrastructure costs. 

This book claims to focus on the challenges of writing cloud-native applications 
at an enterprise level in a team of 4-5 Rust engineers with varied levels of 
expertise and proficiency which is well aligned with my forthcoming needs. 

While I engage in this, I would also be going through [Rust for Rustaceans](https://rust-for-rustaceans.com/)
parallely. Having skimmed through some of the contents of this book, it is my 
understanding that this book deals with [Asynchronous Rust](https://rust-lang.github.io/async-book/), 
[Unsafe Rust](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html) and 
[FFI in Rust](https://doc.rust-lang.org/rust-by-example/std_misc/ffi.html). These 
bits are important as we are primarily a Golang shop and we might have to call Rust 
code from Golang services without a complete rewrite!

Thanks for reading till the end.   
---
Here's all the code while going through this book - [github.com/IAmRiteshKoushik/cli-rs](https://github.com/IAmRiteshKoushik/cli-rs)

