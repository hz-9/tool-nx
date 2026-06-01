#!/usr/bin/env node
import { Commander, MultiDocsBuild, SingleDocsBuild } from '../index'

;(async () => {
  const options = await Commander.parse()

  if (Commander.inRush(options)) {
    await MultiDocsBuild.build(options)
  } else {
    await SingleDocsBuild.build(options)
  }
})()
