import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Rutas relativas: el build funciona igual en la raíz de un dominio que en una subcarpeta.
  base: './',
  plugins: [vue()],
  resolve: {
    // `@/` para importar de otro dominio; dentro del mismo, rutas relativas.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
})
