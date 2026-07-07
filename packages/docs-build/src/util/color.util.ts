/**
 * @public
 */
export class ColorUtil {
  /**
   * Whether color output is allowed.
   * Checks the NO_COLOR environment variable.
   *
   * 是否允许彩色输出。
   * 检查 NO_COLOR 环境变量。
   */
  public static get isColorAllowed(): boolean {
    return !('NO_COLOR' in process.env && (!!process.env.NO_COLOR || process.env.NO_COLOR === ''))
  }

  /**
   * Apply bold formatting to text.
   *
   * 对文本应用粗体格式。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static bold(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[1m${text}\x1B[0m` : text
  }

  /**
   * Apply red color to text.
   *
   * 对文本应用红色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static red(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[31m${text}\x1B[39m` : text
  }

  /**
   * Apply green color to text.
   *
   * 对文本应用绿色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static green(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[32m${text}\x1B[39m` : text
  }

  /**
   * Apply yellow color to text.
   *
   * 对文本应用黄色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static yellow(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[33m${text}\x1B[39m` : text
  }

  /**
   * Apply blue color to text.
   *
   * 对文本应用蓝色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static blue(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[34m${text}\x1B[39m` : text
  }

  /**
   * Apply magenta color to text.
   *
   * 对文本应用品红色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static magenta(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[35m${text}\x1B[39m` : text
  }

  /**
   * Apply cyan color to text.
   *
   * 对文本应用青色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static cyan(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[36m${text}\x1B[39m` : text
  }

  /**
   * Apply bright red color to text.
   *
   * 对文本应用亮红色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static redBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[91m${text}\x1B[39m` : text
  }

  /**
   * Apply bright green color to text.
   *
   * 对文本应用亮绿色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static greenBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[92m${text}\x1B[39m` : text
  }

  /**
   * Apply bright yellow color to text.
   *
   * 对文本应用亮黄色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static yellowBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[93m${text}\x1B[39m` : text
  }

  /**
   * Apply bright blue color to text.
   *
   * 对文本应用亮蓝色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static blueBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[94m${text}\x1B[39m` : text
  }

  /**
   * Apply bright magenta color to text.
   *
   * 对文本应用亮品红色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static magentaBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[95m${text}\x1B[39m` : text
  }

  /**
   * Apply bright cyan color to text.
   *
   * 对文本应用亮青色。
   *
   * @param text - The text to format.
   * @returns The formatted text.
   */
  public static cyanBright(text: string): string {
    return ColorUtil.isColorAllowed ? `\x1B[96m${text}\x1B[39m` : text
  }

  /**
   * Remove ANSI color codes
   *
   * @param text - text to clear
   * @returns cleaned text
   */
  public static clear(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
  }
}
