import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

// Secrets (DIRECTUS_TOKEN, GOOGLE_MAPS_KEY) have no VITE_ prefix: they are only read via process.env in server
// functions / server routes, so Vite never inlines them into the browser bundle.
export default defineConfig({
  server: { port: 3000 },
  plugins: [tanstackStart(), nitro(), viteReact()], // order matters: react after start
})
