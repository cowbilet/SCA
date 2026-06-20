import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin as nitro } from '@tanstack/nitro-v2-vite-plugin'

const config = defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [
        // this is the plugin that enables path aliases
        devtools(),
        tanstackStart(),
        tailwindcss(),
        // We can comment this out to get rid of the TypeError: Cannot read properties of undefined (reading 'method')

        nitro(),
        viteReact(),
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
    ],
    server: {
        host: true,
        watch: {
            usePolling: true,
        },
    },
})

export default config
