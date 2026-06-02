import * as fs from 'fs-extra'
import * as path from 'upath'
import GitUrlParse from 'git-url-parse'
import { glob as globSync } from 'glob'
import console from 'node:console'
import SimpleGit, { type ConfigValues } from 'simple-git'

import type { DocsBuildOptions, DocsBuildResult, IDocsItem, NavbarItem, SidebarItem } from '../interface/index'
import { readPkg } from '../util/index'

/**
 * @public
 *
 * Generate documentation build configuration
 */
export class DocsBuild {
  private readonly options: DocsBuildOptions

  private readonly docsFiles: Map<string, IDocsItem> = new Map()

  private readonly languages: string[] = []

  private readonly langFileSuffixes: RegExp[] = []

  private repo?: string

  public constructor(options: DocsBuildOptions) {
    this.options = options
    this.languages = options.locales?.languages ?? [options.site.lang]
    this.langFileSuffixes = this.languages.map((lang) => {
      const escapedLang = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\.${escapedLang}\\.md$`)
    })
  }

  /**
   * 执行文档构建
   */
  public static async resolve(options: DocsBuildOptions): Promise<DocsBuildResult> {
    const build = new DocsBuild(options)
    return build.resolve()
  }

  /**
   * 主入口
   */
  public async resolve(): Promise<DocsBuildResult> {
    const { options } = this
    const outputPath = path.resolve(options.output || './docs/.vuepress')

    // 1. 解析站点信息
    const pkg = readPkg()
    const title = options.site.title || (pkg.name as string) || ''
    const description = options.site.description || (pkg.description as string) || ''

    // 2. 获取 git 信息
    await this.tryGetGitInfo()

    // 3. 处理导航栏和侧边栏（多语言展开 + 路径映射）
    const navbarPerLang = this.expandNavbar(options.navigation.navbar)
    const sidebarPerLang = this.expandSidebar(options.navigation.sidebar)

    // 4. 为每种语言扫描并拷贝文档文件
    this.languages.forEach((lang) => {
      const langPrefix = lang === this.languages[0] ? '' : `/${lang}`

      this.processNavbarItems(options.navigation.navbar, lang, langPrefix, outputPath)

      // 收集根目录 README（站点首页）
      this.collectFile(`${options.baseSourceDir}/README.md`, lang, langPrefix, outputPath)

      Object.entries(options.navigation.sidebar).forEach(([, items]) => {
        this.processSidebarItems(items, lang, langPrefix, outputPath)
      })
    })

    // 5. 拷贝文件到输出目录
    this.copyFiles()

    // 6. 渲染 VuePress 模板
    await this.renderTemplates(outputPath, {
      title,
      description,
      baseUrl: options.site.base || '/',
      repo: this.repo,
      locales: this.buildLocales(),
      navbarPerLang,
      sidebarPerLang,
    })

    // 7. 合并用户自定义样式
    if (options.appearance?.styleDir) {
      await this.mergeStyles(outputPath, options.appearance.styleDir)
    }

    console.log(`\nOutput: ${outputPath}`)

    return {
      outputPath,
      configPath: path.resolve(outputPath, 'src/.vuepress/config.ts'),
    }
  }

  /**
   * 展开导航栏的多语言 text
   */
  private expandNavbar(navbar: NavbarItem[]): Record<string, unknown[]> {
    const result: Record<string, unknown[]> = {}

    this.languages.forEach((lang) => {
      const langKey = lang === this.languages[0] ? '/' : `/${lang}/`
      result[langKey] = navbar.map((item) => this.resolveNavItem(item, lang))
    })

    return result
  }

  /**
   * 递归解析导航项的多语言文本
   */
  private resolveNavItem(item: NavbarItem, lang: string): Record<string, unknown> {
    const text = typeof item.text === 'string' ? item.text : (item.text[lang] ?? item.text[this.languages[0]] ?? '')

    const resolved: Record<string, unknown> = {
      text,
    }

    // 當有 children 時，父項不設置 link，否則 vuepress-theme-hope 會用鏈接指向的頁面標題覆蓋 text
    if (item.children && item.children.length > 0) {
      resolved.children = item.children.map((child) => this.resolveNavItem(child, lang))
    } else {
      const link = this.mapSourcePath(item.link)
      resolved.link = lang === this.languages[0] ? link : `/${lang}${link}`
    }

    if (item.icon) resolved.icon = item.icon

    return resolved
  }

  /**
   * 展开侧边栏的多语言 text
   */
  private expandSidebar(sidebar: Record<string, SidebarItem[]>): Record<string, unknown[]> {
    const result: Record<string, unknown[]> = {}

    this.languages.forEach((lang) => {
      Object.entries(sidebar).forEach(([routeKey, items]) => {
        const langKey = lang === this.languages[0] ? routeKey : `/${lang}${routeKey}`
        result[langKey] = items.map((item) => this.resolveSidebarItem(item, lang))
      })
    })

    return result
  }

  /**
   * 递归解析侧边栏项的多语言文本
   */
  private resolveSidebarItem(item: SidebarItem, lang: string): Record<string, unknown> {
    const text = typeof item.text === 'string' ? item.text : (item.text[lang] ?? item.text[this.languages[0]] ?? '')
    const link = this.mapSourcePath(item.link)

    const resolved: Record<string, unknown> = {
      text,
      link: lang === this.languages[0] ? link : `/${lang}${link}`,
    }

    if (item.icon) resolved.icon = item.icon
    if (item.collapsible !== undefined) resolved.collapsible = item.collapsible
    if (item.expanded !== undefined) resolved.expanded = item.expanded

    if (item.children && item.children.length > 0) {
      resolved.children = item.children.map((child) => this.resolveSidebarItem(child, lang))
    }

    return resolved
  }

  /**
   * 将源路径映射为路由路径（去掉 baseSourceDir 前缀）
   * 如 'docs/guide/README.md' → '/guide/README.md'
   */
  private mapSourcePath(sourcePath: string): string {
    const { baseSourceDir } = this.options

    if (baseSourceDir) {
      const prefix = baseSourceDir.endsWith('/') ? baseSourceDir : `${baseSourceDir}/`

      if (sourcePath === baseSourceDir) return '/'

      if (sourcePath.startsWith(prefix)) {
        return sourcePath.slice(baseSourceDir.length)
      }
    }

    return `/${sourcePath}`
  }

  /**
   * 处理导航栏中的文件扫描
   */
  private processNavbarItems(items: NavbarItem[], lang: string, langPrefix: string, outputPath: string): void {
    items.forEach((item) => {
      this.collectFile(item.link, lang, langPrefix, outputPath)
      if (item.children) {
        this.processNavbarItems(item.children, lang, langPrefix, outputPath)
      }
    })
  }

  /**
   * 处理侧边栏中的文件扫描
   */
  private processSidebarItems(items: SidebarItem[], lang: string, langPrefix: string, outputPath: string): void {
    items.forEach((item) => {
      this.collectFile(item.link, lang, langPrefix, outputPath)
      if (item.children) {
        this.processSidebarItems(item.children, lang, langPrefix, outputPath)
      }
    })
  }

  /**
   * 收集单个文件的源路径和目标路径
   */
  private collectFile(link: string, lang: string, langPrefix: string, outputPath: string): void {
    const sourcePath = path.resolve(link)
    if (!fs.existsSync(sourcePath)) return

    const stat = fs.statSync(sourcePath)
    if (!stat.isFile() && !stat.isDirectory()) return

    const routePath = this.mapSourcePath(link)
    const isPrimaryLang = lang === this.languages[0]

    if (stat.isFile()) {
      const langFile = this.resolveLangFile(link, lang)
      const targetPath = isPrimaryLang ? `${outputPath}/src${routePath}` : `${outputPath}/src${langPrefix}${routePath}`

      this.docsFiles.set(targetPath, {
        baseFilepath: path.resolve(langFile),
        focusFilepath: targetPath,
      })
    } else if (stat.isDirectory()) {
      const files = this.scanDirFiles(link, lang)
      files.forEach((file) => {
        const sourceRelPath = path.relative(link, file)
        const targetPath = isPrimaryLang
          ? `${outputPath}/src${routePath}/${sourceRelPath}`
          : `${outputPath}/src${langPrefix}${routePath}/${sourceRelPath}`

        this.docsFiles.set(targetPath, {
          baseFilepath: file,
          focusFilepath: targetPath,
        })
      })
    }
  }

  /**
   * 解析多语言文件路径，不存在则回退到原文件
   */
  private resolveLangFile(filePath: string, lang: string): string {
    if (lang === this.languages[0]) return filePath

    const langFilePath = filePath.replace(/\.md$/, `.${lang}.md`)
    return fs.existsSync(langFilePath) ? langFilePath : filePath
  }

  /**
   * 扫描目录下的所有 markdown 文件，处理多语言后缀
   */
  private scanDirFiles(dirPath: string, lang: string): string[] {
    const allFiles = globSync.sync('**/*.md', { dot: true, nodir: true, cwd: dirPath })

    if (lang === this.languages[0]) {
      return allFiles
        .filter((f) => this.langFileSuffixes.every((suffix) => !suffix.test(f)))
        .map((f) => path.resolve(dirPath, f))
    }

    return allFiles
      .filter((f) => this.langFileSuffixes.every((suffix) => !suffix.test(f)))
      .map((f) => {
        const langFile = path.resolve(dirPath, f.replace(/\.md$/, `.${lang}.md`))
        return fs.existsSync(langFile) ? langFile : path.resolve(dirPath, f)
      })
  }

  /**
   * 拷贝所有已收集的文件到输出目录
   */
  private copyFiles(): void {
    this.docsFiles.forEach((item) => {
      if (!fs.existsSync(item.baseFilepath)) return

      const relFrom = path.relative(process.cwd(), item.baseFilepath)
      const relTo = path.relative(process.cwd(), item.focusFilepath)

      fs.removeSync(item.focusFilepath)
      try {
        const content = fs.readFileSync(item.baseFilepath, { encoding: 'utf8' })
        fs.mkdirpSync(path.dirname(item.focusFilepath))
        fs.writeFileSync(item.focusFilepath, content, { encoding: 'utf8' })
        console.log(`  Moved: ${relFrom} -> ${relTo}`)
      } catch (error) {
        console.error(error)
      }
    })
  }

  /**
   * 渲染 VuePress 模板文件
   */
  private async renderTemplates(vuepressPath: string, data: Record<string, unknown>): Promise<void> {
    const { SingleDocsBuild } = await import('./single.docs-build')
    const builder = new SingleDocsBuild()
    await builder.renderVuepressTemplates(vuepressPath, data)
  }

  /**
   * 合并用户自定义样式
   */
  private async mergeStyles(vuepressPath: string, styleDir: string): Promise<void> {
    const styleSource = path.resolve(styleDir)
    if (!fs.existsSync(styleSource)) return

    const styleTarget = path.resolve(vuepressPath, 'src/.vuepress/styles')
    const files = globSync.sync('**/*', { dot: true, nodir: true, cwd: styleSource })

    files.forEach((file) => {
      const sourceFile = path.resolve(styleSource, file)
      const targetFile = path.resolve(styleTarget, file)
      fs.mkdirpSync(path.dirname(targetFile))
      fs.copyFileSync(sourceFile, targetFile)
      console.log(`  Style: ${file}`)
    })
  }

  /**
   * 构建 VuePress locales 对象
   */
  private buildLocales(): Record<string, { lang: string }> {
    const locales: Record<string, { lang: string }> = {
      '/': { lang: this.languages[0] },
    }

    let i = 1
    while (i < this.languages.length) {
      locales[`/${this.languages[i]}/`] = { lang: this.languages[i] }
      i += 1
    }

    return locales
  }

  /**
   * 从 git 获取仓库信息
   */
  private async tryGetGitInfo(): Promise<void> {
    try {
      const git = SimpleGit()
      const gitConfigs = await git.listConfig()

      let configs: ConfigValues = {}
      gitConfigs.files.forEach((p) => {
        const config = gitConfigs.values[p]
        configs = { ...configs, ...config }
      })

      if (configs['remote.origin.url']) {
        const url = configs['remote.origin.url']
        const gitUrl = Array.isArray(url) ? url[0] : url
        this.repo = GitUrlParse(gitUrl).toString('https')
      }
    } catch {
      // git 信息非必需，静默失败
    }
  }
}
