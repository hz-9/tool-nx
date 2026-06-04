import { sidebar } from 'vuepress-theme-hope'

import type { SidebarOptions } from 'vuepress-theme-hope'

/**
 * Icon 从 https://fontawesome.com/search 中获取
 */
export default (() => {
  const sidebarPerLang: Record<string, SidebarOptions> = {{ JSON.stringify(navigation.sidebar, undefined, 2) }}

  Object.keys(sidebarPerLang).forEach((key) => {
    sidebarPerLang[key] = sidebar(sidebarPerLang[key])
  })

  return sidebarPerLang
})()
