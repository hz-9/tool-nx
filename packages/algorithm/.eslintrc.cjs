module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.cts', '*.mts'],
      excludedFiles: ['vite.config.mts'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        'max-classes-per-file': 'off',
      },
    },
    {
      files: ['vite.config.mts'],
      parserOptions: {
        project: './tsconfig.config.json',
        tsconfigRootDir: __dirname,
      },
    },
  ],
}
