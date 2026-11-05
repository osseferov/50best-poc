/**
 * Asset proxy: accepts exactly `GET /api/assets/<uuid>` and nothing else. No query string, no other path, no
 * client-chosen headers. The server adds the token and a fixed image transform, so the browser can't pick the
 * Directus endpoint, parameters or credentials.
 */
import { directusToken, directusUrl } from '../../server/directus.js'

const ASSET_PATH = /^\/api\/assets\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
const TRANSFORM = 'format=auto&quality=80&width=1600&fit=inside&withoutEnlargement=true' // fixed, never from the request

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const id = ASSET_PATH.exec(url.pathname)?.[1]
  if (!id || url.search) return new Response('Not found', { status: 404 }) // path only: any query string is rejected
  const base = directusUrl()
  const token = directusToken()
  if (!base || !token) return new Response('Not configured', { status: 500 })

  let upstream: Response
  try {
    upstream = await fetch(`${base}/assets/${id.toLowerCase()}?${TRANSFORM}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: request.headers.get('accept')?.includes('image/') ? request.headers.get('accept')! : 'image/*' },
    })
  } catch {
    return new Response('Upstream error', { status: 502 })
  }
  if (!upstream.ok) return new Response('Not found', { status: upstream.status === 404 || upstream.status === 403 ? 404 : 502 })

  const headers = new Headers({ 'Cache-Control': 'public, max-age=3600, s-maxage=86400', Vary: 'Accept' })
  const type = upstream.headers.get('content-type')
  if (type) headers.set('Content-Type', type)
  headers.set('X-Content-Type-Options', 'nosniff')
  return new Response(upstream.body, { headers })
}
