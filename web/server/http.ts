/** Tiny helpers for the `api/*` functions: validated input in, JSON out, no internals leaked. */

export class BadRequest extends Error {}
export class NotFound extends Error {}

const SLUG = /^[A-Za-z0-9_-]{1,200}$/
const LABEL = /^[\p{L}\p{N} _-]{1,100}$/u

/** Slug or numeric id. */
export function slugParam(url: URL, name: string): string {
  const v = url.searchParams.get(name) ?? ''
  if (!SLUG.test(v)) throw new BadRequest(`bad ${name}`)
  return v
}

/** Human label such as a category slug or name ("News"). */
export function labelParam(url: URL, name: string): string {
  const v = url.searchParams.get(name) ?? ''
  if (!LABEL.test(v)) throw new BadRequest(`bad ${name}`)
  return v
}

export function intParam(url: URL, name: string, max: number): number {
  const v = url.searchParams.get(name)
  if (v === null) return 0
  if (!/^\d{1,9}$/.test(v) || Number(v) > max) throw new BadRequest(`bad ${name}`)
  return Number(v)
}

export function enumParam<T extends string>(url: URL, name: string, allowed: readonly T[]): T {
  const v = url.searchParams.get(name) as T
  if (!allowed.includes(v)) throw new BadRequest(`bad ${name}`)
  return v
}

/** Runs a read-only handler: unknown query params are rejected, errors map to 400/404/500 with generic bodies. */
export async function handle(request: Request, allowedParams: string[], fn: (url: URL) => Promise<unknown>): Promise<Response> {
  try {
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } })
    const url = new URL(request.url)
    for (const k of url.searchParams.keys()) if (!allowedParams.includes(k)) throw new BadRequest(`unexpected ${k}`)
    const data = await fn(url)
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (e) {
    if (e instanceof BadRequest) return new Response('Bad request', { status: 400 })
    if (e instanceof NotFound) return new Response('Not found', { status: 404 })
    console.error(e)
    return new Response('Upstream error', { status: 502 })
  }
}
