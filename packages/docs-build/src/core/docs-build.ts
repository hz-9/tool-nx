import * as fs from 'fs-extra'
import * as path from 'upath'
import GitUrlParse from 'git-url-parse'
import { glob, globSync } from 'glob'
import _ from 'lodash'
import ora from 'ora'
import SimpleGit, { type ConfigValues } from 'simple-git'

import type {
  CopyFileEntry,
  DocsBuildOptions,
  DocsBuildResult,
  DocsBuildStats,
  NavbarGroupOptions,
  NavbarLinkOptions,
  NavbarOptions,
  SidebarGroupItem,
  SidebarObjectOptions,
  SidebarOptions,
  SidebarPageItem,
  SidebarStructureItem,
} from '../interface/index'
import { RenderTemplatesLocalesOptions, RenderTemplatesOptions } from '../interface/render-options'
import { readPkg } from '../util/index'
import { IGNORE_PATTERNS } from './constants'

/**
 * @public
 *
 * Generate documentation build configuration
 */
export class DocsBuild {
  private readonly options: DocsBuildOptions

  /**
   * Constructs a new DocsBuild instance.
   *
   * 构造一个新的 DocsBuild 实例。
   *
   * @param options - The documentation build options.
   */
  public constructor(options: DocsBuildOptions) {
    this.options = options
  }

  /**
   * @public
   *
   * Static entry point: create a DocsBuild instance and execute the build.
   *
   * 执行文档构建。
   *
   * @param options - The documentation build options.
   *
   * @returns The build result.
   */
  public static async resolve(options: DocsBuildOptions): Promise<DocsBuildResult> {
    const build = new DocsBuild(options)
    return build.resolve()
  }

  /**
   * @public
   *
   * Main entry: generate VuePress configuration from the build options.
   *
   * 主入口。
   *
   * @returns The build result.
   */
  public async resolve(): Promise<DocsBuildResult> {
    const { options } = this
    const outputPath = path.resolve(options.output || './docs/.vuepress')

    // 1. 解析站点信息
    const pkg = readPkg()
    const title = options.site.title || pkg.name || ''
    const description = options.site.description || pkg.description || ''

    // 2. 获取 git 信息
    const gitUrl = await this.tryGetGitInfo()

    // 3. 处理导航栏和侧边栏（多语言展开 + 路径映射）
    const languages: string[] = options.locales?.languages ?? [options.site.lang]

    const locales: RenderTemplatesLocalesOptions = {}

    const navigationNavbars: Record<string, NavbarOptions> = {}
    const navigationSidebars: Record<string, SidebarOptions> = {}

    languages.forEach((lang) => {
      const isMainLang = lang === options.site.lang

      if (isMainLang) {
        locales['/'] = {
          lang,
        }
      } else {
        locales[`/${lang}/`] = {
          lang,
        }
      }

      navigationNavbars[lang] = this.transformNavbarOptions(options.navigation.navbar, lang)
      navigationSidebars[lang] = this.transformSidebarOptions(options.navigation.sidebar, lang)
    })

    // 5. 拷贝文件到输出目录
    const stats = this.copyFiles(options.baseSourceDir, outputPath)

    // 6. 渲染 VuePress 模板
    await this.renderTemplates(outputPath, {
      site: {
        title,
        description,
        base: options.site.base || '/',
        repo: gitUrl,
        locales,
      },

      navigation: {
        navbar: navigationNavbars,
        sidebar: navigationSidebars,
      },
    })

    return {
      outputPath,
      configPath: path.resolve(outputPath, 'src/.vuepress/config.ts'),
      stats,
    }
  }

  /**
   * Transform navbar options for a specific language.
   * Resolves multilingual text in each navbar item.
   *
   * 转换导航栏配置为指定语言。
   * 解析每个导航项中的多语言文本。
   *
   * @param options - The navbar options to transform.
   * @param lang - The target language.
   *
   * @returns The transformed navbar options.
   */
  public transformNavbarOptions(options: NavbarOptions, lang: string): NavbarOptions {
    return options.map((item) => this.transformNavItem(item, lang))
  }

