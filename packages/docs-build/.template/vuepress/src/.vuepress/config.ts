import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

import theme from './theme.js'

export default defineUserConfig({
  base: {{ JSON.stringify(site.base) }},

  title: {{ JSON.stringify(site.title) }},

  description: {{ JSON.stringify(site.description) }},

  locales: {{ JSON.stringify(site.locales, undefined, 2) }},

  theme,

  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ['import'],
          },
        },
      },
    },
  }),

  // Enable it with pwa
  shouldPrefetch: false,
})
