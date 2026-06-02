export * from './options'
export * from './vuepress-theme-hope.navbar-options'
export * from './vuepress-theme-hope.sidebar-options'

/**
 * @public
 *
 * The data mounting object.
 */
export interface IDocsItem {
  baseFilepath: string

  focusFilepath: string
}
