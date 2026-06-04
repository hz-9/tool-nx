# @hz-9/docs-build

A tool for generating [vuepress-theme-hope](https://theme-hope.vuejs.press/) documentation site from markdown files.

![NPM Version][npm-version-url] ![NPM License][npm-license-url] ![NPM Downloads][npm-downloads-url] ![Types][types-url]
<br /> ![Node Version][node-version-url] ![Last Commit][last-commit-url]

[npm-version-url]: https://badgen.net/npm/v/@hz-9/docs-build
[npm-license-url]: https://badgen.net/npm/license/@hz-9/docs-build
[npm-downloads-url]: https://badgen.net/npm/dt/@hz-9/docs-build
[types-url]: https://badgen.net/npm/types/@hz-9/docs-build
[node-version-url]: https://badgen.net/npm/node/@hz-9/docs-build
[last-commit-url]: https://badgen.net/github/last-commit/hz-9/tool

[Document](https://hz-9.github.io/tool-nx/guide/docs-build/) | [文档](https://hz-9.github.io/tool-nx/zh-CN/guide/docs-build/)

## Introduction

`@hz-9/docs-build` scans markdown files based on a configuration file (`docs-build.config.json`) and generates a complete [vuepress-theme-hope](https://theme-hope.vuejs.press/) documentation site. It handles:

- **File copying** — automatically organizes markdown files into multi-language directory structure
- **Navigation bar & sidebar generation** — generates VuePress-compatible navbar/sidebar configuration
- **Template rendering** — produces ready-to-use VuePress config files (config.ts, navbar.ts, sidebar.ts, theme.ts)

## Installation

```bash
npm install --global @hz-9/docs-build
```

## Usage

### Configuration

Create a `docs-build.config.json` in your project root:

```json
{
  "baseSourceDir": "docs",
  "site": {
    "base": "/",
    "lang": "en-US",
    "title": "My Project",
    "description": "Project description"
  },
  "locales": {
    "languages": ["en-US", "zh-CN"]
  },
  "output": "docs/.vuepress",
  "navigation": {
    "navbar": [
      {
        "text": { "en-US": "Guide", "zh-CN": "指南" },
        "link": "guide/README.md",
        "icon": "book"
      }
    ],
    "sidebar": {
      "/guide/": [
        {
          "text": { "en-US": "Getting Started", "zh-CN": "快速开始" },
          "link": "guide/README.md"
        }
      ]
    }
  }
}
```

### Run

```bash
docs-build
```

### CLI Parameters

| Parameter | Description |
|---|---|
| `-c, --config <path>` | Path to `docs-build.config.json` (default: `./docs-build.config.json`) |
| `-o, --output <path>` | Override output path from config |

### Programmatic Usage

```typescript
import { Commander, CommanderOptions, DocsBuild, DocsOptions } from '@hz-9/docs-build'

// Load and validate config
const options = DocsOptions.load('./docs-build.config.json')

// Run build
const result = await DocsBuild.resolve(options)
console.log(`Config generated at: ${result.configPath}`)
```
