# ottest

A simple microservice stack hooked up to Jaeger via OpenTracing.

# Run

Requires: docker, docker-compose

```
$ git clone https://github.com/voutasaurus/ottest
$ cd ottest
$ ./run.sh
[... wait for docker compose to start up ...]
$ open http://localhost:16686
$ curl http://localhost:8080
```

# TODO

[ ] Each service logs its own span but they are not yet linked.
