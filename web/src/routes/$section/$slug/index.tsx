import { createFileRoute } from '@tanstack/react-router'
import type { RankingSection } from '../../../types'
import { getRankingPage } from '../../../api/pages'
import Ranking from '../../../pages/Ranking'

// /restaurants|bars|hotels|vineyards/:slug — any other first segment 404s in the loader
export const Route = createFileRoute('/$section/$slug/')({
  loader: ({ params }) => getRankingPage(params.section as RankingSection, params.slug),
  component: Ranking,
})
