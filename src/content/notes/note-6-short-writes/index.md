---
title: "Note #6: When Write Doesn't Mean Written"
description: "File-writing gets scarier"
date: "Sept 14, 2026"
draft: false
---

Last night I started using Matt Pocock's `/teach` skill to work on my Bitcask 
implementation. While going about the tailor-made course structure, I came 
across something interesting about "file writes". Turns out they are not always 
`atomic`.

Most of the time when you see Go code writing to a file, it looks something like

```go
// n is the number of bytes written
n, err := f.Write(data)
if err != nil {
  return err
}
```

Our understanding is that either all the bytes are written or `Write` returns 
an error, but the underlying IO model is a bit more complicated than that.

# What is io.ErrShortWrite ?

All kinds of writers, be it files, network sockets, bufio, implement the `Writer`
interface. It looks something like this 

```go
type Writer interface {
  Write(data []byte)(n int, err error)
}
```

The important part here is `n < len(data)`, this means that that the writer
did not consume the entire write buffer and if it happens, then writer is
expected to return a non-nil error explaining why. The idiomatic Go way of
representing this condition is `io.ErrShortWrite` which means that the write
was incomplete and there is no better error available to send upstream.

# So, writes can be partial, but why ?

At the OS-level, [write(2)](https://man7.org/linux/man-pages/man2/write.2.html)
does not guarantee that every requested byte will be always accepted. Let's say 
that you wish to write `8KB` of data, but the kernel may return back `n = 4096 bytes`
instead of `n = 8192 bytes` as only half of the request was accepted and this is not 
a rare occurence.

1. The most obvious case is that the filesystem is running out of storage space. 
The filesystem made partial progress before it reaches `ENOSPC` (Error no space).

2. Partial writes are also normal when dealing with sockets, pipes, devices and 
non-blocking file descriptors. If a pipe currently has only 2KB of free buffer 
space and you try to write more than that, the kernel will only accept part of 
it and leave you to deal with the rest of the remaining bytes.

3. With pipes, this gets wilder due to `PIPE_BUF` which is typically `4096 bytes`
on linux. All writes smaller than or equal to this number are guaranteed to be 
atomic when multiple writers use the same pipe. For example:

```
Writer A: Ritesh...
Writer B: Koushik...

Reader[s] can see:

Ritesh...Koushik...
(or)
Koushik...Ritesh...
```

The contents of each individual write are not interleaved but once the write 
becomes larger than `PIPE_BUF` then atomicity disappears! Two concurrent 8KB 
writers could potentially be observed as

```
Ri..
Ko..
esh...
ushik...
```

Large writes to non-blocking pipes can also return early after accepting only 
part of the buffer and make partial writes a normal occurence rather than 
an exception.

# How does Go handle it ?

In Go, the `*os.File` provides a strong abstraction and its `Writer` implementation 
sends back `io.ErrShortWrite` so that the application code need not have to 
check manually. This is generally sufficient but if you are using any arbitrary 
or implementing your `io.Writer` then it is worth checking the contract.

# Why this gets interesting for the database folks ?

The thing is, a short write is not a corrupted write (not completely). This 
becomes important for folks who are building storage engines or databases. For 
example, if a database wants to write a 16KB page, a short-write happens where the 
application requests 16KB but kernel accepts on 4KB and the application is aware 
of it. But a torn write is different where the application received confirmation of the 
16KB write with no error propagation upstream but a crash during the actual 
storage device persisting leads to loss of data.

Databases deal with this using techniques such as:

1. Write-ahead logs
2. Checksums
3. Recovery scanning
4. Atomic-write guarantees from storage hardware

Any storage engine worth its salt does not assume that every file contains 
only complete records. During a startup a scan is initiated which can go like:

```yaml

record-1: valid
record-2: valid
record-3: valid
record-4: incomplete (someone died in here, lol)
```

This incomplete tail can then be either discarded or truncated. 

A simple record-level `checksum` can help in detecting whether the record has the 
expected length but contains corrupted/partially persisted data or not.
