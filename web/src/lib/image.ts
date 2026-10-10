import type { Image } from '../types'

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL as string | undefined
const TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined
const FILE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Resolve an image field to a src.
 * Directus file ids go through the /assets endpoint with on-the-fly transforms;
 * anything else (absolute URL, /assets/… mock path) is returned untouched.
 */
export function imageUrl(src: Image, width?: number): string {
  if (!DIRECTUS_URL || !FILE_ID.test(src)) return src
  const q = new URLSearchParams({ format: 'auto', quality: '80' })
  if (width) q.set('width', String(width))
  if (TOKEN) q.set('access_token', TOKEN) // files aren't public; <img> can't send a Bearer header
  return `${DIRECTUS_URL}/assets/${src}?${q}`
}

/**
 * Rich text (WYSIWYG) embeds full `${DIRECTUS_URL}/assets/<id>…` URLs. Files aren't public, so add the token —
 * same as imageUrl() does for image fields.
 */
export function richTextAssets(html: string): string {
  if (!DIRECTUS_URL || !TOKEN) return html
  const assets = `${DIRECTUS_URL.replace(/\/$/, '')}/assets/`
  return html.replace(/(src=["'])([^"']+)/g, (m, attr: string, src: string) => {
    const url = src.replace(/&amp;/g, '&')
    if (!url.startsWith(assets) || url.includes('access_token=')) return m
    return `${attr}${url}${url.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(TOKEN)}`
  })
}
