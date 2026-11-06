import { createFileRoute } from '@tanstack/react-router'
import { getStoryPage } from '../../api/pages'
import Story from '../../pages/Story'

export const Route = createFileRoute('/stories/$slug')({ loader: ({ params }) => getStoryPage(params.slug), component: Story })
