/**
 * Asset proxy: accepts exactly `GET /api/assets/<uuid>` and nothing else. No query string, no other path, no
 * client-chosen headers. The server adds the token and a fixed image transform, so the browser can't pick the
 * Directus endpoint, parameters or credentials.
 */
import { createFileRoute } from '@tanstack/react-router'
import { directusToken, directusUrl } from '../../server/directus'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TRANSFORM = 'format=auto&quality=80&width=1600&fit=inside&withoutEnlargement=true' // fixed, never from the request

export const Route = createFileRoute('/api/assets/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (!UUID.test(params.id) || new URL(request.url).search) return new Response('Not found', { status: 404 }) // path only
        const base = directusUrl()
        const token = directusToken()
        if (!base || !token) return new Response('Not configured', { status: 500 })

        const accept = request.headers.get('accept')
        let upstream: Response
        try {
          upstream = await fetch(`${base}/assets/${params.id.toLowerCase()}?${TRANSFORM}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: accept?.includes('image/') ? accept : 'image/*' },
          })
        } catch {
          return new Response('Upstream error', { status: 502 })
        }
        if (!upstream.ok) return new Response('Not found', { status: upstream.status === 404 || upstream.status === 403 ? 404 : 502 })

        const headers = new Headers({ 'Cache-Control': 'public, max-age=3600, s-maxage=86400', Vary: 'Accept', 'X-Content-Type-Options': 'nosniff' })
        const type = upstream.headers.get('content-type')
        if (type) headers.set('Content-Type', type)
        return new Response(upstream.body, { headers })
      },
    },
  },
})
