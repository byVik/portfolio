import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Relative paths: the build works the same at a domain root or in a subfolder.
  base: './',
  plugins: [vue()],
  resolve: {
    // `@/` to import from another domain; within the same one, relative paths.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
})
