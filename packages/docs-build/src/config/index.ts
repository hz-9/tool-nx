/**
 * @public
 *
 * Default language file suffix detection patterns (for single-language mode only).
 *
 * 默认语言文件后缀检测（仅用于单语言模式的默认检测）。
 */
export const langFileSuffix: Record<string, RegExp> = {
  'en-US': /\.en-US\.md$/,
  'zh-CN': /\.zh-CN\.md$/,
}

/**
 * @public
 *
 * Array of all language file suffix regex patterns.
 *
 * 所有语言文件后缀正则表达式的数组。
 */
export const langFileSuffixes: RegExp[] = Object.values(langFileSuffix)
