import * as fs from 'fs-extra'
import * as path from 'upath'

/**
 * @internal
 *
 * Reads package.json information.
 *
 * @param cwd - The path where package.json exists
 */
export const readPkg = (cwd?: string): Record<string, unknown> => {
  let searchDir = cwd ? path.resolve(cwd) : __dirname

  // 向上搜索 package.json
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const p = path.resolve(searchDir, 'package.json')
    if (fs.existsSync(p)) {
      const info = fs.readFileSync(p, { encoding: 'utf8' })
      return JSON.parse(info)
    }
    const parent = path.resolve(searchDir, '..')
    if (parent === searchDir) {
      throw new Error('package.json not found')
    }
    searchDir = parent
  }
}
