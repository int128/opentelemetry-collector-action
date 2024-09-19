import * as core from '@actions/core'
import { run } from './run.js'
import { post } from './post.js'

const main = async (): Promise<void> => {
  const cid = core.getState('opentelemetry-collector-cid')
  if (cid) {
    return await post({
      cid,
    })
  }

  const outputs = await run({
    image: core.getInput('image', { required: true }),
    configYAML: core.getInput('config-yaml'),
    environments: core.getMultilineInput('environments'),
    ports: core.getMultilineInput('ports'),
  })
  core.saveState('opentelemetry-collector-cid', outputs.cid)
  core.setOutput('container-id', outputs.cid)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
