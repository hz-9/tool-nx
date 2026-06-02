module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.cts', '*.mts'],
      excludedFiles: ['vite.config.mts'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
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
  rules: {
    'no-console': 'off',
  },
}
