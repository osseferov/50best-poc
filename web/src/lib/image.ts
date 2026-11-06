import type { Image } from '../types'

const FILE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Resolve an image field to a src.
 * Directus file ids go through our same-origin asset proxy (`/api/assets/<id>`, routes/api.assets.$id.ts), which adds
 * the credentials server-side and applies a fixed transform; anything else (absolute URL, mock path) is returned untouched.
 */
export function imageUrl(src: Image, _width?: number): string {
  return FILE_ID.test(src) ? `/api/assets/${src}` : src
}
