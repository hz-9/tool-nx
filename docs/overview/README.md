# Overview

The `@hz-9/tool` monorepo provides a collection of Node.js tool libraries, managed with [Nx](https://nx.dev/) and [pnpm](https://pnpm.io/).

## Projects

### [@hz-9/algorithm](../guide/algorithm/)

A JavaScript algorithm base class library providing common algorithms and data structures:
- **Sort**: 9 sorting algorithms (bubble, insertion, selection, merge, quick, heap, counting, radix, bucket)
- **Search**: Binary search and linear search
- **Data Structures**: Linked list, stack, queue, binary tree, heap, graph, hash map, set

### [@hz-9/docs-build](../guide/docs-build/)

A documentation site generator that scans markdown files and compiles them into a [vuepress-theme-hope](https://theme-hope.vuejs.press/) website. Supports:
- Multi-language documentation
- Auto-generated VuePress configuration
- Custom styles
- Auto Git repository detection
