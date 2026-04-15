import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/good-nasa-apod/',
    publicDir: 'public',
    plugins: [react(), viteTsconfigPaths(), viteStaticCopy({
        targets: [
            {
                src: '404.html',
                dest: './'
            }
        ]
    })],
    build: {
        outDir: './build',
    },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        reporters: ['verbose'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['scr/**/*'],
            exclude: [],
        }
    }
})