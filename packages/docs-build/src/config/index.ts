/**
 * 默认语言文件后缀检测（仅用于单语言模式的默认检测）
 */
export const langFileSuffix: Record<string, RegExp> = {
  'en-US': /\.en-US\.md$/,
  'zh-CN': /\.zh-CN\.md$/,
}

export const langFileSuffixes: RegExp[] = Object.values(langFileSuffix)
