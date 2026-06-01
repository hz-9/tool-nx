import { defineUserConfig } from 'vuepress'

import theme from './theme.js'

export default defineUserConfig({
  base: "{{ options.baseUrl }}",

  title: '{{ packageInfo.name }}',

  locales: {{ JSON.stringify(locales, undefined, 2) }},

  theme,

  // Enable it with pwa
  shouldPrefetch: false,
})