  // ─── 多語言文本解析 ───────────────────────────────────────────

  private resolveLangText(text: string | Record<string, string>, lang: string): string {
    if (typeof text === 'string') return text

    return text[lang] ?? Object.values(text)[0] ?? ''
  }

  // ─── 文件拷貝 ──────────────────────────────────────────────

  private copyFiles(baseSourceDir: string, outputPath: string): DocsBuildStats {
    const sourceDir = path.resolve(baseSourceDir)
    const targetDir = path.resolve(outputPath, 'src')

    const langMain = this.options.site.lang
    const languages = this.options.locales?.languages ?? [langMain]

    // 構建語言後綴模式（排除主語言，主語言由 base 文件覆蓋）
    const langPatterns = languages
      .filter((lang) => lang !== langMain)
      .map((lang) => ({
        lang,
        suffix: `.${lang}.md`,
      }))

    fs.mkdirpSync(targetDir)

    // ── 掃描階段 ─────────────────────────────────────────────
    const scanSpinner = ora({ text: 'Scanning source files...', color: 'cyan' }).start()

    const scanResult = globSync('**/*', {
      cwd: sourceDir,
      nodir: true,
      dot: true,
      ignore: IGNORE_PATTERNS,
    })

    scanSpinner.succeed(`Scanned ${scanResult.length} source files`)

    // ── 分組 ─────────────────────────────────────────────────
    // Map<mainPath, Map<lang, langFilePath>>
    //   mainPath 是去語言後綴後的相對路徑（始終 .md 結尾）
    //   非 md 文件／無語言後綴文件：key = file, languages = empty

    const fileMap: Record<string, Record<string, string>> = {}

    // eslint-disable-next-line no-restricted-syntax
    scanResult.forEach((file) => {
      let matched: { lang: string; suffix: string } | null = null

      if (/.md$/.test(file)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const lp of langPatterns) {
          if (file.endsWith(lp.suffix)) {
            matched = lp
            break
          }
        }
      }

      if (matched) {
        const mainPath = `${file.slice(0, -matched.suffix.length)}.md`
        if (!fileMap[mainPath]) {
          fileMap[mainPath] = {}
        }
        fileMap[mainPath][matched.lang] = file
      } else if (!fileMap[file]) {
        // 基礎文件（無語言後綴）或非 md 文件
        fileMap[file] = {}
      }
    })

    // ── 拷貝文件 ─────────────────────────────────

    const entries: CopyFileEntry[] = []
    const mainPaths = Object.keys(fileMap)
    const totalOperations = mainPaths.length * languages.length

    const copySpinner = ora({ text: 'Copying files...', color: 'cyan' }).start()

    mainPaths.forEach((mainPath) => {
      const fileInfo = fileMap[mainPath]

      languages.forEach((lang) => {
        const isMainLang = lang === langMain

        if (isMainLang) {
          const paths = [mainPath, ...Object.values(fileInfo)]
          const result = this.copyFile(sourceDir, targetDir, mainPath, paths)
          entries.push(result)
        } else {
          const langTargetDir = path.resolve(targetDir, lang)
          const paths = [mainPath, ...Object.values(fileInfo)]

          const langFile = fileInfo[lang]

          if (langFile) {
            paths.unshift(langFile)
          }

          const result = this.copyFile(sourceDir, langTargetDir, mainPath, paths)
          entries.push(result)
        }

        copySpinner.text = `Copying files... (${entries.length}/${totalOperations})`
      })
    })

    const directMappedCount = entries.filter((e) => e.isDirectMap).length

    copySpinner.succeed(`Copied ${entries.length} files (${directMappedCount} directly mapped)`)

