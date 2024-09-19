import * as core from '@actions/core'
import { run } from './run.js'
import { postRun } from './post.js'

const main = async (): Promise<void> => {
  const containerId = core.getState('container-id')
  if (containerId) {
    return await postRun({
      containerId,
      preStopSeconds: parseInt(core.getInput('prestop-seconds')) || 0,
    })
  }

  const outputs = await run({
    image: core.getInput('image', { required: true }),
    config: core.getInput('config'),
    configPath: core.getInput('config-path'),
    environments: core.getMultilineInput('environments'),
    ports: core.getMultilineInput('ports'),
    readinessProbePort: core.getInput('readiness-probe-port'),
    dockerRunFlags: core.getMultilineInput('docker-run-flags'),
  })
  core.saveState('container-id', outputs.containerId)
  core.setOutput('container-id', outputs.containerId)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
