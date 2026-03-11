// eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'
import pluginRouter from '@tanstack/eslint-plugin-router'


// https://eslint.org/docs/latest/use/configure/flat-config
export default [
  // base shared config
  ...tanstackConfig,

  // tanstack router rules (flat)
  ...pluginRouter.configs['flat/recommended'],
]
