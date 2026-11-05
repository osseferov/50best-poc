/**
 * Server-only Directus client. `DIRECTUS_URL` / `DIRECTUS_TOKEN` have no `VITE_` prefix, so Vite never inlines them
 * into the browser bundle, and nothing under `src/` may import this file.
 */
import { createDirectus, rest, staticToken } from '@directus/sdk'

let cached: ReturnType<typeof create> | undefined

function create(url: string, token: string) {
  return createDirectus(url).with(staticToken(token)).with(rest())
}

export function directusUrl(): string {
  return (process.env.DIRECTUS_URL || process.env.VITE_DIRECTUS_URL || '').replace(/\/$/, '')
}

export function directusToken(): string {
  return process.env.DIRECTUS_TOKEN || ''
}

export function client() {
  const url = directusUrl()
  const token = directusToken()
  if (!url || !token) throw new Error('DIRECTUS_URL / DIRECTUS_TOKEN are not set')
  return (cached ??= create(url, token))
}
