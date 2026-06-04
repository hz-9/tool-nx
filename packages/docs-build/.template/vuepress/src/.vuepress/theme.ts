import { hopeTheme } from 'vuepress-theme-hope'

import type { NavbarOptions, SidebarOptions } from 'vuepress-theme-hope'

import navbar from './navbar.js'
import sidebar from './sidebar.js'

const localesPre: Record<string, { lang: string }> = {{ JSON.stringify(site.locales, undefined, 2) }}

const locales: Record<string, { navbar: NavbarOptions; sidebar: SidebarOptions }> = {}

Object.keys(localesPre).forEach((key) => {
  locales[key] = {
    navbar: navbar[localesPre[key].lang],
    sidebar: sidebar[localesPre[key].lang],
  }
})

// // Sidebar at top level — VuePress matches sidebar keys against full page path
// // This works correctly across all locales (e.g. /overview/ for EN, /zh-CN/overview/ for ZH)
// const sidebarConfig: Record<string, unknown[]> = {}
// Object.keys(sidebar).forEach((key) => {
//   sidebarConfig[key] = sidebar[key]
// })

// // Navbar per locale — only locale-specific overrides go here
// const locales: Record<string, Record<string, unknown>> = {}
// Object.keys(navbar).forEach((key) => {
//   if (!locales[key]) locales[key] = {}
//   locales[key].navbar = navbar[key]
// })

export default hopeTheme({
  docsDir: 'src',

  repo: {{ site.repo ? JSON.stringify(site.repo) : 'undefined' }},

  locales,

  footer: '',

  displayFooter: true,

  editLink: false,

  plugins: {
    icon: {
      assets: 'fontawesome',
    },
  },
})
