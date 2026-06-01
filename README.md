# HZ 9 Tool

Some 'Node.js' tool library.

[Document](https://hz-9.github.io/tool)

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Test all packages
pnpm test

# Lint all packages
pnpm lint

# Generate API reports
pnpm api-report

# Format code
pnpm format

# Check code formatting
pnpm format:check

# View dependency graph
pnpm nx graph

# Run lint only for changed projects
pnpm nx affected --target=lint

# Create a changeset (version/publish preparation)
pnpm changeset

# Bump versions and generate changelogs
pnpm changeset version

# Publish packages to npm
pnpm publish
```

## Packages

| Package | Description |
|---------|-------------|
| `@hz-9/algorithm` | A JavaScript algorithm base class library |
| `@hz-9/docs-build` | A tool for generate vuepress-theme-hope from typescript project |
