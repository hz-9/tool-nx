import type { JSONSchemaForNPMPackageJsonFiles } from '@package-json/types'
import { readFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')) as JSONSchemaForNPMPackageJsonFiles

const nodeBuiltins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)])

export default defineConfig({
  root: __dirname,
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'bin/docs-build': resolve(__dirname, 'src/bin/docs-build.ts'),
      },
      formats: ['cjs'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: resolve(__dirname, 'lib'),
    rollupOptions: {
      external(id) {
        if (nodeBuiltins.has(id)) return true
        if (id === 'fsevents') return true

        const allDeps = { ...pkg.dependencies, ...pkg.peerDependencies }

        if (allDeps) {
          const depNames = Object.keys(allDeps)

          if (depNames.some((dep) => id === dep || id.startsWith(`${dep}/`))) return true
        }

        return false
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'src'),
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
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
