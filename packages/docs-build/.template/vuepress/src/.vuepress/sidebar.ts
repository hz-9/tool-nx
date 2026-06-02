import { sidebar } from 'vuepress-theme-hope'

/**
 * Icon 从 https://fontawesome.com/search 中获取
 */
export default (() => {
  const sidebarPerLang: Record<string, unknown[]> = {{ JSON.stringify(sidebarPerLang, undefined, 2) }}

  const obj: Record<string, unknown[]> = {}

  Object.keys(sidebarPerLang).forEach((key) => {
    obj[key] = sidebar(sidebarPerLang[key])
  })

  return obj
})()
