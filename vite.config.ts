import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// In production (GitHub Pages) the app is served from /source-of-wealth-file/.
// In dev it stays at root so `npm run dev` works unchanged.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/source-of-wealth-file/' : '/',
}))
