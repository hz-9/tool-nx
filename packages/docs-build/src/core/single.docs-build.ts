import * as fs from 'fs-extra'
import * as path from 'upath'
import { glob } from 'glob'
import _ from 'lodash'

/**
 * @public
 */
export class SingleDocsBuild {
  /**
   * 渲染 VuePress 模板文件到输出目录
   */
  public async renderVuepressTemplates(vuepressDirPath: string, renderData: Record<string, unknown>): Promise<void> {
    const vuepressTemplate = path.resolve(__dirname, '../../.template/vuepress')

    const globResult = await glob('**/*', { dot: true, nodir: true, cwd: vuepressTemplate })

    let i = 0
    while (i < globResult.length) {
      const filepath = globResult[i]

      const p1 = path.resolve(vuepressTemplate, filepath)
      const p2 = path.resolve(vuepressDirPath, filepath)

      if (/js$|ts$|json$|yaml$|md$/.test(filepath)) {
        const text = await fs.readFile(p1, { encoding: 'utf8' })
        const textRender = _.template(text, { interpolate: /{{([\s\S]+?)}}/g })(renderData)

        await fs.mkdirp(path.dirname(p2))
        await fs.writeFile(p2, textRender, { encoding: 'utf8' })
      } else {
        await fs.copy(p1, p2)
      }

      i += 1
    }
  }
}
