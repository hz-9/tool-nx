#!/usr/bin/env node
import * as path from 'upath'
import console from 'node:console'

import { Commander, CommanderOptions, DocsBuild, DocsOptions } from '../index'
import { ColorUtil, LogoUtil } from '../util/index'

;(async () => {
  // 1. 启动 Logo
  LogoUtil.print()

  // 2. 解析 CLI 参数
  const opts: CommanderOptions = Commander.parse()

  const configPath = path.resolve(process.cwd(), opts.config)

  // 3. 加载并验证配置（失败则抛错，由 catch 处理）
  console.log(`  ${ColorUtil.bold('Config:')}  ${ColorUtil.cyan(configPath)}`)

  const rawConfig = DocsOptions.load(configPath)

  // 合并 CLI --output 到配置
  if (opts.output) {
    rawConfig.output = opts.output
  }

  // 4. 显示当前基础信息
  const outputPath = path.resolve(rawConfig.output || './docs/.vuepress')
  console.log(`  ${ColorUtil.bold('Output:')} ${ColorUtil.cyan(outputPath)}`)

  const languages = rawConfig.locales?.languages ?? [rawConfig.site.lang]
  console.log(`  ${ColorUtil.bold('Langs:')}  ${ColorUtil.green(languages.join(', '))}`)
  console.log('')

  // 5. 执行文档构建（内含 ORA 扫描与复制）
  const result = await DocsBuild.resolve(rawConfig)

  // 6. 显示汇总统计
  if (result.stats) {
    const { stats } = result
    console.log(`  ${ColorUtil.bold('Files scanned:')}  ${ColorUtil.yellow(String(stats.totalScanned))}`)
    console.log(`  ${ColorUtil.bold('Files copied:')}   ${ColorUtil.green(String(stats.totalCopied))}`)
    console.log(`  ${ColorUtil.bold('Direct maps:')}    ${ColorUtil.blue(String(stats.totalDirectMapped))}`)
    console.log('')
  }

  // 7. 完成
  console.log(`Done. VuePress config generated at: ${ColorUtil.green(result.configPath)}`)
  console.log('')
})().catch((err) => {
  console.error(`\n${ColorUtil.red('Error:')} ${err.message}`)
  process.exit(1)
})
