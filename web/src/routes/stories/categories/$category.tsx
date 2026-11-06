import { createFileRoute } from '@tanstack/react-router'
import { getStoryCategoryPage } from '../../../api/pages'
import StoryCategory from '../../../pages/StoryCategory'

/** `?offset=` in steps of 20, like the live site. */
export const Route = createFileRoute('/stories/categories/$category')({
  validateSearch: (s: Record<string, unknown>): { offset?: number } => {
    const n = Math.floor(Number(s.offset))
    return n > 0 ? { offset: Math.min(n, 100_000) } : {}
  },
  loaderDeps: ({ search }) => ({ offset: search.offset ?? 0 }),
  loader: ({ params, deps }) => getStoryCategoryPage(params.category, deps.offset),
  component: StoryCategory,
})
