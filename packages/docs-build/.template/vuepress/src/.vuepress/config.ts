import { defineUserConfig } from 'vuepress'

import theme from './theme.js'

export default defineUserConfig({
  base: {{ JSON.stringify(baseUrl) }},

  title: {{ JSON.stringify(title) }},

  description: {{ JSON.stringify(description) }},

  locales: {{ JSON.stringify(locales, undefined, 2) }},

  theme,

  // Enable it with pwa
  shouldPrefetch: false,
})
