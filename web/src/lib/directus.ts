import { createDirectus, rest, staticToken } from '@directus/sdk'

// Static SPA: no server env, so these are VITE_ vars and the token ships in the bundle.
// ponytail: use a read-only public-role token here; move to a server proxy if it ever needs write access.
const client = createDirectus(import.meta.env.VITE_DIRECTUS_URL as string)
  .with(staticToken(import.meta.env.VITE_DIRECTUS_TOKEN as string))
  .with(rest())

export default client
