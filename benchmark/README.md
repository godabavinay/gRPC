# Benchmarking HTTP vs gRPC

This directory contains commands to benchmark HTTP and gRPC endpoints for user retrieval.

## HTTP Benchmark

Uses [autocannon](https://github.com/mcollina/autocannon) to test the REST API endpoint.

```bash
npx autocannon -c 1000 -a 100000 http://localhost:3000/user?id=1
```

- `-c 1000`: 1000 concurrent connections
- `-a 100000`: 100,000 total requests

## gRPC Benchmark

Uses [ghz](https://ghz.sh/) to test the gRPC service.

```bash
ghz --insecure \
    --proto ./user.proto \
    --call user.UserService.GetUser \
    -c 1000 \
    -n 100000 \
    localhost:50051
```

- `--insecure`: disables transport security
- `--proto ./user.proto`: path to your proto file
- `--call user.UserService.GetUser`: fully qualified method name
- `-c 1000`: 1000 concurrent connections
- `-n 100000`: 100,000 total requests

## Prerequisites

- Node.js and [autocannon](https://github.com/mcollina/autocannon)
- [ghz](https://ghz.sh/) installed (`go install github.com/bojand/ghz@latest`)
- Running HTTP server on `localhost:3000`
- Running gRPC server on `localhost:50051`
- `user.proto` file in the benchmark directory

## References

- [autocannon documentation](https://github.com/mcollina/autocannon)
- [ghz documentation](https://ghz.sh/docs/)
