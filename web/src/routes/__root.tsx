import type { ReactNode } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { SignInProvider } from '../components/SignIn'
import { getRankingNav } from '../api/pages'
import css from '../styles/the50.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' }],
    links: [{ rel: 'stylesheet', href: css }],
  }),
  loader: () => getRankingNav(), // main-menu rankings; read by <Nav> via useLoaderData({ from: '__root__' })
  staleTime: 5 * 60_000,
  component: () => (
    <RootDocument>
      <SignInProvider>
        <Outlet />
      </SignInProvider>
    </RootDocument>
  ),
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
