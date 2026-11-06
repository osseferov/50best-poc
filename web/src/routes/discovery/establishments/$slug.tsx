import { createFileRoute } from '@tanstack/react-router'
import { getVenuePage } from '../../../api/pages'
import Venue from '../../../pages/Venue'

export const Route = createFileRoute('/discovery/establishments/$slug')({ loader: ({ params }) => getVenuePage(params.slug), component: Venue })
