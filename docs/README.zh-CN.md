# HZ 9 工具

一些 'Node.js' 工具库。

## 简介

`@hz-9/tool` 是一个 monorepo，提供多个 Node.js 工具库和实用程序，使用 [Nx](https://nx.dev/) 和 [pnpm](https://pnpm.io/) 管理。

## 包列表

| 包名 | 描述 |
|---------|-------------|
| [@hz-9/algorithm](./guide/algorithm/) | 一个 JavaScript 算法基础类库 |
| [@hz-9/docs-build](./guide/docs-build/) | 用于从 Markdown 文件生成 vuepress-theme-hope 文档网站的工具 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 测试所有包
pnpm test

# 代码检查
pnpm lint
```
