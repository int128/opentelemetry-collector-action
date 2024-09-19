import * as core from '@actions/core'
import * as exec from '@actions/exec'

export const post = async (): Promise<void> => {
  core.info('Stopping OpenTelemetry Collector')
  const containerName = 'opentelemetry-collector'
  await exec.exec('docker', ['stop', containerName])
  await exec.exec('docker', ['logs', containerName])
  await exec.exec('docker', ['rm', containerName])
  core.info('Stopped OpenTelemetry Collector')
}
