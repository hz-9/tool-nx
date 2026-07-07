import * as fs from 'fs-extra'

import type { DocsBuildOptions } from '../interface/index'

/**
 * @public
 *
 * 配置文件加载与校验
 */
export class DocsOptions {
  /**
   * @public
   *
   * Load and validate configuration from a JSON file.
   *
   * 从文件加载并校验配置。
   *
   * @param configPath - The absolute path to the configuration file.
   *
   * @returns The validated configuration object.
   */
  public static load(configPath: string): DocsBuildOptions {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`)
    }

    const rawConfig = fs.readJsonSync(configPath) as DocsBuildOptions

    DocsOptions.validateConfig(rawConfig)

    return rawConfig
  }

  /**
   * @public
   *
   * Validate required fields in the configuration.
   * Throws descriptive errors if required fields are missing.
   *
   * 验证配置文件必需的字段。
   *
   * @param config - The configuration object to validate.
   */
  public static validateConfig(config: unknown): asserts config is DocsBuildOptions {
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
  }
}
