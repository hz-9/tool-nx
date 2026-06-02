#!/usr/bin/env node
import * as fs from 'fs-extra'
import * as path from 'upath'
import console from 'node:console'

import { Commander, DocsBuild } from '../index'
import type { DocsBuildOptions } from '../index'

/**
 * 验证配置文件必需的字段
 */
function validateConfig(config: unknown): config is DocsBuildOptions {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be a JSON object.')
  }

  const c = config as Record<string, unknown>

  if (!c.baseSourceDir) {
    throw new Error('Missing required field: "baseSourceDir" (e.g., "docs").')
  }

  if (!c.site || typeof c.site !== 'object') {
    throw new Error('Missing required field: "site".')
  }

  const site = c.site as Record<string, unknown>

  if (!site.base) {
    throw new Error('Missing required field: "site.base" (e.g., "/" or "/docs/").')
  }

  if (!c.navigation || typeof c.navigation !== 'object') {
    throw new Error('Missing required field: "navigation".')
  }

  const nav = c.navigation as Record<string, unknown>

  if (!Array.isArray(nav.navbar)) {
    throw new Error('Missing required field: "navigation.navbar" (must be an array).')
  }

  if (!nav.sidebar || typeof nav.sidebar !== 'object') {
    throw new Error('Missing required field: "navigation.sidebar" (must be an object).')
  }

  return true
}

;(async () => {
  const opts = Commander.parse()

  const configPath = path.resolve(process.cwd(), (opts.config as string) || './docs-build.config.json')

  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found: ${configPath}`)
    console.error('Create a docs-build.config.json file or specify with -c option.')
    process.exit(1)
  }

  console.log(`\n@hz-9/docs-build`)
  console.log(`Config: ${configPath}`)

  const rawConfig = fs.readJsonSync(configPath) as DocsBuildOptions

  // Validate required fields
  validateConfig(rawConfig)

  // Merge CLI --output into config if provided
  if (opts.output) {
    rawConfig.output = opts.output as string
  }

  const result = await DocsBuild.resolve(rawConfig)

  console.log(`\nDone. VuePress config generated at: ${result.configPath}`)
})().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
