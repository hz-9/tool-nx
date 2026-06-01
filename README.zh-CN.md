# HZ 9 Tool

一些 'Node.js' 工具库。

[文档](https://hz-9.github.io/tool)

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 测试所有包
pnpm test

# Lint 所有包
pnpm lint

# 生成 API 报告
pnpm api-report

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check

# 查看依赖关系图
pnpm nx graph

# 仅对变更的项目运行 lint
pnpm nx affected --target=lint

# 创建 changeset（版本/发布准备）
pnpm changeset

# 提升版本并生成更新日志
pnpm changeset version

# 发布包到 npm
pnpm publish
```

## 包列表

| 包名 | 描述 |
|---------|------|
| `@hz-9/algorithm` | JavaScript 算法基础类库 |
| `@hz-9/docs-build` | 从 TypeScript 项目生成 vuepress-theme-hope 文档的工具 |
