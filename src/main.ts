import * as core from '@actions/core'
import { run } from './run.js'
import { post } from './post.js'

const main = async (): Promise<void> => {
  const started = core.getState('opentelemetry-collector-started')
  if (started) {
    return await post()
  }

  await run({
    image: core.getInput('image', { required: true }),
    configYAML: core.getInput('config-yaml'),
    environments: core.getMultilineInput('environments'),
    ports: core.getMultilineInput('ports'),
  })
  core.saveState('opentelemetry-collector-started', 'true')
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
