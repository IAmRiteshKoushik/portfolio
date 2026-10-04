---
title: "Note #6: Rust Crates for Everyday Use"
description: "Crates you reach for any decent sized project"
date: "Oct 4, 2026"
draft: false
---

A good starting point when searching for Rust crates is [blessed.rs](https://blessed.rs/crates)
It serves as an unofficial guide to the Rust ecosystem. Here is another set of 
crates that can help out anyone writing any decent sized Rust project.

I put this list together while going through Rust infrastructure projects and I 
am keeping it mainly as a personal reference when I have to go `crate hunting`.

# Application and Configuration Dependencies

| Dependency | What it does / where it is used |
| --- | --- |
| `cfg-if` | Conditional compilation helpers, used where platform or feature-specific code needs a single source-level branch. |
| `clap` | Parses the CLI arguments, subcommands, environment-backed options, and help text. |
| `clap_complete` | Generates shell completion scripts. |
| `indoc` | Keeps multiline help text, templates, and test data readable without unwanted indentation. |
| `exitcode` | Standardized process exit-code constants for CLI failures. |
| `colored` | Terminal color output for CLI diagnostics and user-facing output. |
| `semver` | Parses and compares component, protocol, or API versions. |
| `uuid` | Generates and serializes IDs, with v4 and v7 support enabled. |
| `dirs-next` | Optional OS-specific configuration/cache/home-directory discovery, used by Docker-related behavior. |
| `notify` | Watches files, primarily to reload configuration and related local state. |
| `glob` | Expands file patterns, used in configuration and file-oriented behavior. |
| `hostname` | Obtains the local host name for event metadata and host-oriented configuration. |
| `bytesize` | Parses and formats human-friendly byte quantities such as buffer limits. |
| `humantime` | Workspace-shared duration parsing/formatting support. |
| `chrono` | Timestamps and date/time conversions. |
| `chrono-tz` | IANA time-zone support for config parsing and time operations. |
| `url` | Parses and validates endpoint URLs in component configuration. |
| `percent-encoding` | URL/query escaping and decoding. |
| `encoding_rs` | Character-set conversion for codecs and configuration. |
| `toml` | TOML configuration parsing. |
| `serde_yaml` | YAML configuration parsing. |
| `serde_json` | JSON configuration, event payloads, schemas, HTTP payloads, and arbitrary JSON values. `preserve_order` is enabled, so map ordering survives where relevant. |
| `serde` | The base serialization framework used throughout component configs and events. |
| `serde_with` | More expressive `serde` adapters for common config representations. |
| `serde_path_to_error` | Reports the exact nested config path when deserialization fails. |
| `http-serde` | `serde` support for HTTP types. |
| `typetag` | Serializes/deserializes trait-object-like configuration types. |
| `dyn-clone` | Makes boxed trait objects clonable. |
| `derivative` | Generates customized `Debug`, `Clone`, and similar implementations. |
| `derive_more` | Generates small conversion and display implementations. |
| `strum` | Derives enum iteration, parsing, display, and related helpers. |
| `inventory` | Link-time registration of component definitions. This is one of the mechanisms that lets Vector discover component implementations without a central manually maintained list. |
| `enum_dispatch` | Generates dispatch from enums to trait implementations without dynamic dispatch in selected paths. |
| `arr_macro` | Builds fixed-size arrays in places where ordinary array initialization is awkward. |
| `const-str` | Workspace-shared compile-time string manipulation. |
| `convert_case` | Workspace-shared string case conversion, mainly useful to procedural macros and generated docs/schema naming. |
| `pastey` | Workspace-shared identifier concatenation for macro-generated code. |

# Async runtime, streams, and flow-control

| Dependency | What it does / where it is used |
| --- | --- |
| `tokio` | The async runtime. Enable `full` for production code and uses tasks, channels, timers, networking, signals, process support, and synchronization. |
| `futures` | Core async traits and combinators. |
| `futures-util` | Stream, future, sink, and async utility extensions. |
| `async-stream` | Builds async `Stream`s with generator-like syntax. |
| `async-trait` | Lets traits expose async methods before native async trait ergonomics cover all needed patterns. |
| `tokio-stream` | Turns Tokio channels, listeners, timers, and watches into streams. |
| `tokio-util` | Tokio codecs, I/O helpers, network helpers, cancellation/time support, and `DelayQueue` style utilities. |
| `stream-cancel` | Makes streams cancellable when topology shutdown begins. |
| `pin-project` | Safe pin-projection for custom streams, futures, and sinks. |
| `tower` | Composable service middleware. Uses buffering, limits, retries, timeouts, balancing, discovery, and utility middleware. Its batch/driver machinery uses `tower::Service` |
| `tower-http` | HTTP-specific Tower middleware for tracing plus request/response compression and decompression. |
| `tracing-tower` | Connects Tower requests to tracing spans. |
| `console-subscriber` | Optional Tokio-console instrumentation, enabled by the `tokio-console` feature. |
| `crossbeam-utils` | Workspace-shared concurrency utilities used by member crates. |
| `dashmap` | Workspace-shared concurrent map implementation for member crates. |
| `arc-swap` | Atomic replacement of shared immutable state. Used by the optional EC2 metadata transform, where readers need cheap consistent snapshots. |
| `evmap`, `evmap-derive` | Optional eventually-consistent read-optimized maps for in-memory enrichment tables. |
| `thread_local` | Optional thread-local state used by the in-memory enrichment implementation. |
| `lru` | Bounded least-recently-used cache. |
| `governor` | Optional rate limiting, used by `throttle` and Windows Event Log ingestion. |
| `cuckoo-clock` | Optional expiration/clock structure for memory enrichment tables. |
| `bloomy` | Optional Bloom-filter-style membership support for enrichment and tag-cardinality control. |
| `hashbrown` | Optional high-performance hash map, used by tag-cardinality limiting. |
| `hash_hasher`, `seahash` | Fast hashing in performance-sensitive internal data structures. |
| `smallvec` | Stores a few elements inline to avoid allocations on common small collections. |
| `indexmap` | Insertion-ordered maps, especially useful for preserving user configuration and JSON object order. |
| `ordered-float` | Makes floating-point values usable in ordered keys and comparisons. |
| `itertools` | Iterator combinators beyond the standard library. |
| `rand`, `rand_distr` | Sampling, random IDs/choices, randomized behavior, and distributions. |
| `regex` | Pattern matching for transforms, filters, parsers, and configuration validation. |
| `nom` | Parser combinators, notably enabled for Nginx metrics and ClickHouse-specific parsing. |
| `csv` | CSV decoding/encoding support. |
| `quick-junit` | Emits JUnit test result data. |
| `tempfile` | Creates temporary files and directories for runtime features and tests. |
| `libc`, `nix` | Unix syscalls, sockets, signals, file descriptors, and resource limits. |
| `socket2` | Lower-level socket setup where `std::net` is insufficient. |
| `heim` | Host system metrics, used by the `host_metrics` source. |
| `sysinfo` | System inspection support. |
| `procfs` | Linux `/proc` parsing. |
| `tikv-jemallocator` | Optional Unix allocator selected by default on supported builds. It reduces allocator contention in allocation-heavy workloads. |

# HTTP, TLS and RPC

| Dependency | What it does / where it is used |
| --- | --- |
| `http` | HTTP 0.2 request, response, headers, methods, and status types. |
| `http-1` | Renamed `http` 1.x, kept alongside 0.2. |
| `http-body` | HTTP 0.4 body abstraction. |
| `http-body-1` | Renamed HTTP body 1.x abstraction. |
| `http-body-util` | Utilities for collecting and transforming HTTP 1.x bodies. |
| `hyper` | HTTP 0.14 client/server implementation. |
| `hyper-1` | Renamed Hyper 1.x client. |
| `hyper-util` | Hyper 1.x Tokio/client adapters, including legacy client compatibility. |
| `axum` | HTTP routing and server-layer support |
| `warp` | Existing HTTP server/filter implementation used by parts of the application. |
| `headers`, `headers-1` | Typed HTTP header support for the two HTTP API versions. |
| `h2` | Optional HTTP/2 protocol support, used by GCP Pub/Sub ingestion. |
| `reqwest` | HTTP client |
| `reqwest_13` | A renamed Reqwest 0.13 client, used where a newer HTTP stack is required alongside the 0.11 dependency. |
| `hyper-proxy` | Proxy-aware HTTP client support. |
| `openssl` | Vendored OpenSSL TLS and crypto implementation. |
| `openssl-probe` | Finds system CA certificate locations where needed. |
| `tokio-openssl` | Async Tokio integration for OpenSSL streams. |
| `hyper-openssl`, `hyper-openssl-1` | TLS connectors for the Hyper 0.14 and Hyper 1.x clients. |
| `flate2` | gzip/deflate compression using `zlib-rs`. |
| `zstd` | Zstandard compression. Also used for compression dictionary generation in tests. |
| `snap` | Snappy compression support. |
| `async-compression` | Optional asynchronous gzip and zstd streams, used by S3 input and file output. |
| `base64` | Optional binary-to-text encoding used by protocols and cloud integrations. |
| `hex` | Optional hexadecimal encoding, used by OpenTelemetry ingestion. |
| `md-5` | Optional MD5 hashing for S3 object/checksum behavior. |
| `prost` | Optional protobuf runtime used by Vector API, Vector protocol, Datadog, OpenTelemetry, Prometheus, GCP Pub/Sub, and dnstap. |
| `prost-types` | Standard protobuf well-known message types. |
| `prost-reflect` | Optional runtime protobuf reflection, used by Datadog metrics. |
| `prost-build` | Optional build-time Rust code generation from `.proto` files. |
| `tonic` | Optional gRPC client/server implementation for Vector API, Vector source/sink, GCP Pub/Sub, and other protobuf endpoints. |
| `tonic-build` | Optional build-time gRPC/protobuf code generation. |
| `tonic-health` | gRPC health service implementation. |
| `tonic-reflection` | gRPC reflection server support. |
| `protobuf` | Alternative protobuf runtime, used by Datadog metrics support. |
| `openssl-src` | Build dependency that compiles/configures the OpenSSL source used by the vendored TLS setup. |

# Event model, codecs, and VRL

| Dependency | What it does / where it is used |
| --- | --- |
| `mlua` | Optional vendored Lua 5.4 runtime used by the `lua` transform. |
| `rmp-serde` | Optional MessagePack serialization/deserialization through Serde. Used by Fluent and Datadog trace paths. |
| `rmpv` | Optional dynamic MessagePack values, also used by Fluent and Datadog trace handling. |
| `serde_bytes` | Optional efficient serialization of binary fields without expanding them into integer arrays. |
| `arrow` | Optional Apache Arrow columnar-memory format support for Arrow and Parquet codecs, ClickHouse, and Databricks Zerobus. |
| `parquet` | Optional Apache Parquet writer/reader support. |
| `datadog-agent-metrics-v3` | Optional Datadog metrics-v3 columnar codec. |
| `databricks-zerobus-ingest-sdk` | Optional Arrow Flight ingest client for the Databricks Zerobus sink. |
| `roaring` | Optional compressed bitmap support for Splunk HEC source bookkeeping. |
| `strip-ansi-escapes` | Removes terminal ANSI escapes from text where Vector needs clean content. |
| `syslog` | Optional syslog protocol support for the Papertrail sink. |

# Brokers and Messaging Systems

| Dependency | What it enables |
| --- | --- |
| `lapin` | AMQP client for the AMQP source and sink. |
| `async-rs` | Async AMQP protocol/runtime support paired with `lapin`. |
| `deadpool` | Managed async connection pool for the AMQP sink. |
| `rdkafka` | Kafka client for Kafka sources and sinks. Enables static curl, TLS, compression, and Tokio support. |
| `async-nats` | NATS and JetStream client for NATS sources and sinks. |
| `nkeys` | NATS NKey authentication. |
| `pulsar` | Apache Pulsar source and sink client. |
| `redis` | Redis source and sink client, including connection manager and Sentinel support. |
| `rumqttc` | MQTT source and sink client using Rustls. |
| `mongodb` | MongoDB metrics source. |
| `postgres-openssl` | OpenSSL TLS connector for PostgreSQL telemetry collection. |
| `tokio-postgres` | PostgreSQL metrics source. |
| `sqlx` | PostgreSQL sink and the MySQL-enabled Doris sink path. |
| `databend-client` | Databend sink client. |
| `greptimedb-ingester` | GreptimeDB logs and metrics sinks. |
| `maxminddb` | GeoIP and MMDB enrichment tables. |
| `ipnet` | CIDR/IP-network handling for TCP source utilities. |

# Platform-specific Dependencies

| Platform | Dependencies | Role |
| --- | --- | --- |
| Unix | `libc`, `nix` | Signals, sockets, file descriptors, and resource handling. |
| Unix | `tikv-jemallocator` | Optional default allocator on supported Unix builds. |
| Unix | `dnsmsg-parser`, `dnstap-parser` | dnstap source implementation. |
| Linux | `procfs` | `/proc` metrics and system data. |
| Linux | `antithesis-instrumentation` | Optional Antithesis fault-testing instrumentation. |
| Windows | `windows-sys` | Basic Windows FFI for foundations and threading. |
| Windows | `windows-service` | Windows service integration. |
| Windows | `windows` | Optional higher-level Windows API bindings for the Windows Event Log source. |
| Windows | `quick-xml` | Parses Windows Event Log XML records. |
| Windows | `rdkafka` with `cmake_build` | Builds Kafka native dependencies on Windows. |

# Build-only Dependencies

| Dependency | What it does |
| --- | --- |
| `prost-build` | Generates Rust types from protobuf files when the enabled feature requires them. |
| `tonic-build` | Generates gRPC service/client code from protobuf definitions. |
| `openssl-src` | Supplies the vendored OpenSSL build used by the application’s TLS configuration. |

# Test and Benchmark Dependencies

| Dependency | What it does |
| --- | --- |
| `approx` | Floating-point assertions with tolerances. |
| `assert_cmd` | Runs a CLI as a child process and asserts stdout, stderr, and exit status. |
| `criterion` | Statistical benchmarks, including async Tokio benchmarks and HTML reports. |
| `mock_instant` | Controllable clock for deterministic timing tests. |
| `parking_lot` | Fast locks in test scenarios. |
| `proptest`, `proptest-derive` | Property-based test generation and derived arbitrary values. |
| `quickcheck` | Another property-based test framework. |
| `rstest` | Parameterized test macros. |
| `serial_test` | Serializes tests that mutate global/shared state. |
| `similar-asserts` | Better diff output when assertions fail. |
| `test-generator` | Generates repeated tests from declarative inputs. |
| `tokio-test` | Tokio-specific async testing helpers. |
| `tower-test` | Mocks and test helpers for Tower services. |
| `wiremock` | Mock HTTP server for integration-style client tests. |
| `zstd` with `zdict_builder` | Trains compression dictionaries used to generate test fixtures. |
