import { createFileRoute } from '@tanstack/react-router'
import { getHomePage } from '../api/pages'
import Home from '../pages/Home'

export const Route = createFileRoute('/')({ loader: () => getHomePage(), component: Home })
