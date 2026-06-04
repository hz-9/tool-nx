import { NavbarOptions, SidebarOptions } from './vuepress-theme-hope'

/**
 * @public
 *
 * 导航配置
 */
export interface NavigationOptions {
  /** 导航栏列表 */
  navbar: NavbarOptions

  /** 侧边栏，key 为路由路径前缀，如 '/guide/' */
  sidebar: SidebarOptions
}

/**
 * @public
 *
 * 站点元信息
 */
export interface SiteOptions {
  /** 站点标题，默认从 package.json name 取 */
  title?: string

  /** 站点描述，默认从 package.json description 取 */
  description?: string

  /** VuePress base 路径，默认 '/' */
  base?: string

  /** 主语言，默认 'en-US' */
  lang: string

  /** 仓库地址，默认从 git remote 自动提取 */
  repo?: string
}

/**
 * @public
 *
 * 外观配置
 */
export interface AppearanceOptions {
  /** 用户自定义样式目录，同名文件覆盖内置默认样式 */
  styleDir?: string
}

/**
 * @public
 *
 * 多语言配置
 */
export interface LocalesOptions {
  /** 启用的语言列表，如 ['en-US', 'zh-CN'] */
  languages: string[]
}

/**
 * @public
 *
 * \@hz-9/docs-build 完整配置选项
 */
export interface DocsBuildOptions {
  /**
   * 源 markdown 路径前缀，用于路径映射
   * 如 'docs'，则 link: 'docs/guide/README.md' 会映射到路由 '/guide/'
   */
  baseSourceDir: string

  /** 站点元信息 */
  site: SiteOptions

  /** 导航配置 */
  navigation: NavigationOptions

  /** 外观配置 */
  appearance?: AppearanceOptions

  /** 多语言配置，不传则为单语言 */
  locales?: LocalesOptions

  /** 输出目录，默认 './docs/.vuepress' */
  output?: string
}

/**
 * @public
 *
 * 程序调用结果
 */
export interface DocsBuildResult {
  /** 输出目录路径 */
  outputPath: string

  /** 生成的 VuePress 配置文件路径 */
  configPath: string
}
