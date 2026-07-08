# CLI 输出格式标准化方案

本文档基于 [clig.dev](https://clig.dev/)（Command Line Interface Guidelines）和 Node.js 社区最佳实践，为所有 `@hz-9` CLI 项目制定统一的输出标准。

> **目录**
>
> - 一、[命令解析 - commander](#一命令解析---commander)
> - 二、[着色方案 - chalk](#二着色方案---chalk)
> - 三、[间距控制规范](#三间距控制规范)
>   - 3.1 [基本间距规则](#31-基本间距规则)
>   - 3.2 [具体间距标准](#32-具体间距标准示例均输出到-stderr符合流规范)
>   - 3.3 [Indent 辅助函数](#33-indent-辅助函数规范要求)
>   - 3.4 [超长值截断与换行策略](#34-超长值截断与换行策略)
> - 四、[Loading 效果 - ora](#四loading-效果---ora)
> - 五、[表格效果 - cli-table3](#五表格效果---cli-table3)
> - 六、[Downloading 效果 - cli-progress](#六downloading-效果---cli-progress)
> - 七、[辅助工具集](#七辅助工具集规范建议实现的工具函数)
> - 八、[输出流规范](#八输出流规范)
> - 九、[日志级别控制](#九日志级别控制)
> - 十、[错误处理规范](#十错误处理规范)
> - 十一、[JSON 输出规范](#十一json-输出规范)
> - 十二、[Deprecation 警告格式](#十二deprecation-警告格式)
> - 十三、[敏感信息脱敏规范](#十三敏感信息脱敏规范)
> - 十四、[交互式提示/确认规范](#十四交互式提示确认规范)
> - 十五、[完整示例](#十五完整示例)
> - 十六、[推荐的 npm 包清单](#十六推荐的-npm-包清单)
> - 十七、[迁移路径](#十七迁移路径)
> - 十八、[合规检查清单](#十八合规检查清单)

## 一、命令解析 - commander

**现状：** 项目已在使用 `commander`，这是一流的决策。

**规范：**

- `commander@~12.x` 作为统一 CLI 框架
- 保持现有的 `Commander` 类模式（如 `packages/docs-build/src/core/commander.ts`）
- 所有 CLI 命令统一采用 `camelCase` 选项命名（commander 自动支持 `--camel-case` 转 `camelCase`）
- 支持 `--json`（参见[第十一节](#十一json-输出规范)）和 `--plain`（等价于 `NO_COLOR`，参见[第二节](#二着色方案---chalk)）标志（clig.dev 推荐）
- 支持 `--verbose` / `-v` 和 `--quiet` / `-q` 全局日志级别控制标志（参见[第九节](#九日志级别控制)）
- 可选支持 `--yes` / `-y`：跳过所有交互式确认提示（参见[第十四节](#十四交互式提示确认规范)），适用于 CI 自动化场景
- 可选支持 `--dry-run`：展示将要执行的操作而不实际执行，需配合 `isDryRun` 全局状态。开启时：不执行副作用操作，但正常输出日志和进度信息。
- **`--help` / `--version` 格式化：** 使用 `program.configureHelp()` 自定义帮助文本着色；`--version` 使用 `chalk.bold.cyan` 格式化版本号。

## 二、着色方案 - chalk

**选择：** `chalk@~5.x`（最成熟，生态最广）

> **注意：** `chalk@~5.x` 为 **ESM-only**，项目需确保 `package.json` 包含 `"type": "module"` 或使用动态 `import()`。若项目尚为 CJS，考虑 `chalk@4.x` 作为过渡方案，但应规划 ESM 迁移。
>
> 遵循 [no-color.org](https://no-color.org/) 标准：设置环境变量 `NO_COLOR=1` 时，chalk 自动禁用颜色。无需额外处理。

**色彩语义标准化（核心规范）：**

``` ts
// 状态色
chalk.bold.blue('ℹ')     // 信息
chalk.bold.green('✔')    // 成功
chalk.bold.yellow('⚠')   // 警告
chalk.bold.red('✖')      // 错误

// 层级色
chalk.cyan(str)           // 命令/代码片段
chalk.gray(str)           // 次要信息、调试
chalk.white(str)          // 正文
chalk.dim(str)            // 辅助提示

// 高亮
chalk.bold.white(str)     // 标题/关键值
chalk.hex('#FF8800')(str) // 轮询/下载 URL（仅限特需场景）
```

> **注意：** 上述代码示例为直观展示颜色效果，硬编码了 Unicode 符号字符 `ℹ` `✔` `⚠` `✖`。实际生产代码应通过 [`log-symbols`](https://github.com/sindresorhus/log-symbols) 获取符号，以确保跨平台兼容性。详见下文说明。

**输出格式模板（搭配第七节的辅助函数使用）：**

> 以下示例使用 `console.error`（stderr）展示 UI 元素。实际生产代码应调用第七节定义的 `printHeader`、`printOptions`、`printInfo` 等函数。

``` ts
// 标题区 - 程序名 + 版本（stderr，非数据输出）
console.error(`${chalk.bold.cyan(pkg.name)} ${chalk.gray(pkg.version)}`)

// 信息标签
console.error(`${chalk.bold('Options:')}`)
console.error(`  ${chalk.cyan('root')}        : ${chalk.white(options.root)}`)

// 成功消息
console.error(`${chalk.bold.green('✔')} Build completed successfully`)

// 错误消息（stderr）
console.error(`${chalk.bold.red('✖')} ${chalk.red(error.message)}`)

// 执行命令
console.error(`${chalk.gray('$')} ${chalk.cyan(command)}`)
```

> **符号图标与 log-symbols：** 上述 `ℹ` `✔` `⚠` `✖` 符号由 [log-symbols](https://github.com/sindresorhus/log-symbols) 提供统一跨平台支持。请通过 `log-symbols` 获取符号，避免硬编码 Unicode 字符。

**推荐的完整预设色板：**

| 用途 | 颜色 | chalk API | 亮度等级 |
| ------ | ------ | ----------- | --------- |
| 程序标题 | Cyan | `chalk.bold.cyan` | 醒目 |
| 版本文本 | Gray | `chalk.gray` | 次要 |
| 标签/键名 | Cyan | `chalk.cyan` | 标准 |
| 值内容 | White | `chalk.white` | 正常 |
| 成功 | Green | `chalk.bold.green` | 醒目 |
| 错误 | Red | `chalk.bold.red` | 醒目 |
| 警告 | Yellow | `chalk.bold.yellow` | 醒目 |
| 调试/次要 | Dim | `chalk.dim` | 低 |
| 命令代码 | Cyan | `chalk.cyan` | 标准 |
| 文件路径 | Magenta | `chalk.magenta` | 标准 |

**终端与 Unicode 兼容性：**

- **Windows Terminal：** 现代 Windows Terminal (Win10 1903+/Win11) 对上述 16 色标准色和 Unicode 符号支持良好。`chalk` 自动处理 Windows 控制台颜色适配，无需额外配置。
- **Unicode 符号回退：** `log-symbols` 在 Windows 旧终端 (`cmd.exe`) 下自动回退为 `!` `√` `?` `×` 等兼容符号。建议始终通过 `log-symbols` 获取符号而非硬编码。
- **emoji 使用限制：** CLI 输出中不应使用 emoji 符号。统一使用 `log-symbols` 的语义符号（`✔` `✖` `⚠` `ℹ`）和 `•` `─` `│` 等标准 ASCII/Unicode 字符。
- **NO_COLOR 标准：** 遵循 [no-color.org](https://no-color.org/)，设置 `NO_COLOR=1` 时 chalk 自动禁用所有颜色。此外，项目应主动检测 `TERM=dumb` 环境变量并降级。
- **FORCE_COLOR：** 当 CI/CD 环境需要强制着色（如日志收集）时，设置 `FORCE_COLOR=1`，chalk 会忽略非 TTY 限制强制输出颜色。

## 三、间距控制规范

### 3.1 基本间距规则

借鉴 clig.dev 中 Google Hermit 的间距设计：

``` sh
// 1. 节之间：1 个空行
[标题]
[空行]
[内容块]
[空行]
[内容块]

// 2. 缩进层级：2 个空格（非 tab）
  root        : /path/to/project
  config      : /path/to/config
    sub-key   : value

// 3. 键值对齐：冒号前补空格对齐
  root        : /path    // 对齐最长 key + 2 空格
  long-key    : value
```

### 3.2 具体间距标准（示例均输出到 stderr，符合流规范）

``` ts
// 函数签名间距
console.error()                          // 函数前后保持空行

// 标题与内容的间距
console.error(`${chalk.bold('Options:')}`)
console.error(`  ${key} : ${value}`)     // 缩进 2 空格
console.error()                          // 内容结束后空行

// 多值对齐（数组场景）
  assets      : /path/a
              : /path/b               // 续行与上次冒号对齐

// 命令输出间距
$ docker pull node:20-slim            // 前有一个空行
[输出内容]
                                      // 后有一个空行
```

### 3.3 Indent 辅助函数（规范要求）

每个项目应维护或使用一个 `indent` 工具函数：

```ts
// 标准缩进工具
const INDENT = '  ' // 2 个空格
const indent = (str: string, level = 1): string =>
  `${INDENT.repeat(level)}${str}`
```

```ts
// 键对齐工具（支持任意值类型，会自动转为字符串）
// 注意：值为对象类型时使用 JSON.stringify 替代 String(v)
const formatValue = (v: unknown): string => {
  if (v === null) return chalk.gray('null')
  if (v === undefined) return chalk.gray('-')
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

const alignKeys = (map: Record<string, unknown>): string => {
  const maxLen = Math.max(...Object.keys(map).map(k => k.length))
  return Object.entries(map)
    .map(([k, v]) => indent(`${k.padEnd(maxLen)} : ${formatValue(v)}`))
    .join('\n')
}
```

### 3.4 超长值截断与换行策略

当配置值、路径或消息超出终端宽度时，应截断或换行显示：

```ts
import os from 'node:os'

// 终端宽度检测
const getTerminalWidth = (): number =>
  Math.min(process.stderr.columns ?? 80, 120)

// 中间省略（保留首尾，适合路径）
const truncateMiddle = (str: string, maxLen = 60): string => {
  if (str.length <= maxLen) return str
  const half = Math.floor((maxLen - 3) / 2)
  return `${str.slice(0, half)}${chalk.dim('...')}${str.slice(-half)}`
}

// 尾部省略（适合 URL、长消息）
const truncateEnd = (str: string, maxLen = 80): string => {
  if (str.length <= maxLen) return str
  return `${str.slice(0, maxLen - 3)}${chalk.dim('...')}`
}

// 路径缩写：$HOME → ~
const shortenPath = (filePath: string): string => {
  const home = os.homedir()
  return filePath.replace(home, '~')
}
```

**使用场景与截断阈值：**

| 内容类型 | 默认截断长度 | 策略 |
|---------|------------|------|
| 文件/目录路径 | 60 字符 | `truncateMiddle` + `shortenPath` |
| URL 地址 | 80 字符 | `truncateEnd` |
| 长文本消息 | 120 字符 | `truncateEnd` |
| 表格单元格 | 按列宽自动 | `truncateEnd` |

## 四、Loading 效果 - ora

**选择：** `ora@~8.x`（最流行的 spinner 库，支持 Promise 包装，TypeScript）

> **注意：** `ora@~8.x` 为 **ESM-only**，与 `chalk@~5.x` 相同。若项目为 CJS，需使用动态 `import('ora')` 或升级至 ESM。

**使用规范：**

```ts
import ora from 'ora'

// 基本用法
const spinner = ora(chalk.cyan('正在下载基础镜像...')).start()
try {
  await downloadBaseImage()
  spinner.succeed(chalk.green('基础镜像下载完成'))
} catch (error) {
  spinner.fail(chalk.red(`下载失败: ${error.message}`))
}

// Promise 包装（推荐）
await ora.promise(
  downloadBaseImage(),
  {
    text: '正在下载基础镜像...',
    successText: '基础镜像下载完成',
    failText: (err) => `下载失败: ${err.message}`,
  }
)

// 多步骤串联（含错误处理）
const steps = ['拉取代码', '安装依赖', '构建', '发布']
const spinner = ora()
for (const step of steps) {
  try {
    spinner.start(chalk.cyan(step))
    await executeStep(step)
    spinner.succeed(chalk.green(step))
  } catch (error) {
    spinner.fail(chalk.red(`${step} 失败: ${(error as Error).message}`))
    throw error  // 或继续执行下一步
  }
}
```

**spinner 风格：** 统一使用默认的 `'dots'`（`cli-spinners` 标准点状 spinner）

## 五、表格效果 - cli-table3

**选择：** `cli-table3@~0.6.x`（最成熟，Unicode 支持，颜色兼容）

**使用规范（注意输出流选择）：**

> 表格内容如果是**信息展示**（配置、选项列表等 UI 元素），应输出到 stderr；如果是**可被 pipe 的结果数据**，应输出到 stdout。

```ts
import Table from 'cli-table3'

// 标准表格 - 无边框（推荐用于信息展示 → stderr）
const table = new Table({
  style: { head: [], border: [] },
  chars: {
    'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
    'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
    'left': '', 'right': '', 'mid': '', 'mid-mid': '',
  },
})

table.push(
  [chalk.cyan('名称'), chalk.gray('值')],
  ['Root', options.root],
  ['Config', options.config ?? chalk.gray('No file')],
)
console.error(table.toString())   // 信息展示 → stderr

// 带边框表格 - 用于数据对比
const borderedTable = new Table({
  head: [chalk.bold('名称'), chalk.bold('值')],
  style: { head: { bg: ['black', 'gray'] } },
  colWidths: [20, 60],
})
```

**标准表格样式（3 种预定义）：**

| 类型 | 用途 | 样式 |
| ------ | ------ | ------ |
| `simple` | 配置/选项展示 | 无边框，2 列 |
| `bordered` | 数据列表 | 单线边框，Unicode |
| `compact` | 紧凑数据 | 仅有横线分割，无竖线 |

**compact 表格示例：**

```ts
const compactTable = new Table({
  chars: {
    'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
    'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
    'left': '', 'right': '',
    'mid': chalk.gray('─'), 'mid-mid': chalk.gray('─'),
  },
  style: { 'padding-left': 0, 'padding-right': 1 },
})

compactTable.push(
  ['Package', '@hz-9/docs-build'],
  ['Version', '0.10.0'],
  ['License', 'MIT'],
)
console.error(compactTable.toString()) // 信息展示 → stderr
```

## 六、Downloading 效果 - cli-progress

**选择：** `cli-progress@~3.x`（最完善的进度条，支持 ETA、速度、多轨道）

**使用规范：**

```ts
import cliProgress from 'cli-progress'

// 下载进度条
const bar = new cliProgress.SingleBar({
  format: `${chalk.cyan('{bar}')} ${chalk.white('{percentage}%')} | ${chalk.gray('{speed}/s')} | ETA: {eta_formatted}`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})

bar.start(totalBytes, 0, { speed: '0 B' })

// 在数据流回调中更新
stream.on('data', (chunk) => {
  downloaded += chunk.length
  bar.update(downloaded, { speed: formatSpeed(downloaded / elapsed) })
})

stream.on('end', () => bar.stop())

// 多文件并行进度
const multiBar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: `${chalk.cyan('{filename}')} | {bar} | {percentage}%`,
})
```

**CI 环境处理：**

```ts
const isProgressAllowed = process.stderr.isTTY && !process.env.CI

if (!isProgressAllowed) {
  // 降级为简单日志
  console.error(`[进度] 下载中 ${url}`)
} else {
  bar.start(totalBytes, 0, { speed: '0 B' })
}
```

**辅助函数：**

```ts
// formatSpeed 实现参考
const formatSpeed = (bytesPerSec: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIdx = 0
  let speed = bytesPerSec
  while (speed >= 1024 && unitIdx < units.length - 1) {
    speed /= 1024
    unitIdx++
  }
  return `${speed.toFixed(1)} ${units[unitIdx]}/s`
}
```

**进度条模板标准：**

``` sh
// 单文件下载
[████████░░░░] 67% | 2.4 MB/s | ETA: 3s

// 多文件并行
file-a.tar.gz    | [████████░░░░] 67% | 2.4 MB/s
file-b.tar.gz    | [████░░░░░░░░] 33% | 1.1 MB/s

// 构建步骤（不带速度）
构建中           | [████████████] 100%
```

## 七、辅助工具集（规范建议实现的工具函数）

每个 CLI 项目应维护以下工具集（可参考当前 `util/index.ts` 重构）：

```ts
// --- 7.1 标题输出 ---
// 使用 console.error 以便 pipe 时不被干扰（clig.dev 推荐）
const printHeader = (pkg: { name: string; version: string }): void => {
  console.error()
  console.error(`${chalk.bold.cyan(pkg.name)} ${chalk.gray(`v${pkg.version}`)}`)
  console.error()
}

// --- 7.2 选项/配置展示 ---
const printOptions = (pkg: { name: string; version: string }, opts: Record<string, unknown>): void => {
  printHeader(pkg)
  console.error(`${chalk.bold('Options:')}`)
  console.error(alignKeys(opts))
  console.error()
}

// --- 7.3 命令执行输出 ---
const printCommand = (command: string): void => {
  console.error()
  console.error(`${chalk.gray('$')} ${chalk.cyan(command)}`)
  console.error()
}

// --- 7.4 状态提示 ---
// 注意：info/success/warn 输出到 stderr（日志流），符合 clig.dev 规范
const printInfo = (msg: string): void =>
  console.error(`${chalk.bold.blue('ℹ')} ${msg}`)

const printSuccess = (msg: string): void =>
  console.error(`${chalk.bold.green('✔')} ${msg}`)

const printWarn = (msg: string): void =>
  console.error(`${chalk.bold.yellow('⚠')} ${msg}`)

const printError = (msg: string): void =>
  console.error(`${chalk.bold.red('✖')} ${chalk.red(msg)}`)

// --- 7.5 快速退出（合并错误输出 + 退出） ---
const printErrorAndExit = (msg: string, code = 1): never => {
  printError(msg)
  process.exit(code)
}

// --- 7.6 分隔线 ---
const printSeparator = (): void => {
  const width = Math.min(process.stderr.columns ?? 80, 80)
  console.error(chalk.gray('─'.repeat(width)))
}
```

```ts
// --- 7.7 列表输出 ---
const printList = (items: string[], options?: { bullet?: string }): void => {
  const bullet = options?.bullet ?? '•'
  items.forEach((item) => {
    console.error(`${chalk.cyan(bullet)} ${item}`)
  })
}

// --- 7.8 分组标题 ---
const printSection = (title: string): void => {
  console.error()
  console.error(chalk.bold(title))
  printSeparator()
  console.error()
}
```

```ts
// --- 7.9 步骤编号输出 ---
let _stepCounter = 0

const printStep = (msg: string, total?: number): void => {
  _stepCounter++
  const prefix = total ? `[${_stepCounter}/${total}]` : `[${_stepCounter}]`
  console.error(`${chalk.cyan(prefix)} ${msg}`)
}

const printStepReset = (): void => {
  _stepCounter = 0
}

// --- 7.10 Deprecation 警告（统一格式，更完整版本见第十二节）---
// 简单友好封装，无去重；调用 canonical 定义前可先参考本节签名
const simplePrintDeprecated = (what: string, alternative?: string): void => {
  const alt = alternative ? `. Use ${chalk.cyan(alternative)} instead` : ''
  printWarn(`${chalk.dim('Deprecated:')} ${what}${alt}`)
}

// --- 7.11 URL 格式化输出 ---
const printUrl = (url: string): void => {
  console.error(`${chalk.hex('#FF8800')(url)}`)
}

// --- 7.12 截断值输出（应用 3.4 节截断策略）---
const printTruncated = (label: string, value: string, maxLen = 60): void => {
  const display = value.length > maxLen ? truncateMiddle(shortenPath(value), maxLen) : shortenPath(value)
  console.error(`  ${chalk.cyan(label)} : ${chalk.white(display)}`)
}
```

**调整后的完整工具集导出：**

> `printJson` 和 `printJsonError` 定义见[第十一节](#十一json-输出规范)。`setLogLevel` 和 `logDebug` 定义见[第九节](#九日志级别控制)。`truncateMiddle` 和 `shortenPath` 定义见[第三节 3.4](#34-超长值截断与换行策略)，`printTruncated` 定义见[第七节 7.12](#七辅助工具集规范建议实现的工具函数)。

```ts
// util/index.ts
export {
  indent,
  alignKeys,
  truncateMiddle,
  shortenPath,
  getTerminalWidth,
  printHeader,
  printOptions,
  printCommand,
  printInfo,
  printSuccess,
  printWarn,
  printError,
  printErrorAndExit,
  printSeparator,
  printList,
  printSection,
  printStep,
  printStepReset,
  simplePrintDeprecated,
  printDeprecated,  // canonical 定义见第十二节
  printUrl,
  printTruncated,
  setLogLevel,
  logDebug,
  printJson,
  printJsonError,
}
```

## 八、输出流规范

遵循 clig.dev 的 TTY 感知策略：

输出流规范与[日志级别控制](#九日志级别控制)协同工作：输出流决定**数据去哪**，日志级别决定**数据显示与否**。

| 输出类型 | 目标流 | 条件 |
| --------- | -------- | ------ |
| 正常结果（可被 pipe） | stdout | 全部场景 |
| 日志/状态/进度 | stderr | 非 TTY 时静默 |
| 错误消息 | stderr | 全部场景 |
| JSON 输出（`--json`） | stdout | 全部场景 |
| 交互式进度条/ spinner | stderr | 仅在 TTY |

**实现示例：**

```ts
// pipe 检测（判断 stdout/stderr 是否被重定向）
const isStdoutPiped = !process.stdout.isTTY
const isStderrPiped = !process.stderr.isTTY

// spinner/progress 使用 stderr.isTTY 判断（它们输出到 stderr）
const isInteractive = process.stderr.isTTY && !process.env.CI

// 非 TTY 或 CI 环境时，spinner 降级为普通日志
if (isInteractive) {
  spinner.start()
} else {
  console.error(`[INFO] Starting: ${text}`)
}
```

**输出格式的 TTY 自适应：**

```ts
// 在 TTY 下缩短路径显示宽度
const formatPathForDisplay = (filePath: string): string => {
  const maxLen = process.stdout.isTTY ? process.stdout.columns - 20 : 120
  return filePath.length > maxLen ? truncateMiddle(shortenPath(filePath), maxLen) : shortenPath(filePath)
}

// 非 TTY 环境下追加结构化前缀便于 grep
const logStructured = (level: string, msg: string): void => {
  if (isStderrPiped || process.env.CI) {
    console.error(`[${level.toUpperCase()}] ${msg}`)
  } else {
    console.error(msg)  // TTY 下正常显示
  }
}
```

## 九、日志级别控制

所有 `@hz-9` CLI 项目应实现统一的日志级别控制，支持 `--verbose` / `-v` 和 `--quiet` / `-q` 全局标志。

**日志级别（从低到高）：**

| 级别 | 方法 | 输出流 | 默认显示 | 说明 |
|------|------|--------|---------|------|
| `debug` | `logDebug()` | stderr | ❌ 需 `-v` | 调试信息，仅开发排查 |
| `info` | `printInfo()` | stderr | ✅ | 常规进度信息 |
| `warn` | `printWarn()` | stderr | ✅ | 警告，不中断流程 |
| `error` | `printError()` | stderr | ✅ | 错误信息 |

**`--dry-run` 时的日志行为：**
- 正常输出所有 info/debug/warn 级别日志
- 所有 `[DRY-RUN]` 前缀标记的操作步骤应显示清楚
- 最终输出 `⚠ Dry-run completed. No changes were made.`

**`--verbose` / `-v` 行为：**
- 通过 `commander` 的计数模式实现：`.option('-v, --verbose', 'increase output verbosity', 0)`
- 每增加一个 `-v` 提升一级详细度：

| 级别 | 标志 | 效果 |
|------|------|------|
| `0` | 默认 | info + warn + error |
| `1` | `-v` | 添加 debug 级别输出，显示 `[debug]` 前缀 |
| `2` | `-vv` | 额外显示内部参数解析、配置文件搜索路径等技术细节 |
| `3+` | `-vvv` | 额外显示 HTTP 请求/响应、堆栈追踪等极详细调试 |

**`--quiet` / `-q` 行为：**
- 仅显示 error 级别及以上
- spinner / progress 降级为静默

> **注意：** `--verbose` 与 `--quiet` 互斥，同时指定时以 `--quiet` 优先。`--plain` 标志等价于设置 `NO_COLOR`，禁用颜色输出。

**实现示例：**

```ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

let currentLevel: LogLevel = 'info'

const LEVEL_MAP: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const shouldLog = (level: LogLevel): boolean =>
  LEVEL_MAP[level] >= LEVEL_MAP[currentLevel]

export const setLogLevel = (level: LogLevel): void => {
  currentLevel = level
}

export const logDebug = (msg: string): void => {
  if (shouldLog('debug')) console.error(chalk.dim(`[debug] ${msg}`))
}

// printInfo / printWarn / printError 沿用第七节定义
```

> **注意：** commander 的 `--version` 使用短标志 `-V`，因此 `--verbose` 使用 `-v` 不会冲突。如需同时支持 `-v` 作为 `--verbose` 和 `-V` 作为 `--version`，保持默认即可。

**与 commander 集成（计数模式）：**

```ts
program
  .option('-v, --verbose', 'increase output verbosity', 0)
  .option('-q, --quiet', 'suppress non-error output', false)

const opts = program.opts()
if (opts.quiet) {
  setLogLevel('error')
} else if (opts.verbose === 1) {
  setLogLevel('debug')
} else if (opts.verbose >= 2) {
  setLogLevel('debug')
  // -vv 时开启内部参数解析、配置文件搜索路径等技术细节
}

// --json 与 --verbose 协同：JSON 模式下忽略 --verbose
if (opts.json) {
  outputMode = 'json'
  setLogLevel('error')  // 抑制 UI，保留错误输出
}
```

**JSON 模式下的退出码行为：**

参见[第十一节 - JSON 模式下的退出码行为](#十一json-输出规范)。

## 十、错误处理规范

**退出码（Exit Code）标准：**

| 场景 | 退出码 | 说明 |
|------|--------|------|
| 执行成功 | `0` | 正常完成 |
| 通用错误 | `1` | 运行时错误、未捕获异常 |
| 配置错误 | `2` | 配置文件缺失或格式错误 |
| 参数错误 | `3` | CLI 参数校验失败 |
| 系统错误 | `4` | 文件权限、网络、依赖缺失 |
| 用户终止 | `130` | SIGINT (Ctrl+C) |

**错误消息格式化规范：**
- 错误消息统一使用 `printError()` 输出到 stderr
- 用户可见的错误：简洁、不展示 stack trace
- `--verbose` 时：追加 stack trace 到 stderr

```ts
// 标准错误处理模式
try {
  await main()
} catch (error) {
  if (currentLevel === 'debug') {
    printError((error as Error).message)
    console.error(chalk.dim((error as Error).stack))
  } else {
    printError((error as Error).message)
  }
  // 优先使用 process.exitCode 设置退出码（更优雅）
  process.exitCode = 1
  // 若需立即终止，使用 process.exit(1)
}

// 错误上下文与 Cause 链显示（Error Cause 提案）
// 适用于 --verbose 模式下显示完整错误链路
const printErrorChain = (error: unknown): void => {
  let err: Error | undefined = error as Error
  const chain: string[] = []
  while (err) {
    chain.push(err.message)
    err = (err as Error & { cause?: Error }).cause
  }
  // 从根因到表层输出
  for (let i = chain.length - 1; i >= 0; i--) {
    const prefix = i === 0 ? '✖' : '⬆'
    const indent = '  '.repeat(chain.length - 1 - i)
    console.error(chalk.dim(`${indent}${prefix} ${chain[i]}`))
  }
}

// 配置校验错误上下文
const printConfigError = (field: string, expected: string, actual: unknown): void => {
  printError(`Invalid config field: ${chalk.cyan(field)}`)
  console.error(`  Expected: ${chalk.white(expected)}`)
  console.error(`  Actual:   ${chalk.yellow(String(actual))}`)
}

// SIGINT 优雅退出
process.on('SIGINT', () => {
  // 清除 spinner/progress 等正在运行的 UI
  console.error(chalk.gray('\nAborted by user'))
  process.exit(130)
})
```

**错误退出码映射表：**

项目中应维护一个错误码映射，将已知业务错误映射到规范退出码：

```ts
const enum ExitCode {
  Success = 0,
  GeneralError = 1,
  ConfigError = 2,
  ArgumentError = 3,
  SystemError = 4,
  SigInt = 130,
}

// 错误码分发函数
const getExitCode = (error: unknown): number => {
  if (error instanceof SyntaxError) return ExitCode.ConfigError
  if (error instanceof TypeError) return ExitCode.ArgumentError
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') return ExitCode.SystemError
  if ((error as NodeJS.ErrnoException).code === 'EACCES') return ExitCode.SystemError
  return ExitCode.GeneralError
}

process.exitCode = getExitCode(error)
```

## 十一、JSON 输出规范

支持 `--json` 标志的 CLI 命令应输出标准化的 JSON 结构，便于程序化消费。

**标准 JSON 输出结构：**

```ts
interface JsonOutput<T = unknown> {
  /** 执行状态 */
  success: boolean
  /** 数据负载 */
  data: T
  /** 错误信息（仅失败时） */
  error?: {
    code: number
    message: string
  }
  /** 元信息 */
  meta?: {
    duration: number  // 执行耗时 (ms)
    timestamp: string // ISO 8601 时间戳
  }
}
```

**实现模式：**

```ts
const printJson = <T>(data: T, meta?: { duration: number }): void => {
  const output: JsonOutput<T> = {
    success: true,
    data,
    meta: meta
      ? { ...meta, timestamp: new Date().toISOString() }
      : undefined,
  }
  console.log(JSON.stringify(output, null, 2))
}

const printJsonError = (code: number, message: string, meta?: { duration: number }): void => {
  const output: JsonOutput<null> = {
    success: false,
    data: null,
    error: { code, message },
    meta: meta
      ? { ...meta, timestamp: new Date().toISOString() }
      : undefined,
  }
  console.log(JSON.stringify(output, null, 2))
}
```

**JSON 模式下的 UI 抑制：**

当 `--json` 激活时，所有非 JSON 的 UI 输出（printHeader、printInfo、spinner、progress 等）应完全静默，仅输出 JSON 到 stdout。

```ts
if (opts.json) {
  setLogLevel('error')  // 仅允许错误输出
  // 或：全局标记跳过所有 UI 调用
}
```

**`--plain` 模式：**

等价于设置 `NO_COLOR=1`，chalk 自动禁用所有颜色。无需额外处理。

**集成到 commander：**

```ts
program.option('-j, --json', 'output as JSON', false)

if (opts.json) {
  // 使用 printJson 替代 console.log
}
```

**JSON 模式下的退出码行为：**

| 输出 | success | exit code | 说明 |
|------|---------|-----------|------|
| 成功 | `true` | `0` | 正常返回 |
| 业务失败 | `false` + `error` | `0` | pipe 端通过 `success` 判断，不中断管道 |
| 系统崩溃 | 无 JSON 输出 | `1` | 崩溃前无 JSON 生成 |

> `--json` 模式下，业务逻辑错误**不应**导致非零退出码，而是通过 `success: false` 表达。仅当 JSON 本身无法生成时才使用非零退出码。

**`--json` + `--dry-run` 协同：**

当同时指定 `--json` 和 `--dry-run` 时，输出的 JSON 结构应包含 `data.dryRun` 字段描述将要执行的操作：

```ts
const output: JsonOutput<{ dryRun: boolean; plannedActions: string[] }> = {
  success: true,
  data: {
    dryRun: true,
    plannedActions: ['Pull node:20-slim', 'Build image: my-app:1.0.0', 'Publish to registry'],
  },
  meta: { duration: 0, timestamp: new Date().toISOString() },
}
```

## 十二、Deprecation 警告格式

CLI 选项、命令或功能废弃时应使用统一的 Deprecation 警告格式，确保用户可感知变更并采取行动。

**规范要求：**

- Deprecation 警告通过 `printWarn()` 输出（不高于 warn 级别，不影响正常流程）
- 必须指明替代选项/命令（如有）
- 建议添加移除版本号和时间线
- 同一项目的同一个 deprecation 在每个 CLI 调用周期内最多显示一次

```ts
// Deprecation 警告打印（带去重）
const _deprecationShown = new Set<string>()

const printDeprecated = (what: string, options?: {
  alternative?: string
  removedIn?: string
  since?: string
}): void => {
  if (_deprecationShown.has(what)) return
  _deprecationShown.add(what)

  const parts: string[] = [`${chalk.dim('Deprecated:')} ${what}`]
  if (options?.alternative) {
    parts.push(`Use ${chalk.cyan(options.alternative)} instead`)
  }
  const meta: string[] = []
  if (options?.since) meta.push(`since ${options.since}`)
  if (options?.removedIn) meta.push(`will be removed in ${options.removedIn}`)
  if (meta.length) parts.push(chalk.dim(`(${meta.join(', ')})`))

  printWarn(parts.join(' '))
}
```

**输出示例：**

```
⚠ Deprecated: --input-path flag. Use --input instead (since v0.5.0, will be removed in v1.0.0)
⚠ Deprecated: build command. Use compile instead
```

## 十三、敏感信息脱敏规范

CLI 在处理和显示可能包含敏感信息的路径、URL、环境变量时，应主动脱敏，防止信息泄露。

**脱敏规则：**

- **用户目录：** 始终使用 `shortenPath()` 将 `$HOME` 缩略为 `~`
- **认证令牌：** URL 中的 token/password 应替换为 `***`
- **环境变量值：** `--verbose` 下显示环境变量时屏蔽 `TOKEN`、`KEY`、`SECRET`、`PASSWORD` 结尾的变量值
- **文件路径中的用户名：** 非必要不显示完整用户名

```ts
// URL 脱敏：移除认证信息
const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.username) {
      const hasPassword = !!parsed.password
      parsed.username = ''
      parsed.password = ''
      const sanitized = parsed.toString()
      if (hasPassword) {
        return sanitized.replace('://', '://***:***@')
      }
      return sanitized.replace('://', '://***@')
    }
    return url
  } catch {
    return url  // 非 URL 字符串原样返回
  }
}

// 环境变量脱敏（用于调试输出）
const SANITIZE_KEYS = ['TOKEN', 'KEY', 'SECRET', 'PASSWORD', 'PASS']

const sanitizeEnv = (env: Record<string, string | undefined>): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(env)) {
    const needsMask = SANITIZE_KEYS.some(k => key.toUpperCase().includes(k))
    result[key] = value && needsMask ? `${value.slice(0, 3)}***${value.slice(-3)}` : (value ?? '')
  }
  return result
}
```

## 十四、交互式提示/确认规范

当 CLI 需要用户交互确认（如覆盖文件、危险操作）时，应遵循以下规范：

**原则：**

- 提供 `--yes` / `-y` 标志跳过确认，直接执行（适用于 CI 自动化场景）
- 交互模式仅在 TTY 下激活
- 非 TTY 环境（pipe 或 CI）自动默认确认或拒绝，取决于操作风险等级
- 高危操作（删除、覆盖、发布）即使在 TTY 下也需要确认

```ts
import readline from 'node:readline'

// 全局 --yes 标志，由 commander 的 --yes/-y 选项设置
let globalYesFlag = false

// 简单的确认提示
const confirmOrExit = async (message: string, opts?: { defaultYes?: boolean; isHighRisk?: boolean }): Promise<boolean> => {
  // 非交互环境（pipe 或 CI）自动决策
  if (process.env.CI || !process.stderr.isTTY) {
    // 高危操作在非交互环境下默认拒绝
    if (opts?.isHighRisk) return false
    return opts?.defaultYes ?? true
  }

  // --yes 标志跳过
  if (globalYesFlag) return true

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  })

  const suffix = opts?.defaultYes ? ' [Y/n]: ' : ' [y/N]: '
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${chalk.bold.yellow('?')} ${message}${suffix}`, resolve)
  })
  rl.close()

  const normalized = answer.trim().toLowerCase()
  if (normalized === 'y' || normalized === 'yes') return true
  if (normalized === 'n' || normalized === 'no') return false
  return opts?.defaultYes ?? false
}

// 使用示例
const confirmed = await confirmOrExit(
  `Overwrite ${chalk.cyan('dist/')}?`,
  { defaultYes: false, isHighRisk: true }
)
if (!confirmed) {
  printWarn('Operation cancelled by user')
  process.exit(0)
}
```

**交互提示输出样式：**

```
? Overwrite dist/? [y/N]: y
✔ 文件覆盖完成

? Publish to npm registry? [y/N]: n
⚠ Operation cancelled by user
```

## 十五、完整示例

将现有 `@hz-9` CLI 项目（如 `docs-build`、`docker-build`）应用新规范后的效果。以下示例展示终端用户视角（stderr + stdout 合并显示）：

### 正常模式（默认）

``` sh
// 标题
@hz-9/docker-build v0.3.9

// 配置
Options:
  root        : /Users/xxx/project
  config      : /Users/xxx/.docker-build.json
  platform    : linux/amd64
  name        : my-app
  version     : 1.0.0
  input path  : ./dist
  base image  : node:20-slim
  publish     : true
  assets      : ./public
              : ./config

// 执行命令
$ docker pull node:20-slim

// 下载进度（spinner + progress）
ℹ 正在下载 node:20-slim...
[████████░░] 67% | 2.4 MB/s | ETA: 3s
✔ 基础镜像下载完成

// 构建
$ docker build -f ./Dockerfile -t my-app:1.0.0 .

✔ Docker 镜像构建成功
```

**`--quiet` 模式输出示例（仅显示错误和 JSON）：**

``` sh
// 无标题、无配置展示、无进度信息
// 只有错误时才有输出（stderr）
Error: 配置文件不存在
```

**`--json` 模式输出示例：**

``` json
{
  "success": true,
  "data": {
    "outputPath": "/Users/xxx/project/docs/.vuepress",
    "configPath": "/Users/xxx/project/docs/.vuepress/config.ts",
    "stats": {
      "totalScanned": 156,
      "totalCopied": 89,
      "totalDirectMapped": 72
    }
  },
  "meta": {
    "duration": 1234,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

**`--verbose` 模式日志输出示例：**

``` sh
[debug] Resolved config: /Users/xxx/docs-build.config.json
[debug] Language list: [en-US, zh-CN, ja-JP]
[debug] Scanning 3 baseSourceDir entries...
ℹ Scanning source files...
[debug] glob patterns: **/* (ignore: node_modules, .vuepress)
✔ Scanned 156 source files
```

## 十六、推荐的 npm 包清单

| 用途 | 包名 | 版本 | 理由 | 参考章节 |
| ------ | ------ | ------ | ------ | ------ |
| 命令解析 | `commander` | ~12.x | **已有**，成熟稳定 | [第一节](#一命令解析---commander) |
| 着色 | `chalk` | ~5.x | 最流行，API 最优雅 | [第二节](#二着色方案---chalk) |
| Loading | `ora` | ~8.x | 功能最强，支持 Promise 包装 | [第四节](#四loading-效果---ora) |
| 进度条 | `cli-progress` | ~3.x | 最完善的进度条库 | [第六节](#六downloading-效果---cli-progress) |
| 表格 | `cli-table3` | ~0.6.x | 最成熟，Unicode + 颜色兼容 | [第五节](#五表格效果---cli-table3) |
| 符号图标 | `log-symbols` | ~7.x | ✓ ✖ ⚠ ℹ 统一符号 | [第二节](#二着色方案---chalk) |
| 边框盒子 | `boxen` | ~8.x | 标题 Banner 和分组框 | — |

> **boxen 使用场景：** 用于 CLI 启动时的标题 Banner、命令分组框、帮助信息等装饰性输出。仅在有标题/分组需求的 CLI 中引入。

每个 CLI 项目只需按需引入对应的包，遵循上述颜色方案和间距规则。

## 十七、迁移路径

### 优先级：先基础工具，再增强组件

1. **升级依赖**：`ora@~8.x`，新增 `chalk@~5.x`（注意 ESM 兼容性）
   - ✅ 验证：`npm ls ora chalk` 显示正确版本
2. **替换 ColorUtil**：用 `chalk` API 替换所有 ANSI 转义码调用
   - ✅ 验证：全局搜索 `\x1B\[`，确认无遗留
3. **新增辅助函数**：在 `util/` 中实现第[七节](#七辅助工具集规范建议实现的工具函数)的全部函数
   - ✅ 验证：`util/index.ts` 导出所有函数
4. **接入日志级别**：在 `commander` 中添加 `--verbose` / `--quiet` 选项
   - ✅ 验证：`-v` 输出 debug 日志，`-q` 静默
5. **规范 CLI 入口**：按新标准格式化 `bin/*.ts` 中的所有输出
   - ✅ 验证：运行 CLI 查看输出是否符合第[十五节](#十五完整示例)的格式
6. **错误处理标准化**：统一使用定义好的退出码和 `printError` 格式
   - ✅ 验证：异常场景下 exit code 符合第[十节](#十错误处理规范)规范
7. **按需引入增强组件**：`cli-table3`、`cli-progress`、`boxen`、`log-symbols`
   - ✅ 验证：按实际场景引入，避免过度依赖
8. **`commander`** 保持现有模式不变
   - ✅ 验证：检查 `bin/*.ts` 中 `Commander` 类的使用模式

## 十八、合规检查清单

以下清单用于快速验证 CLI 项目是否符合本规范：

| # | 检查项 | 验证方式 |
|---|--------|----------|
| 1 | `commander@~12.x` | `npm ls commander` |
| 2 | `chalk@~5.x` | `npm ls chalk` |
| 3 | 所有状态输出（标题/日志/进度）使用 stderr | grep `console.log` 确认仅 JSON 输出使用 |
| 4 | 色彩遵循预设色板 | 检查 chalk 调用是否符合第二节表格 |
| 5 | 间距使用 2 空格缩进 + 冒号对齐 | 目视检查 CLI 输出 |
| 6 | 存在 `indent` / `alignKeys` / `truncateMiddle` 工具函数 | 检查 `util/` 目录 |
| 7 | spinner 风格统一为 `'dots'` | 检查 ora 调用 |
| 8 | 支持 `--verbose` / `--quiet` | 运行 CLI 验证 |
| 9 | 日志级别控制集成 | 检查 `setLogLevel` 实现 |
| 10 | 错误退出码符合规范 | 测试异常场景 |
| 11 | `--json` 输出符合 `JsonOutput` 结构 | 运行 `--json` 验证 |
| 12 | CI 环境下 spinner/progress 降级 | 设置 `CI=true` 验证 |
| 13 | SIGINT 优雅退出（exit 130） | 按 Ctrl+C 验证 |
| 14 | `NO_COLOR` 环境变量支持 | 设置 `NO_COLOR=1` 验证 |
| 15 | `--help` / `--version` 使用 chalk 着色 | 运行 `--help` 目视检查 |
| 16 | 存在 `printStep` / `printDeprecated` 工具函数 | 检查 `util/` 目录 |
| 17 | Deprecation 警告格式符合规范 | grep `deprecated` 检查格式 |
| 18 | 敏感信息脱敏（URL token、路径 HOME） | grep `sanitizeUrl` / `shortenPath` |
| 19 | 支持 `--yes` / `-y` 标志 | 运行 CLI 高危操作验证 |
| 20 | pipe 检测（`isStdoutPiped` / `isStderrPiped`） | 检查 TTY 感知逻辑 |
