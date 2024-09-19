# opentelemetry-collector-action [![ts](https://github.com/int128/opentelemetry-collector-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/opentelemetry-collector-action/actions/workflows/ts.yaml)

This action starts the OpenTelemetry Collector.
It is a wrapper of `docker run otel/opentelemetry-collector-contrib`.

## Getting Started

To run the OpenTelemetry Collector,

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/opentelemetry-collector-action@v0
        with:
          readiness-probe-port: 13133
          config: |
            receivers:
              otlp:
                protocols:
                  http:
                    endpoint: 0.0.0.0:4318
            processors:
              batch:
            exporters:
              debug:
                verbosity: detailed
            extensions:
              health_check:
                endpoint: 0.0.0.0:13133
            service:
              extensions: [health_check]
              pipelines:
                traces:
                  receivers: [otlp]
                  processors: [batch]
                  exporters: [debug]
```

### Inputs

| Name                   | Default                    | Description                                     |
| ---------------------- | -------------------------- | ----------------------------------------------- |
| `image`                | [action.yaml](action.yaml) | Container image URI                             |
| `config`               | -                          | Inline config                                   |
| `config-path`          | -                          | Path to the configuration file                  |
| `environments`         | -                          | Environment variables provided to the container |
| `ports`                | [action.yaml](action.yaml) | Ports to expose                                 |
| `readiness-probe-port` | -                          | If set, waiting for the port to be ready        |
| `prestop-seconds`      | 5                          | Seconds to wait before stopping the container   |
| `docker-run-flags`     | -                          | Additional flags for `docker run` command       |

### Outputs

| Name           | Description  |
| -------------- | ------------ |
| `container-id` | Container ID |
