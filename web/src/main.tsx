import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration, type LoaderFunctionArgs } from 'react-router'
import { SignInProvider } from './components/SignIn'
import { getDiscoveryPage, getHomePage, getRankingNav, getRankingPage, getStoriesPage, getStoryCategoryPage, getStoryPage, getVenuePage } from './api/pages'
import type { RankingSection } from './types'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import Stories from './pages/Stories'
import Venue from './pages/Venue'
import Story from './pages/Story'
import StoryCategory from './pages/StoryCategory'
import Ranking from './pages/Ranking'
import RankingList, { RANGES } from './pages/RankingList'
import './styles/the50.css'

function Root() {
  return (
    <SignInProvider>
      <Outlet />
      <ScrollRestoration />
    </SignInProvider>
  )
}

const SECTIONS: RankingSection[] = ['restaurants', 'bars', 'hotels', 'vineyards']

const router = createBrowserRouter([
  {
    id: 'root',
    element: <Root />,
    loader: getRankingNav, // main-menu rankings; read by <Nav> via useRouteLoaderData('root')
    shouldRevalidate: () => false,
    hydrateFallbackElement: <></>,
    children: [
      { path: '/', element: <Home />, loader: getHomePage },
      { path: '/discovery', element: <Discovery />, loader: getDiscoveryPage },
      { path: '/discovery/establishments/:slug', element: <Venue />, loader: getVenuePage },
      { path: '/stories', element: <Stories />, loader: getStoriesPage },
      { path: '/stories/:slug', element: <Story />, loader: getStoryPage },
      { path: '/stories/categories/:category', element: <StoryCategory />, loader: getStoryCategoryPage },
      ...SECTIONS.flatMap((s) => [
        { path: `/${s}/:slug`, element: <Ranking />, loader: ({ params }: LoaderFunctionArgs) => getRankingPage(s, params.slug!) },
        {
          path: `/${s}/:slug/list/:range`,
          element: <RankingList />,
          loader: ({ params }: LoaderFunctionArgs) => {
            if (!(params.range! in RANGES)) throw new Response('Not found', { status: 404 })
            return getRankingPage(s, params.slug!)
          },
        },
      ]),
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
