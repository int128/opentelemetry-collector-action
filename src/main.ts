import * as core from '@actions/core'
import { run } from './run.js'
import { postRun } from './post.js'

const main = async (): Promise<void> => {
  const cid = core.getState('opentelemetry-collector-cid')
  if (cid) {
    return await postRun({
      cid,
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
  core.saveState('opentelemetry-collector-cid', outputs.cid)
  core.setOutput('container-id', outputs.cid)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
