import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev mirror of Vercel's `api/` folder: runs `GET` handlers from web/api in Node. Secrets (DIRECTUS_TOKEN, no VITE_
 * prefix) are loaded into process.env here only, so they are never inlined into the client bundle.
 */
function apiFunctions(mode: string): Plugin {
  return {
    name: 'api-functions',
    configureServer(server) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const m = /^\/api\/([a-z-]+)(?:\/[^/]+)?$/.exec(pathname)
        if (!m) return next()
        const file = resolve('api', pathname.startsWith('/api/assets/') ? 'assets/[id].ts' : `${m[1]}.ts`)
        if (!existsSync(file)) return next()
        try {
          const mod = await server.ssrLoadModule(file)
          const response: Response = await mod.GET(new Request(`http://localhost${req.url}`, { method: req.method, headers: { accept: String(req.headers.accept ?? '') } }))
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          if (response.body) Readable.fromWeb(response.body as never).pipe(res)
          else res.end()
        } catch (e) {
          server.config.logger.error(String(e))
          res.statusCode = 500
          res.end('Internal error')
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => ({ plugins: [react(), apiFunctions(mode)] }))
