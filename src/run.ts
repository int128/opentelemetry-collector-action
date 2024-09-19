import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs/promises'
import { HttpClient } from '@actions/http-client'
import * as os from 'os'
import * as path from 'path'

type Inputs = {
  config: string
  configPath: string
  image: string
  ports: string[]
  environments: string[]
  readinessProbePort: string
  dockerRunFlags: string[]
}

type Outputs = {
  containerId: string
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
  if (inputs.configPath) {
    dockerRunArgs.push('-v', `${inputs.configPath}:/config.yaml:ro`)
    otelcolArgs.push('--config', '/config.yaml')
  }
  if (inputs.config) {
    // https://opentelemetry.io/docs/collector/configuration/
    dockerRunArgs.push('-e', 'INLINE_OTELCOL_CONFIG')
    otelcolArgs.push('--config', 'env:INLINE_OTELCOL_CONFIG')
  }
  dockerRunArgs.push(...inputs.dockerRunFlags)
  await exec.exec('docker', ['run', ...dockerRunArgs, inputs.image, ...otelcolArgs], {
    env: {
      ...process.env,
      INLINE_OTELCOL_CONFIG: inputs.config,
    },
  })
  const containerId = (await fs.readFile(cidfile)).toString().trim()

  if (inputs.readinessProbePort) {
    await core.group('Waiting for ready', () => waitForReady(inputs.readinessProbePort))
    await core.group('Startup logs', () => exec.exec('docker', ['logs', containerId]))
  }
  core.info(`OpenTelemetry Collector started in container ${containerId}`)
  return { containerId }
}

const waitForReady = async (port: string): Promise<void> => {
  const httpClient = new HttpClient()
  const httpGet = async () => {
    const endpoint = `http://localhost:${port}`
    try {
      return await httpClient.get(endpoint)
    } catch (e) {
      core.info(`OpenTelemetry Collector is not ready: GET ${endpoint}: ${String(e)}`)
      return
    }
  }

  for (let i = 0; i < 60; i++) {
    const response = await httpGet()
    if (response) {
      const body = await response.readBody()
      core.info(`OpenTelemetry Collector is ready: ${body}`)
      return
    }
    await sleep(1000)
  }
  throw new Error('OpenTelemetry Collector did not become ready')
}

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
