import { createFileRoute, notFound } from '@tanstack/react-router'
import type { RankingSection } from '../../../../types'
import { getRankingPage } from '../../../../api/pages'
import RankingList, { RANGES } from '../../../../pages/RankingList'

export const Route = createFileRoute('/$section/$slug/list/$range')({
  loader: ({ params }) => {
    if (!(params.range in RANGES)) throw notFound()
    return getRankingPage(params.section as RankingSection, params.slug)
  },
  component: RankingList,
})
