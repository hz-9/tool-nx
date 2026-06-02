import { navbar } from 'vuepress-theme-hope'

/**
 * Icon 从 https://fontawesome.com/search 中获取
 */
export default (() => {
  const navbarPerLang: Record<string, unknown[]> = {{ JSON.stringify(navbarPerLang, undefined, 2) }}

  const obj: Record<string, unknown[]> = {}

  Object.keys(navbarPerLang).forEach((key) => {
    obj[key] = navbar(navbarPerLang[key])
  })

  return obj
})()
