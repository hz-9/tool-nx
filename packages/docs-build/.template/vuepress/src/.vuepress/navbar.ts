import { navbar } from 'vuepress-theme-hope'

import type { NavbarOptions } from 'vuepress-theme-hope'

/**
 * Icon 从 https://fontawesome.com/search 中获取
 */
export default (() => {
  const navbarPerLang: Record<string, NavbarOptions> = {{ JSON.stringify(navigation.navbar, undefined, 2) }}

  Object.keys(navbarPerLang).forEach((key) => {
    navbarPerLang[key] = navbar(navbarPerLang[key])
  })

  return navbarPerLang
})()
