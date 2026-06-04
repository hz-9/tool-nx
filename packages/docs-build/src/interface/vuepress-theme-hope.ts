/**
 * @public
 *
 * Type definitions extracted from `vuepress-theme-hope` (data-BaDXBlcL.d.ts),
 * related to NavbarOptions and SidebarOptions.
 *
 * 从 vuepress-theme-hope 的 data-BaDXBlcL.d.ts 中提取的与 NavbarOptions 和 SidebarOptions 关联的 type 与 interface。
 *
 * These types replace the previously manually maintained I-prefixed type definitions.
 */

// ─── Base types ─────────────────────────────────────────────

/** @public Base nav item, displayed as text */
export interface NavItemOptions {
  text: string | Record<string, string>
  icon?: string
  ariaLabel?: string
}

/** @public Options for `<AutoLink>` */
export interface AutoLinkOptions extends NavItemOptions {
  link: string
  rel?: string
  target?: string
  activeMatch?: string
}

/** @internal */
interface ThemeBasePageFrontmatter {
  home?: boolean
  navbar?: boolean
  sidebar?: 'heading' | false
  containerClass?: string
}

/** @internal */
interface ThemePageData {
  filePathRelative: string | null
}

// ─── Navbar types (from src/shared/navbar.d.ts) ─────────────

/** @public Base nav group, has nav items children */
export interface NavGroup<Child> extends NavItemOptions {
  prefix?: string
  link?: string
  children: Child[]
}

/** @public */
export type NavbarLinkOptions = AutoLinkOptions | string

/** @public */
export type NavbarGroupOptions = NavGroup<NavbarLinkOptions | NavGroup<NavbarLinkOptions>>

/** @public */
export type NavbarOptions = (NavbarLinkOptions | NavbarGroupOptions)[]

// ─── Sidebar options types (from src/shared/sidebar.d.ts) ───

/** @public */
export type SidebarPageItem = AutoLinkOptions

/** @public */
export interface SidebarStructureItem extends NavItemOptions {
  prefix?: string
  link?: string
  collapsible?: boolean
  children: 'structure'
}

/** @public */
export interface SidebarGroupItem extends NavItemOptions {
  prefix?: string
  link?: string
  collapsible?: boolean
  children: (SidebarPageItem | SidebarGroupItem | SidebarStructureItem | string)[]
}

/** @internal */
type SidebarItem = SidebarPageItem | SidebarGroupItem | SidebarStructureItem | string

/** @public */
export type SidebarArrayOptions = SidebarItem[]

/** @public */
export type SidebarObjectOptions = Record<string, SidebarArrayOptions | 'structure' | 'heading' | false>

/** @public */
export type SidebarOptions = SidebarArrayOptions | SidebarObjectOptions | 'structure' | 'heading' | false

// ─── Sidebar structure/sorting types (from src/shared/options/layout/sidebar.d.ts) ───

/** @internal */
interface StructureSidebarDirOptions {
  text?: string
  icon?: string
  expanded?: boolean
  collapsible?: boolean
  link?: boolean
  index?: boolean
  order?: number
}

/** @internal */
interface ThemeNormalPageFrontmatter extends ThemeBasePageFrontmatter {
  home?: false
  index?: boolean
  order?: number
  dir?: StructureSidebarDirOptions
  shortTitle?: string
  lastUpdated?: boolean
  changelog?: boolean
  contributors?: boolean | string[]
  editLink?: boolean
  prev?: string | AutoLinkOptions
  next?: string | AutoLinkOptions
  toc?: boolean | Record<string, unknown>
  pageInfo?: string[] | false
  breadcrumb?: boolean
  breadcrumbIcon?: boolean
  breadcrumbExclude?: boolean
  pageview?: boolean
  article?: boolean
  sticky?: boolean | number
  star?: boolean | number
  excerpt?: string
}

/** @internal */
export interface SidebarFileInfo {
  type: 'file'
  filename: string
  title: string
  order: number | null
  path?: string | null
  frontmatter: ThemeNormalPageFrontmatter
  pageData: ThemePageData
}

/** @internal */
export interface SidebarDirInfo {
  type: 'dir'
  dirname: string
  children: SidebarInfo[]
  title: string
  order: number | null
  groupInfo: {
    icon?: string
    expanded?: boolean
    collapsible?: boolean
    link?: string
  }
  frontmatter: ThemeNormalPageFrontmatter | null
  pageData: ThemePageData | null
}

/** @internal */
export type SidebarInfo = SidebarFileInfo | SidebarDirInfo

/** @internal */
export type SidebarSorterKeyword = 'readme' | 'order' | 'date' | 'date-desc' | 'filename' | 'title'

/** @internal */
export type SidebarSorterFunction = (infoA: SidebarInfo, infoB: SidebarInfo) => number

/** @internal */
export type SidebarSorter =
  | SidebarSorterFunction
  | SidebarSorterKeyword
  | (SidebarSorterKeyword | SidebarSorterFunction)[]

/** @internal */
export interface SidebarLocaleOptions {
  sidebar?: SidebarOptions
}
