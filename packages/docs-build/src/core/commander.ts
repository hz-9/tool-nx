import { Command } from 'commander'

import { readPkg } from '../util'

/**
 * @public
 *
 * CLI options for \@hz-9/docs-build
 */
export interface CommanderOptions {
  /** Path to docs-build.config.json */
  config: string

  /** Output path override */
  output?: string
}

/**
 * @public
 *
 * Command Line Argument Parsing Class
 */
export class Commander {
  public static parse(): CommanderOptions {
    const pkg = readPkg()

    const program = new Command()

    program.name(pkg.name || 'unknown').version(pkg.version || '0.0.0')
    if (pkg.description) program.description(pkg.description)

    program
      .option('-c, --config <char>', "the path to 'docs-build.config.json'.", './docs-build.config.json')
      .option('-o, --output <char>', 'the output path of the generated config.')

    program.parse(process.argv)
    return program.opts() as CommanderOptions
  }
}
