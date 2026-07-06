# CLI 输出格式标准化方案

本文档基于 [clig.dev](https://clig.dev/)（Command Line Interface Guidelines）和 Node.js 社区最佳实践，为所有 `@hz-9` CLI 项目制定统一的输出标准。

## 一、命令解析 - commander

**现状：** 项目已在使用 `commander`，这是一流的决策。

**规范：**

- `commander@~12.x` 作为统一 CLI 框架
- 保持现有的 `Commander` 类模式（如 `libraries/docker-build/src/core/commander.ts`）
- 所有 CLI 命令统一采用 `camelCase` 选项命名（commander 自动支持 `--camel-case` 转 `camelCase`）
- 支持 `--json` 和 `--plain` 标志（clig.dev 推荐）

## 二、着色方案 - chalk

**选择：** `chalk@~5.x`（最成熟，生态最广）

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

**输出格式模板：**

``` ts
// 标题区 - 程序名 + 版本
console.log(`${chalk.bold.cyan(pkg.name)} ${chalk.gray(pkg.version)}`)

// 信息标签
console.log(`${chalk.bold('Options:')}`)
console.log(`  ${chalk.cyan('root')}        : ${chalk.white(options.root)}`)

// 成功消息
console.log(`${chalk.bold.green('✔')} Build completed successfully`)

// 错误消息（stderr）
console.error(`${chalk.bold.red('✖')} ${chalk.red(error.message)}`)

// 执行命令
console.log(`${chalk.gray('$')} ${chalk.cyan(command)}`)
```

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

### 3.2 具体间距标准

``` ts
// 函数签名间距
console.log()                          // 函数前后保持空行

// 标题与内容的间距
console.log(`${chalk.bold('Options:')}`)
console.log(`  ${key} : ${value}`)     // 缩进 2 空格
console.log()                          // 内容结束后空行

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

// 键对齐工具
const alignKeys = (map: Record<string, string>): string => {
  const maxLen = Math.max(...Object.keys(map).map(k => k.length))
  return Object.entries(map)
    .map(([k, v]) => indent(`${k.padEnd(maxLen)} : ${v}`))
    .join('\n')
}
```

## 四、Loading 效果 - ora

**选择：** `ora@~8.x`（最流行的 spinner 库，支持 Promise 包装，TypeScript）

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

// 多步骤串联
const steps = ['拉取代码', '安装依赖', '构建', '发布']
const spinner = ora()
for (const step of steps) {
  spinner.start(chalk.cyan(step))
  await executeStep(step)
  spinner.succeed(chalk.green(step))
}
```

**spinner 风格：** 统一使用默认的 `'dots'`（`cli-spinners` 标准点状 spinner）

## 五、表格效果 - cli-table3

**选择：** `cli-table3@~0.6.x`（最成熟，Unicode 支持，颜色兼容）

**使用规范：**

```ts
import Table from 'cli-table3'

// 标准表格 - 无边框（推荐用于信息展示）
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
console.log(table.toString())

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
const printHeader = (pkg: { name: string; version: string }): void => {
  console.log()
  console.log(`${chalk.bold.cyan(pkg.name)} ${chalk.gray(`v${pkg.version}`)}`)
  console.log()
}

// --- 7.2 选项/配置展示 ---
const printOptions = (opts: Record<string, unknown>): void => {
  printHeader(pkg)
  console.log(`${chalk.bold('Options:')}`)
  console.log(alignKeys(opts))
  console.log()
}

// --- 7.3 命令执行输出 ---
const printCommand = (command: string): void => {
  console.log()
  console.log(`${chalk.gray('$')} ${chalk.cyan(command)}`)
  console.log()
}

// --- 7.4 状态提示 ---
const printInfo = (msg: string): void =>
  console.log(`${chalk.bold.blue('ℹ')} ${msg}`)

const printSuccess = (msg: string): void =>
  console.log(`${chalk.bold.green('✔')} ${msg}`)

const printWarn = (msg: string): void =>
  console.log(`${chalk.bold.yellow('⚠')} ${msg}`)

const printError = (msg: string): void =>
  console.error(`${chalk.bold.red('✖')} ${chalk.red(msg)}`)

// --- 7.5 分隔线 ---
const printSeparator = (): void =>
  console.log(chalk.gray('─'.repeat(process.stdout.columns ?? 80)))
```

## 八、输出流规范

遵循 clig.dev 的 TTY 感知策略：

| 输出类型 | 目标流 | 条件 |
| --------- | -------- | ------ |
| 正常结果（可被 pipe） | stdout | 全部场景 |
| 日志/状态/进度 | stderr | 非 TTY 时静默 |
| 错误消息 | stderr | 全部场景 |
| JSON 输出（`--json`） | stdout | 全部场景 |
| 交互式进度条/ spinner | stderr | 仅在 TTY |

**实现示例：**

```ts
const isTTY = process.stdout.isTTY

// 非 TTY 时，spinner 降级为普通日志
if (isTTY) {
  spinner.start()
} else {
  console.log(`[INFO] Starting: ${text}`)
}
```

## 九、完整示例

将现有 `docker-build` 的 `util/index.ts` 应用新规范后的效果：

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

## 十、推荐的 npm 包清单

| 用途 | 包名 | 版本 | 理由 |
| ------ | ------ | ------ | ------ |
| 命令解析 | `commander` | ~12.x | **已有**，成熟稳定 |
| 着色 | `chalk` | ~5.x | 最流行，API 最优雅 |
| Loading | `ora` | ~8.x | 功能最强，支持 Promise 包装 |
| 进度条 | `cli-progress` | ~3.x | 最完善的进度条库 |
| 表格 | `cli-table3` | ~0.6.x | 最成熟，Unicode + 颜色兼容 |
| 符号图标 | `log-symbols` | ~7.x | ✓ ✖ ⚠ ℹ 统一符号 |
| 边框盒子 | `boxen` | ~8.x | 标题 Banner 和分组框 |

每个 CLI 项目只需按需引入对应的包，遵循上述颜色方案和间距规则。

## 十一、迁移路径

1. 在新项目中直接遵循本规范
2. 现有 `docker-build`、`pkg-build` 的 `util/index.ts` 逐步按规范重构
3. 将重复的 `printOptions`、`printCommand` 按新标准统一重写
4. `commander` 保持现有模式不变
