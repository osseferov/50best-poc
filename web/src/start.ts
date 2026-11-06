import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

// Only our own origin and the Directus app (Visual Editor iframe) may frame the site. Read per request, not at module scope.
const frameAncestors = createMiddleware().server(async ({ next }) => {
  let directus = ''
  try {
    directus = new URL(process.env.DIRECTUS_URL ?? '').origin
  } catch { /* not configured */ }
  setResponseHeader('Content-Security-Policy', `frame-ancestors 'self'${directus ? ` ${directus}` : ''}`)
  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' }), frameAncestors],
}))
