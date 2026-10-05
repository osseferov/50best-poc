import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router'
import { SignInProvider } from './components/SignIn'
import { getDiscoveryPage, getHomePage, getStoriesPage } from './api/pages'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import Stories from './pages/Stories'
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
      { path: '/stories', element: <Stories />, loader: getStoriesPage },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
