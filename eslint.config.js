//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import react from 'eslint-plugin-react'

export default [...tanstackConfig, {
    extends: ['plugin:tanstack/recommended', 'plugin:react/recommended'],
}]
