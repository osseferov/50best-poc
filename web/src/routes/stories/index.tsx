import { createFileRoute } from '@tanstack/react-router'
import { getStoriesPage } from '../../api/pages'
import Stories from '../../pages/Stories'

export const Route = createFileRoute('/stories/')({ loader: () => getStoriesPage(), component: Stories })
