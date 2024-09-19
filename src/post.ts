import * as core from '@actions/core'
import * as exec from '@actions/exec'

type Inputs = {
  cid: string
}

export const post = async (inputs: Inputs): Promise<void> => {
  core.info(`Stopping OpenTelemetry Collector of container ${inputs.cid}`)
  await exec.exec('docker', ['stop', inputs.cid])
  await exec.exec('docker', ['logs', inputs.cid])
  await exec.exec('docker', ['rm', inputs.cid])
  core.info('Stopped OpenTelemetry Collector')
}
