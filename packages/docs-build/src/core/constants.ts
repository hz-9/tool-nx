/**
 * @public
 *
 * 預設忽略的文件/目錄模式列表
 */
export const IGNORE_PATTERNS = [
  // 通用操作系統文件
  '**/.DS_Store',
  '**/Thumbs.db',

  // 依賴目錄
  '**/node_modules/**',

  // 版本控制
  '**/.git/**',
  '**/.gitkeep',
  '**/.gitattributes',
  '**/.gitignore',

  // 構建產物
  '**/dist/**',
  '**/lib/**',
  '**/build/**',
  '**/out/**',
  '**/.heft/**',

  // 快取
  '**/.cache/**',
  '**/.eslintcache',
  '**/.npm/**',
  '**/.nx/**',

  // 測試覆蓋率
  '**/coverage/**',
  '**/.nyc_output/**',

  // IDE / 編輯器
  '**/.idea/**',
  '**/.vscode/**',
  '**/.vs/**',

  // 日誌
  '**/*.log',

  // 運行時 / 環境
  '**/.env',
  '**/.env.*',
  '**/.nvmrc',

  // 其他工具生成文件
  '**/*.pid',
  '**/*.seed',
  '**/*.pid.lock',
  '**/*.tgz',
  '**/.yarn-integrity',
  '**/*.tsbuildinfo',

  '**/.vuepress/**',
]
