import * as core from '@actions/core'
import * as exec from '@actions/exec'

type Inputs = {
  configYAML: string
  image: string
  ports: string[]
  environments: string[]
}

export const run = async (inputs: Inputs): Promise<void> => {
  core.info('Starting OpenTelemetry Collector')
  const otelcolArgs = []
  const dockerRunArgs = ['-q', '-d', '--name', 'opentelemetry-collector']
  for (const port of inputs.ports) {
    dockerRunArgs.push('-p', port)
  }
  for (const environment of inputs.environments) {
    dockerRunArgs.push('-e', environment)
  }
  if (inputs.configYAML) {
    // https://opentelemetry.io/docs/collector/configuration/
    dockerRunArgs.push('-e', `INLINE_OTELCOL_CONFIG=${inputs.configYAML}`)
    otelcolArgs.push('--config', 'env:INLINE_OTELCOL_CONFIG')
  }
  await exec.exec('docker', ['run', ...dockerRunArgs, inputs.image, ...otelcolArgs])
}