    return {
      totalScanned: scanResult.length,
      totalCopied: entries.length,
      totalDirectMapped: directMappedCount,
      files: entries,
    }
  }

  private copyFile(baseSourceDir: string, outputPath: string, mainPath: string, filePaths: string[]): CopyFileEntry {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of filePaths) {
      const filePath = path.resolve(baseSourceDir, file)

      if (fs.existsSync(filePath)) {
        const targetPath = path.resolve(outputPath, mainPath)
        const targetDir = path.dirname(targetPath)

        fs.mkdirpSync(targetDir)
        fs.copyFileSync(filePath, targetPath)

        return {
          mainPath,
          sourceFile: file,
          targetFile: mainPath,
          isDirectMap: file === mainPath,
        }
      }
    }

    return {
      mainPath,
      sourceFile: '',
      targetFile: mainPath,
      isDirectMap: false,
    }
  }

  // ─── 導航項遞迴轉換 ──────────────────────────────────────────

  private transformNavItem(
    item: NavbarLinkOptions | NavbarGroupOptions,
    lang: string
  ): NavbarLinkOptions | NavbarGroupOptions {
    if (typeof item === 'string') {
      return item
    }

    if ('children' in item) {
      return {
        ...item,
        text: this.resolveLangText(item.text, lang),
        link: item.link,
        children: item.children.map((child) => this.transformNavItem(child, lang)) as typeof item.children,
      }
    }

    return {
      ...item,
      text: this.resolveLangText(item.text, lang),
      link: item.link,
    }
  }

  // ─── 側邊欄轉換 ──────────────────────────────────────────────

  /**
   * Transform sidebar options for a specific language.
   * Resolves multilingual text in each sidebar item.
   *
   * 转换侧边栏配置为指定语言。
   * 解析每个侧边栏项中的多语言文本。
   *
   * @param options - The sidebar options to transform.
   * @param lang - The target language.
   *
   * @returns The transformed sidebar options.
   */
  public transformSidebarOptions(options: SidebarOptions, lang: string): SidebarOptions {
    if (typeof options === 'string' || options === false) {
      return options
    }

    if (Array.isArray(options)) {
      return options.map((item) => this.transformSidebarElement(item, lang))
    }

    const result: SidebarObjectOptions = {}

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(options)) {
      if (typeof value === 'string' || value === false) {
        result[key] = value
      } else {
        result[key] = value.map((item) => this.transformSidebarElement(item, lang))
      }
    }

    return result
  }

  private transformSidebarElement(
    item: SidebarPageItem | SidebarGroupItem | SidebarStructureItem | string,
    lang: string
  ): SidebarPageItem | SidebarGroupItem | SidebarStructureItem | string {
    if (typeof item === 'string') {
      return item
    }

    if ('children' in item) {
      if (typeof item.children === 'string') {
        return {
          ...item,
          text: this.resolveLangText(item.text, lang),
          link: item.link,
        }
      }

      return {
        ...item,
        text: this.resolveLangText(item.text, lang),
        link: item.link,
        children: item.children.map((child) => this.transformSidebarElement(child, lang)),
      }
    }

    return {
      ...item,
      text: this.resolveLangText(item.text, lang),
      link: item.link,
    }
  }

  /**
   * 渲染 VuePress 模板文件
   */
  private async renderTemplates(vuepressPath: string, data: RenderTemplatesOptions): Promise<void> {
    const vuepressTemplate = path.resolve(__dirname, '../../.template/vuepress')

    const globResult = await glob('**/*', { dot: true, nodir: true, cwd: vuepressTemplate })

    let i = 0
    while (i < globResult.length) {
      const filepath = globResult[i]

      const p1 = path.resolve(vuepressTemplate, filepath)
      const p2 = path.resolve(vuepressPath, filepath)

      if (/js$|ts$|json$|yaml$|md$/.test(filepath)) {
        const text = await fs.readFile(p1, { encoding: 'utf8' })
        const textRender = _.template(text, { interpolate: /{{([\s\S]+?)}}/g })(data)
        await fs.mkdirp(path.dirname(p2))
        await fs.writeFile(p2, textRender, { encoding: 'utf8' })
      } else {
        await fs.copy(p1, p2)
      }

      i += 1
    }
  }

  /**
   * 从 git 获取仓库信息
   */
  private async tryGetGitInfo(): Promise<string | null> {
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
        return GitUrlParse(gitUrl).toString('https')
      }
    } catch {
      // git 信息非必需，静默失败
    }

    return null
  }
}
