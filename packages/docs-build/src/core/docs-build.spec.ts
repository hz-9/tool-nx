import type { DocsBuildOptions, NavbarOptions, SidebarOptions } from '../interface/index'
import { DocsBuild } from './docs-build'

const createBuild = (overrides?: Partial<DocsBuildOptions>): DocsBuild => {
  const options: DocsBuildOptions = {
    baseSourceDir: 'docs',
    site: { lang: 'en-US', base: '/' },
    navigation: {
      navbar: [],
      sidebar: {},
    },
    ...overrides,
  }

  return new DocsBuild(options)
}

describe('DocsBuild', () => {
  describe('transformNavbarOptions', () => {
    it('should resolve simple text links for main language', () => {
      const navbar: NavbarOptions = [
        { text: 'Home', link: 'README.md' },
        { text: 'Guide', link: 'guide/README.md' },
      ]

      const build = createBuild()
      const result = build.transformNavbarOptions(navbar, 'en-US')

      expect(result).toEqual(navbar)
    })

    it('should resolve multi-language text for non-main language', () => {
      const navbar: NavbarOptions = [{ text: { 'en-US': 'Overview', 'zh-CN': '概述' }, link: 'overview/README.md' }]

      const build = createBuild()
      const result = build.transformNavbarOptions(navbar, 'zh-CN')

      expect(result).toEqual([{ text: '概述', link: 'overview/README.md' }])
    })

    it('should fallback to first value when language is missing', () => {
      const navbar: NavbarOptions = [{ text: { 'en-US': 'Overview', 'zh-CN': '概述' }, link: 'overview/README.md' }]

      const build = createBuild()
      const result = build.transformNavbarOptions(navbar, 'ja-JP')

      // Falls back to first value 'Overview'
      expect(result).toEqual([{ text: 'Overview', link: 'overview/README.md' }])
    })

    it('should handle nested children with multi-language text', () => {
      const navbar: NavbarOptions = [
        {
          text: { 'en-US': 'Guide', 'zh-CN': '指南' },
          children: [{ text: { 'en-US': 'Algorithm', 'zh-CN': '算法' }, link: 'guide/algorithm/README.md' }],
        },
      ]

      const build = createBuild()
      const result = build.transformNavbarOptions(navbar, 'zh-CN')

      expect(result).toEqual([
        {
          text: '指南',
          children: [{ text: '算法', link: 'guide/algorithm/README.md' }],
        },
      ])
    })

    it('should handle string-only navbar items', () => {
      const navbar: NavbarOptions = ['README.md', 'guide/README.md']

      const build = createBuild()
      const result = build.transformNavbarOptions(navbar, 'zh-CN')

      expect(result).toEqual(navbar)
    })
  })

  describe('transformSidebarOptions', () => {
    it('should return false sidebar as-is', () => {
      const build = createBuild()
      expect(build.transformSidebarOptions(false, 'en-US')).toBe(false)
    })

    it('should return string sidebar as-is', () => {
      const build = createBuild()
      expect(build.transformSidebarOptions('structure', 'en-US')).toBe('structure')
    })

    it('should resolve sidebar array items', () => {
      const sidebar: SidebarOptions = [{ text: { 'en-US': 'Overview', 'zh-CN': '概述' }, link: 'overview/README.md' }]

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN')

      expect(result).toEqual([{ text: '概述', link: 'overview/README.md' }])
    })

    it('should resolve sidebar object keys with multi-language text', () => {
      const sidebar: SidebarOptions = {
        '/guide/': [{ text: { 'en-US': 'Getting Started', 'zh-CN': '快速开始' }, link: 'guide/README.md' }],
      }

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN') as Record<string, unknown[]>

      expect(result['/guide/']).toEqual([{ text: '快速开始', link: 'guide/README.md' }])
    })

    it('should handle sidebar heading/structure values in object', () => {
      const sidebar: SidebarOptions = {
        '/guide/': 'structure',
        '/api/': 'heading',
      }

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN')

      expect(result).toEqual(sidebar)
    })

    it('should handle sidebar groups with nested children', () => {
      const sidebar: SidebarOptions = [
        {
          text: { 'en-US': 'Guide', 'zh-CN': '指南' },
          link: 'guide/README.md',
          children: [{ text: { 'en-US': 'Getting Started', 'zh-CN': '快速开始' }, link: 'guide/start.md' }],
        },
      ]

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN')

      expect(result).toEqual([
        {
          text: '指南',
          link: 'guide/README.md',
          children: [{ text: '快速开始', link: 'guide/start.md' }],
        },
      ])
    })

    it('should handle structure children type', () => {
      const sidebar: SidebarOptions = [
        {
          text: { 'en-US': 'Guide', 'zh-CN': '指南' },
          children: 'structure' as const,
        },
      ]

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN')

      expect(result).toEqual([
        {
          text: '指南',
          children: 'structure',
        },
      ])
    })

    it('should handle string items in array', () => {
      const sidebar: SidebarOptions = ['README.md', 'guide/README.md']

      const build = createBuild()
      const result = build.transformSidebarOptions(sidebar, 'zh-CN')

      expect(result).toEqual(sidebar)
    })
  })
})
