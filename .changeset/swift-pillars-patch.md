---
'@hz-9/algorithm': patch
---

build: update vite config for Nx compatibility and fix site URLs

- Refactor vite.config.mts to use `__dirname`-based paths for Nx monorepo
- Update api-report target to include api-documenter markdown step
- Fix homepage and documentation URLs from `tool` to `tool-nx`
- Remove empty `.sidebar.json` guide file
