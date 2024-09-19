# opentelemetry-collector-action [![ts](https://github.com/int128/opentelemetry-collector-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/opentelemetry-collector-action/actions/workflows/ts.yaml)

This action starts the OpenTelemetry Collector.
it is a wrapper of `docker run otel/opentelemetry-collector-contrib`.

## Getting Started

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/opentelemetry-collector-action@v0
        with:
          config-yaml: |
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
            service:
              pipelines:
                traces:
                  receivers: [otlp]
                  processors: [batch]
                  exporters: [debug]
```

### Inputs

| Name           | Default                    | Description                                     |
| -------------- | -------------------------- | ----------------------------------------------- |
| `image`        | [action.yaml](action.yaml) | Container image URI                             |
| `config-yaml`  | -                          | Inlined configuration                           |
| `environments` | -                          | Environment variables provided to the container |
| `ports`        | [action.yaml](action.yaml) | Ports to expose                                 |

### Outputs

None.
