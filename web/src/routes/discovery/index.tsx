import { createFileRoute } from '@tanstack/react-router'
import { getDiscoveryPage } from '../../api/pages'
import Discovery from '../../pages/Discovery'

export const Route = createFileRoute('/discovery/')({ loader: () => getDiscoveryPage(), component: Discovery })
