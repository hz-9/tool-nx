import * as fs from 'fs-extra'

import type { DocsBuildOptions } from '../interface/index'

/**
 * @public
 *
 * 配置文件加载与校验
 */
export class DocsOptions {
  /**
   * 从文件加载并校验配置
   *
   * @param configPath - 配置文件绝对路径
   * @returns 校验通过的配置对象
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
   * 验证配置文件必需的字段
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
