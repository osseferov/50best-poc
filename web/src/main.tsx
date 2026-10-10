import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router'
import { SignInProvider } from './components/SignIn'
import { getDiscoveryPage, getHomePage, getStoriesPage, getStoryCategoryPage, getStoryPage, getVenuePage } from './api/pages'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import Stories from './pages/Stories'
import Venue from './pages/Venue'
import Story from './pages/Story'
import StoryCategory from './pages/StoryCategory'
import './styles/the50.css'

function Root() {
  return (
    <SignInProvider>
      <Outlet />
      <ScrollRestoration />
    </SignInProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    hydrateFallbackElement: <></>,
    children: [
      { path: '/', element: <Home />, loader: getHomePage },
      { path: '/discovery', element: <Discovery />, loader: getDiscoveryPage },
      { path: '/discovery/establishments/:slug', element: <Venue />, loader: getVenuePage },
      { path: '/stories', element: <Stories />, loader: getStoriesPage },
      { path: '/stories/:slug', element: <Story />, loader: getStoryPage },
      { path: '/stories/categories/:category', element: <StoryCategory />, loader: getStoryCategoryPage },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
