import { NavbarOptions, SidebarOptions } from './vuepress-theme-hope'

export type RenderTemplatesLocalesOptions = Record<string, { lang: string }>

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
