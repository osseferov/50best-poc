/**
 * The only place pages get content from. Each route loader calls one of these.
 * Live content comes from our own `/api/*` functions (web/api, queries in web/server/content.ts), which hold the
 * Directus token — the browser never talks to Directus directly and never sees a credential. Without
 * `VITE_DIRECTUS_URL` (the "Directus is on" flag) everything falls back to the bundled mock data.
 */
import type { LoaderFunctionArgs } from 'react-router'
import type { Article, DiscoveryBlock, DiscoveryPage, HomePage, RankingNavItem, RankingPage, RankingSection, StoriesPage, StoryCategoryPage, StoryPage, VenuePage } from '../types'
import { home } from '../data/home'
import { discovery } from '../data/discovery'
import { stories } from '../data/stories'
import { venues } from '../data/venue'
import { stories as storyPages } from '../data/story'
import { FILMS, PARTNERS } from '../data/ranking'
import { getPlaceKeyInfo } from '../lib/places'
import type { Venue } from '../types'

const live = () => !!import.meta.env.VITE_DIRECTUS_URL

/** GET our own API. 404 → undefined (not found); any other failure throws so callers can fall back to mock. */
async function api<T>(path: string, params: Record<string, string | number> = {}): Promise<T | undefined> {
  const res = await fetch(`/api/${path}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}`)
  if (res.status === 404) return undefined
  if (!res.ok) throw new Error(`/api/${path} → ${res.status}`)
  return (await res.json()) as T
}

export async function getHomePage(): Promise<HomePage> {
  return home
}

export async function getDiscoveryPage(): Promise<DiscoveryPage> {
  if (!live()) return discovery
  try {
    const landing = await api<{
      id: number
      hero_title: string | null
      hero_subtitle: string | null
      hero_image: string | null
      meta_title: string | null
      meta_description: string | null
      blocks: DiscoveryBlock[]
    }>('discovery')
    if (!landing) return discovery
    return {
      ...discovery,
      hero: {
        title: landing.hero_title || discovery.hero.title,
        subtitle: landing.hero_subtitle || discovery.hero.subtitle,
        image: landing.hero_image || discovery.hero.image,
      },
      landingId: landing.id,
      meta: { title: landing.meta_title ?? undefined, description: landing.meta_description ?? undefined },
      blocks: [...landing.blocks, ...discovery.blocks],
    }
  } catch (e) {
    console.error(e) // backend down → still render the page on mock data
    return discovery
  }
}

// ── venue page: /discovery/establishments/:slug ────────────────────────

/** `slug` may also be a numeric id, while establishment slugs are still empty in Directus. */
export async function getVenuePage({ params }: LoaderFunctionArgs): Promise<VenuePage> {
  const slug = params.slug!
  const fromApi = live() ? await api<VenuePage>('venue', { slug }).catch((e) => void console.error(e)) : undefined // down → fall back to mock
  const page = fromApi ? await withKeyInfo(fromApi) : venues[slug.toLowerCase()]
  if (!page) throw new Response('Venue not found', { status: 404 })
  return page
}

/** Key Information is fetched live from Google Places (never stored — Google's terms); hidden without a place id. */
async function withKeyInfo(page: VenuePage): Promise<VenuePage> {
  const { placeId, type } = page.venue
  if (!placeId || !import.meta.env.VITE_GOOGLE_MAPS_KEY) return page // no place id → section hidden
  try {
    return { ...page, venue: { ...page.venue, ...(await getPlaceKeyInfo(placeId, type as Venue['type'])) } }
  } catch (e) {
    console.error(e) // Google down / bad place id → page still renders, without Key Information
    return page
  }
}

// ── stories ────────────────────────────────────────────────────────────

export async function getStoriesPage(): Promise<StoriesPage> {
  if (!live()) return stories
  try {
    const latest = await api<Article[]>('stories')
    return latest ? { ...stories, latest } : stories
  } catch (e) {
    console.error(e) // backend down → static page only
    return stories
  }
}

/** `slug` may also be a numeric id. Live first, then the mock (Peru ingredients). */
export async function getStoryPage({ params }: LoaderFunctionArgs): Promise<StoryPage> {
  const slug = params.slug!
  const fromApi = live() ? await api<Omit<StoryPage, 'taxonomy'>>('story', { slug }).catch((e) => void console.error(e)) : undefined // down → fall back to mock
  const page = fromApi ? { ...fromApi, taxonomy: stories.taxonomy } : storyPages[slug] // ponytail: archive/categories/authors are still mock
  if (!page) throw new Response('Story not found', { status: 404 })
  return page
}

// ── story category listing: /stories/categories/:category?offset=20 ───

const CATEGORY_PAGE_SIZE = 20 // as on the live site

/** Paged like the live site: `?offset=` in steps of 20. Live stories in the category, newest first; mock otherwise. */
export async function getStoryCategoryPage({ params, request }: LoaderFunctionArgs): Promise<StoryCategoryPage> {
  const category = params.category!
  const offset = Math.min(100_000, Math.max(0, Number(new URL(request.url).searchParams.get('offset')) || 0))
  let items: Article[], total: number
  try {
    const res = live() ? await api<{ items: Article[]; total: number }>('story-category', { category, offset }) : undefined
    if (!res) throw new Error('no live data')
    ;({ items, total } = res)
  } catch (e) {
    if (live()) console.error(e) // backend down → mock
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

// ── rankings: main menu + /<section>/:slug pages ───────────────────────

export const SECTION_LABEL: Record<RankingSection, string> = { restaurants: 'Restaurants', bars: 'Bars', hotels: 'Hotels', vineyards: 'Vineyards' }

/** Root loader: the rankings shown in the Restaurants / Bars / Hotels / Vineyards dropdowns. */
export async function getRankingNav(): Promise<RankingNavItem[]> {
  if (!live()) return []
  try {
    return (await api<RankingNavItem[]>('ranking-nav')) ?? []
  } catch (e) {
    console.error(e) // backend down → empty dropdowns, rest of the site still works
    return []
  }
}

/** Landing page and 1-50 / 51-100 list pages share this loader. */
export async function getRankingPage(section: RankingSection, slug: string): Promise<RankingPage> {
  if (!live()) throw new Response('Rankings need Directus', { status: 404 })
  const r = await api<Omit<RankingPage, 'films' | 'partners'>>('ranking', { section, slug })
  if (!r) throw new Response('Ranking not found', { status: 404 })
  return { ...r, films: FILMS, partners: PARTNERS }
}
