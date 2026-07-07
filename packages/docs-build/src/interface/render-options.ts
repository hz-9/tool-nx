import { NavbarOptions, SidebarOptions } from './vuepress-theme-hope'

/**
 * @public
 *
 * Locales options for rendering templates.
 * Key is the locale path, value contains the language code.
 *
 * 渲染模板的多语言选项。
 * 键为语言路径，值为语言代码。
 */
export type RenderTemplatesLocalesOptions = Record<string, { lang: string }>

/**
 * @public
 *
 * Template rendering options for VuePress configuration.
 *
 * VuePress 配置的模板渲染选项。
 */
export interface RenderTemplatesOptions {
  site: {
    base: string
    title: string
    description: string
    repo: string | null
    locales: RenderTemplatesLocalesOptions
  }

  navigation: {
    navbar: Record<string, NavbarOptions>
    sidebar: Record<string, SidebarOptions>
  }
}
