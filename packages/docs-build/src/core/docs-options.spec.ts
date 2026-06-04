import { DocsOptions } from './docs-options'

describe('DocsOptions', () => {
  describe('validateConfig', () => {
    it('should throw for non-object config', () => {
      expect(() => DocsOptions.validateConfig(null)).toThrow('Config must be a JSON object.')
      expect(() => DocsOptions.validateConfig(123)).toThrow('Config must be a JSON object.')
      expect(() => DocsOptions.validateConfig('string')).toThrow('Config must be a JSON object.')
    })

    it('should throw when baseSourceDir is missing', () => {
      expect(() =>
        DocsOptions.validateConfig({
          site: { lang: 'en-US', base: '/' },
          navigation: { navbar: [], sidebar: {} },
        })
      ).toThrow('Missing required field: "baseSourceDir"')
    })

    it('should throw when site is missing', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          navigation: { navbar: [], sidebar: {} },
        })
      ).toThrow('Missing required field: "site"')
    })

    it('should throw when site.base is missing', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          site: { lang: 'en-US' },
          navigation: { navbar: [], sidebar: {} },
        })
      ).toThrow('Missing required field: "site.base"')
    })

    it('should throw when navigation is missing', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          site: { lang: 'en-US', base: '/' },
        })
      ).toThrow('Missing required field: "navigation"')
    })

    it('should throw when navigation.navbar is not an array', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          site: { lang: 'en-US', base: '/' },
          navigation: { navbar: 'invalid', sidebar: {} },
        })
      ).toThrow('Missing required field: "navigation.navbar"')
    })

    it('should throw when navigation.sidebar is not an object', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          site: { lang: 'en-US', base: '/' },
          navigation: { navbar: [], sidebar: 'invalid' },
        })
      ).toThrow('Missing required field: "navigation.sidebar"')
    })

    it('should pass for a valid config', () => {
      expect(() =>
        DocsOptions.validateConfig({
          baseSourceDir: 'docs',
          site: { lang: 'en-US', base: '/' },
          navigation: { navbar: [], sidebar: {} },
        })
      ).not.toThrow()
    })
  })
})
