import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @metatoy/janes-jeans is a `file:` dep (npm symlinks it in, real path is the
// sibling ../sorb-demo-kit checkout) — Vite's dev server otherwise 403s
// requests for files outside the project root even when node_modules
// resolves the symlink fine, which silently breaks the kit's asset imgs.
const kitRoot = fileURLToPath(new URL('../sorb-demo-kit', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url)), kitRoot] },
  },
})
