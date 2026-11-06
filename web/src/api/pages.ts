/**
 * The only place pages get content from. Route loaders call the loaders below.
 * Live content comes from TanStack Start server functions (`createServerFn`): their handlers run only on the server,
 * hold the Directus token (server/directus.ts) and are compiled out of the browser bundle — the browser sends nothing
 * but the validated parameters and never talks to Directus. When Directus isn't configured (no DIRECTUS_URL /
 * DIRECTUS_TOKEN) the server functions return null and everything falls back to the bundled mock data.
 */
import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import type { Article, DiscoveryBlock, DiscoveryPage, HomePage, RankingNavItem, RankingPage, RankingSection, StoriesPage, StoryCategoryPage, StoryPage, VenuePage } from '../types'
import { home } from '../data/home'
import { discovery } from '../data/discovery'
import { stories } from '../data/stories'
import { venues } from '../data/venue'
import { stories as storyPages } from '../data/story'
import { FILMS, PARTNERS } from '../data/ranking'
import * as content from '../../server/content'
import { directusUrl } from '../../server/directus'
import * as v from '../../server/validate'

export const SECTION_LABEL: Record<RankingSection, string> = { restaurants: 'Restaurants', bars: 'Bars', hotels: 'Hotels', vineyards: 'Vineyards' }
export const SECTIONS = ['restaurants', 'bars', 'hotels', 'vineyards'] as const satisfies readonly RankingSection[]

// ── server functions (live Directus data; null = not configured / not found) ──

const fetchDiscovery = createServerFn({ method: 'GET' }).handler(async () =>
  content.isLive() ? { ...(await content.getDiscoveryLanding()), directusUrl: directusUrl() } : null)

const fetchVenue = createServerFn({ method: 'GET' })
  .validator((d: { slug: string }) => ({ slug: v.slug(d.slug) }))
  .handler(async ({ data }) => (content.isLive() ? content.getVenue(data.slug) : null))

const fetchLatestStories = createServerFn({ method: 'GET' }).handler(async () => (content.isLive() ? content.getLatestStories() : null))

const fetchStory = createServerFn({ method: 'GET' })
  .validator((d: { slug: string }) => ({ slug: v.slug(d.slug) }))
  .handler(async ({ data }) => (content.isLive() ? content.getStory(data.slug) : null))

const fetchCategoryStories = createServerFn({ method: 'GET' })
  .validator((d: { category: string; offset: number }) => ({ category: v.label(d.category), offset: v.offset(d.offset) }))
  .handler(async ({ data }) => (content.isLive() ? content.getCategoryStories(data.category, data.offset) : null))

const fetchRankingNav = createServerFn({ method: 'GET' }).handler(async () => (content.isLive() ? content.getRankingNav() : null))

const fetchRanking = createServerFn({ method: 'GET' })
  .validator((d: { section: RankingSection; slug: string }) => ({ section: v.oneOf(d.section, SECTIONS), slug: v.slug(d.slug) }))
  .handler(async ({ data }) => (content.isLive() ? content.getRanking(data.section, data.slug) : null))

/** Live attempt that never breaks a page: a Directus outage is logged and the caller falls back to mock data. */
async function tryLive<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch (e) {
    console.error(e)
    return null
  }
}

// ── route loaders ──────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage> {
  return home
}

/** `directusUrl` is the public Directus origin (runtime config, not a build var) so the Visual Editor can attach. */
export async function getDiscoveryPage(): Promise<DiscoveryPage> {
  const landing = await tryLive(() => fetchDiscovery())
  if (!landing) return discovery
  return {
    ...discovery,
    hero: {
      title: landing.hero_title || discovery.hero.title,
      subtitle: landing.hero_subtitle || discovery.hero.subtitle,
      image: landing.hero_image || discovery.hero.image,
    },
    landingId: landing.id,
    directusUrl: landing.directusUrl,
    meta: { title: landing.meta_title ?? undefined, description: landing.meta_description ?? undefined },
    blocks: [...(landing.blocks as DiscoveryBlock[]), ...discovery.blocks],
  }
}

/** `slug` may also be a numeric id, while establishment slugs are still empty in Directus. */
export async function getVenuePage(slug: string): Promise<VenuePage> {
  const page = (await tryLive(() => fetchVenue({ data: { slug } }))) ?? venues[slug.toLowerCase()]
  if (!page) throw notFound()
  return page
}

export async function getStoriesPage(): Promise<StoriesPage> {
  const latest = await tryLive(() => fetchLatestStories())
  return latest ? { ...stories, latest } : stories
}

/** `slug` may also be a numeric id. Live first, then the mock (Peru ingredients). */
export async function getStoryPage(slug: string): Promise<StoryPage> {
  const live = await tryLive(() => fetchStory({ data: { slug } }))
  const page = live ? { ...live, taxonomy: stories.taxonomy } : storyPages[slug] // ponytail: archive/categories/authors are still mock
  if (!page) throw notFound()
  return page
}

const CATEGORY_PAGE_SIZE = 20 // as on the live site

/** Paged like the live site: `?offset=` in steps of 20. Live stories in the category, newest first; mock otherwise. */
export async function getStoryCategoryPage(category: string, offset: number): Promise<StoryCategoryPage> {
  const live = await tryLive(() => fetchCategoryStories({ data: { category, offset } }))
  let items: Article[], total: number
  if (live) ({ items, total } = live)
  else {
    // ponytail: mock has no categories — every category lists all mock stories
    const all = [...new Map([stories.lead, ...stories.stories, ...stories.discovery, ...stories.guides, stories.best.feature, ...stories.best.items].map((a) => [a.id, a])).values()]
    ;[items, total] = [all.slice(offset, offset + CATEGORY_PAGE_SIZE), all.length]
  }
  return {
    category,
    items,
    page: Math.floor(offset / CATEGORY_PAGE_SIZE) + 1,
    pages: Math.max(1, Math.ceil(total / CATEGORY_PAGE_SIZE)),
    pageSize: CATEGORY_PAGE_SIZE,
    taxonomy: stories.taxonomy,
  }
}

/** Root loader: the rankings shown in the Restaurants / Bars / Hotels / Vineyards dropdowns. */
export async function getRankingNav(): Promise<RankingNavItem[]> {
  return (await tryLive(() => fetchRankingNav())) ?? []
}

/** Landing page and 1-50 / 51-100 list pages share this loader. */
export async function getRankingPage(section: RankingSection, slug: string): Promise<RankingPage> {
  if (!(SECTIONS as readonly string[]).includes(section)) throw notFound()
  const r = await tryLive(() => fetchRanking({ data: { section, slug } }))
  if (!r) throw notFound()
  return { ...r, films: FILMS, partners: PARTNERS }
}
