import { Command } from 'commander'

import { readPkg } from '../util'

/**
 * @public
 *
 * Command Line Argument Parsing Class
 */
export class Commander {
  public static parse(): Record<string, unknown> {
    const pkg = readPkg()

    const program = new Command()

    program.name(pkg.name as string).version(pkg.version as string)
    if (pkg.description) program.description(pkg.description as string)

    program
      .option('-c, --config <char>', "the path to 'docs-build.config.json'.", './docs-build.config.json')
      .option('-o, --output <char>', 'the output path of the generated config.')

    program.parse(process.argv)
    return program.opts() as Record<string, unknown>
  }
}
