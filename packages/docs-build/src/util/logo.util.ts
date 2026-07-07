import * as fs from 'node:fs'
import * as path from 'node:path'
import console from 'node:console'

import { ColorUtil } from './color.util'

/**
 * @public
 *
 * Print Logo.
 *
 * Logo was made at http://patorjk.com/software/taag/#p=display&f=Big&t=docs-build
 */
export class LogoUtil {
  private static _content: string | undefined = undefined

  /**
   * Logo text content.
   *
   * Logo 文本内容。
   */
  public static get content(): string {
    if (!this._content) {
      this._content = fs.readFileSync(path.resolve(__dirname, '../../logo'), { encoding: 'utf8' })
    }

    return this._content
  }

  /**
   * Print the logo and version information.
   *
   * 打印 logo 和版本信息。
   *
   * @param onlyLogo - Only print the logo, without version info. Optional, defaults to false.
   */
  public static print(onlyLogo: boolean = false): void {
    const logoLines: string[] = this.content.split('\n')

    const packageInfo = fs.readFileSync(path.resolve(__dirname, '../../package.json'), { encoding: 'utf8' })
    const { version } = JSON.parse(packageInfo)

    if (!onlyLogo) {
      // Append version to the last non-empty line of the logo
      const reversed = [...logoLines].reverse()
      const lastNonEmptyIdx = logoLines.length - 1 - reversed.findIndex((line) => line.trim().length > 0)
      logoLines[lastNonEmptyIdx] = `${logoLines[lastNonEmptyIdx]} ${version}`
    }

    console.log('')
    console.log(ColorUtil.magenta(logoLines.join('\n')))
    console.log('')
  }
}
