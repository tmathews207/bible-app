import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served by GitHub Pages as a project site at
  // https://<user>.github.io/bible-app/ -- every asset URL needs this prefix.
  base: '/bible-app/',
})
