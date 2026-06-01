import type { JSONSchemaForNPMPackageJsonFiles } from '@package-json/types'
import { readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as JSONSchemaForNPMPackageJsonFiles

const nodeBuiltins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)])

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'bin/docs-build': 'src/bin/docs-build.ts',
      },
      formats: ['cjs'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'lib',
    rollupOptions: {
      external(id) {
        if (nodeBuiltins.has(id)) return true
        if (id === 'fsevents') return true
        if (pkg.dependencies?.[id]) return true
        if (pkg.peerDependencies?.[id]) return true
        return false
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      exclude: ['**/*.spec.ts', '**/*.test.ts'],
    }),
  ],
  // https://vitest.dev/config/
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
})
