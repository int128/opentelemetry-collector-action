import * as core from '@actions/core'
import * as exec from '@actions/exec'

type Inputs = {
  containerId: string
  preStopSeconds: number
}

export const postRun = async (inputs: Inputs): Promise<void> => {
  core.info(`Waiting ${inputs.preStopSeconds} seconds before stopping the container`)
  await sleep(inputs.preStopSeconds * 1000)

  core.info(`Stopping the container ${inputs.containerId}`)
  await exec.exec('docker', ['stop', inputs.containerId])
  await exec.exec('docker', ['logs', inputs.containerId])
  await exec.exec('docker', ['rm', inputs.containerId])
  core.info('Stopped OpenTelemetry Collector')
}

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
