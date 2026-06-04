#!/usr/bin/env node
import * as path from 'upath'
import console from 'node:console'

import { Commander, CommanderOptions, DocsBuild, DocsOptions } from '../index'

;(async () => {
  const opts: CommanderOptions = Commander.parse()

  const configPath = path.resolve(process.cwd(), opts.config)

  console.log(`\n@hz-9/docs-build`)
  console.log(`Config: ${configPath}`)

  const rawConfig = DocsOptions.load(configPath)

  // Merge CLI --output into config if provided
  if (opts.output) {
    rawConfig.output = opts.output
  }

  const result = await DocsBuild.resolve(rawConfig)

  console.log(`\nDone. VuePress config generated at: ${result.configPath}`)
})().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
