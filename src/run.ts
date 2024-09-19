import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'

type Inputs = {
  configYAML: string
  image: string
  ports: string[]
  environments: string[]
}

type Outputs = {
  cid: string
}

export const run = async (inputs: Inputs): Promise<Outputs> => {
  const tempDir = await fs.mkdtemp(process.env.RUNNER_TEMP || os.tmpdir())
  const cidfile = path.join(tempDir, 'cidfile')

  core.info('Starting OpenTelemetry Collector')
  const otelcolArgs = []
  const dockerRunArgs = ['-q', '-d', '--cidfile', cidfile]
  for (const port of inputs.ports) {
    dockerRunArgs.push('-p', port)
  }
  for (const environment of inputs.environments) {
    dockerRunArgs.push('-e', environment)
  }
  if (inputs.configYAML) {
    // https://opentelemetry.io/docs/collector/configuration/
    dockerRunArgs.push('-e', 'OTELCOL_CONFIG_YAML')
    otelcolArgs.push('--config', 'env:OTELCOL_CONFIG_YAML')
  }
  await exec.exec('docker', ['run', ...dockerRunArgs, inputs.image, ...otelcolArgs], {
    env: {
      ...process.env,
      OTELCOL_CONFIG_YAML: inputs.configYAML,
    },
  })

  const cid = (await fs.readFile(cidfile)).toString().trim()
  core.info(`OpenTelemetry Collector started in container ${cid}`)
  return { cid }
}
