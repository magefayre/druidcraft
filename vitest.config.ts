import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    coverage: { exclude: ['**/*.module.?(s)css'], provider: 'v8' },
    css: { modules: { classNameStrategy: 'non-scoped' } },
    environment: 'jsdom',
    globals: true,
    isolate: true,
    setupFiles: ['./vitest.setup.ts']
  }
})
