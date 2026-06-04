# 概述

`@hz-9/tool` monorepo 提供一系列 Node.js 工具库，使用 [Nx](https://nx.dev/) 和 [pnpm](https://pnpm.io/) 管理。

## 项目

### [@hz-9/algorithm](../guide/algorithm/)

一个 JavaScript 算法基础类库，提供常用算法和数据结构：
- **排序**：9 种排序算法（冒泡、插入、选择、归并、快速、堆、计数、基数、桶）
- **搜索**：二分搜索和线性搜索
- **数据结构**：链表、栈、队列、二叉树、堆、图、哈希表、集合

### [@hz-9/docs-build](../guide/docs-build/)

一个文档网站生成器，根据规则扫描项目的 markdown 文件并编译成 [vuepress-theme-hope](https://theme-hope.vuejs.press/) 网站。支持：
- 多语言文档
- 自动生成 VuePress 配置
- 自定义样式
- 自动 Git 仓库检测
