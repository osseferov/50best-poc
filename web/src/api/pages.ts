/**
 * The only place pages get content from. Each route loader calls one of these.
 * Today they return bundled mock data; when the Directus schema lands, replace the
 * body with `client.request(readItems('…', { fields: … }))` calls (client from lib/directus) and map to the same types —
 * components never change.
 */
import { aggregate, readItems, readSingleton } from '@directus/sdk'
import type { LoaderFunctionArgs } from 'react-router'
import type { Article, DiscoveryBlock, DiscoveryPage, HomePage, RankingNavItem, RankingPage, RankingSection, StoriesPage, StoryCategoryPage, StoryPage, Venue, VenuePage } from '../types'
import { home } from '../data/home'
import { discovery } from '../data/discovery'
import { stories } from '../data/stories'
import { venues } from '../data/venue'
import { stories as storyPages } from '../data/story'
import { FILMS, PARTNERS } from '../data/ranking'
import { getPlaceKeyInfo } from '../lib/places'
import { richTextAssets } from '../lib/image'

export async function getHomePage(): Promise<HomePage> {
  return home
}

export async function getDiscoveryPage(): Promise<DiscoveryPage> {
  if (!import.meta.env.VITE_DIRECTUS_URL) return discovery
  try {
    return { ...discovery, blocks: [...(await getDiscoveryLandingBlocks()), ...discovery.blocks] }
  } catch (e) {
    console.error(e) // Directus down → still render the page on mock data
    return discovery
  }
}

// ── Directus: establishment → Venue ───────────────────────────────────

interface DxEstablishment {
  id: number
  slug: string | null
  name: string
  type: 'restaurant' | 'bars' | 'hotels' | 'vineyards' | null
  city: string | null
  editorial_tagline: string | null
  geo_unit: { name: string } | null
  photos: { directus_files_id: string }[]
}
interface DxEstablishmentDetail extends DxEstablishment {
  editorial_description: string | null
  address: string | null
  location: { type: 'Point'; coordinates: [number, number] } | null // GeoJSON: [lng, lat]
  google_place_id: string | null
}

const VENUE_FIELDS = ['id', 'slug', 'name', 'type', 'city', 'editorial_tagline', 'geo_unit.name', 'photos.directus_files_id']
const VENUE_TYPE: Record<string, Venue['type']> = { restaurant: 'Restaurant', bars: 'Bar', hotels: 'Hotel', vineyards: 'Vineyard' }

const directusClient = async () => (await import('../lib/directus')).default // lazy: the client throws without a URL

function toVenue(e: DxEstablishment): Venue {
  return {
    id: String(e.id),
    name: e.name,
    type: VENUE_TYPE[e.type ?? ''] ?? 'Restaurant',
    city: e.city ?? '',
    country: e.geo_unit?.name ?? '',
    style: e.editorial_tagline ?? '',
    image: e.photos[0]?.directus_files_id ?? '',
    url: `/discovery/establishments/${e.slug || e.id}`,
  }
}

// ── Directus: discovery_landing (singleton, M2A `sections`) ────────────

type DxSection = {
  collection: string
  item: { id: number; title: string; subtitle: string | null; establishments: { establishment_id: DxEstablishment }[] }
}
const EC = 'sections.item:discovery_establishment_carousel'

async function getDiscoveryLandingBlocks(): Promise<DiscoveryBlock[]> {
  const client = await directusClient()
  const landing = (await client.request(readSingleton('discovery_landing', {
    fields: [
      'sections.collection', `${EC}.id`, `${EC}.title`, `${EC}.subtitle`,
      ...VENUE_FIELDS.map((f) => `${EC}.establishments.establishment_id.${f}`),
    ],
  }))) as unknown as { sections: DxSection[] }

  // ponytail: only establishment carousels are mapped; other section types are skipped until their blocks are built
  return landing.sections
    .filter((s) => s.collection === 'discovery_establishment_carousel')
    .map(({ item }) => ({
      type: 'venues',
      id: `dx-carousel-${item.id}`,
      label: 'venues',
      title: item.title,
      description: item.subtitle ?? undefined,
      items: item.establishments.map(({ establishment_id: e }) => toVenue(e)),
    }))
}

// ── venue page: /discovery/establishments/:slug ────────────────────────


/** `slug` may also be a numeric id, while establishment slugs are still empty in Directus. */
export async function getVenuePage({ params }: LoaderFunctionArgs): Promise<VenuePage> {
  const slug = params.slug!
  const fromDirectus = import.meta.env.VITE_DIRECTUS_URL
    ? await getDirectusVenuePage(slug).catch((e) => void console.error(e)) // Directus down → fall back to mock
    : undefined
  const page = fromDirectus || venues[slug.toLowerCase()]
  if (!page) throw new Response('Venue not found', { status: 404 })
  return page
}

async function getDirectusVenuePage(slug: string): Promise<VenuePage | undefined> {
  const client = await directusClient()
  const [e] = (await client.request(readItems('establishment', {
    fields: [...VENUE_FIELDS, 'editorial_description', 'address', 'location', 'google_place_id'],
    filter: /^\d+$/.test(slug) ? { id: { _eq: Number(slug) } } : { slug: { _eq: slug } },
    limit: 1,
  }))) as unknown as DxEstablishmentDetail[]
  if (!e) return undefined
  const placeId = e.google_place_id?.trim().split(/\s/)[0] || undefined // editors paste "<id> <address>"; ids never contain spaces

  const [nearby, keyInfo, accolades] = await Promise.all([
    client.request(readItems('establishment', {
      fields: VENUE_FIELDS,
      filter: { city: { _eq: e.city }, id: { _neq: e.id } }, // ponytail: same-city match; switch to a _dwithin on `location` for real distance
      limit: 8,
    })) as unknown as Promise<DxEstablishment[]>,
    getKeyInfo(placeId, toVenue(e).type),
    getAccolades(e.id).catch((err) => (console.error(err), [] as string[])), // no accolades block rather than no page
  ])

  return {
    venue: {
      ...toVenue(e),
      ...keyInfo,
      description: richTextAssets(e.editorial_description ?? ''),
      gallery: e.photos.map((p) => p.directus_files_id),
      address: e.address ?? undefined,
      map: e.location ? { lat: e.location.coordinates[1], lng: e.location.coordinates[0] } : undefined,
      placeId,
      accolades,
    },
    nearby: nearby.map(toVenue),
  }
}

export async function getStoriesPage(): Promise<StoriesPage> {
  if (!import.meta.env.VITE_DIRECTUS_URL) return stories
  try {
    return { ...stories, latest: await getLatestStories() }
  } catch (e) {
    console.error(e) // Directus down → static page only
    return stories
  }
}

// ── Directus: story ────────────────────────────────────────────────────

interface DxStory {
  id: number
  slug: string | null
  title: string
  subtitle: string | null
  main_image: string | null
  category: { name: string } | null
  author: { first_name: string | null; last_name: string | null } | null
}
interface DxStoryDetail extends DxStory {
  published_at: string | null
  tags: string[] | null
  body: string | null
  related_stories: { story_id: DxStory | null }[]
}

const STORY_CARD_FIELDS = ['id', 'slug', 'title', 'subtitle', 'main_image', 'category.name', 'author.first_name', 'author.last_name']
const fullName = (a: DxStory['author']) => [a?.first_name, a?.last_name].filter(Boolean).join(' ') || undefined

function toArticle(s: DxStory): Article {
  return {
    id: `dx-story-${s.id}`,
    title: s.title,
    description: s.subtitle ?? undefined,
    image: s.main_image ?? '',
    author: fullName(s.author),
    category: s.category?.name,
    url: `/stories/${s.slug || s.id}`,
  }
}

async function getLatestStories(excludeId?: number): Promise<Article[]> {
  const client = await directusClient()
  const items = (await client.request(readItems('story', {
    fields: STORY_CARD_FIELDS,
    filter: { archived: { _neq: true }, ...(excludeId && { id: { _neq: excludeId } }) },
    sort: ['-published_at'],
    limit: 8, // same as the static grid
  }))) as unknown as DxStory[]
  return items.map(toArticle)
}

// ── story page: /stories/:slug ─────────────────────────────────────────

/** `slug` may also be a numeric id. Directus first, then the mock (Peru ingredients). */
export async function getStoryPage({ params }: LoaderFunctionArgs): Promise<StoryPage> {
  const slug = params.slug!
  const fromDirectus = import.meta.env.VITE_DIRECTUS_URL
    ? await getDirectusStoryPage(slug).catch((e) => void console.error(e)) // Directus down → fall back to mock
    : undefined
  const page = fromDirectus || storyPages[slug]
  if (!page) throw new Response('Story not found', { status: 404 })
  return page
}

async function getDirectusStoryPage(slug: string): Promise<StoryPage | undefined> {
  const client = await directusClient()
  const [s] = (await client.request(readItems('story', {
    fields: [...STORY_CARD_FIELDS, 'published_at', 'tags', 'body', ...STORY_CARD_FIELDS.map((f) => `related_stories.story_id.${f}`)],
    filter: /^\d+$/.test(slug) ? { id: { _eq: Number(slug) } } : { slug: { _eq: slug } },
    limit: 1,
  }))) as unknown as DxStoryDetail[]
  if (!s) return undefined
  const picked = s.related_stories.flatMap((r) => (r.story_id && r.story_id.id !== s.id ? [toArticle(r.story_id)] : []))
  return {
    story: {
      id: String(s.id),
      title: s.title,
      subtitle: s.subtitle ?? undefined,
      image: s.main_image ?? '',
      author: fullName(s.author),
      date: s.published_at ?? undefined,
      category: s.category?.name,
      tags: s.tags ?? [],
      body: richTextAssets(s.body ?? ''),
    },
    related: picked.length ? picked : await getLatestStories(s.id), // no hand-picked related → latest other stories
    taxonomy: stories.taxonomy, // ponytail: archive/categories/authors are still mock
  }
}

/** Key Information is fetched live from Google Places (never stored — Google's terms); hidden without a place id. */
async function getKeyInfo(placeId: string | undefined, type: Venue['type']) {
  if (!placeId || !import.meta.env.VITE_GOOGLE_MAPS_KEY) return {} // no place id → section hidden
  try {
    return await getPlaceKeyInfo(placeId, type)
  } catch (e) {
    console.error(e) // Google down / bad place id → page still renders, without Key Information
    return {}
  }
}

// ── story category listing: /stories/categories/:category?offset=20 ───

const CATEGORY_PAGE_SIZE = 20 // as on the live site

/** Paged like the live site: `?offset=` in steps of 20. Directus stories in the category, newest first; mock otherwise. */
export async function getStoryCategoryPage({ params, request }: LoaderFunctionArgs): Promise<StoryCategoryPage> {
  const category = params.category!
  const offset = Math.max(0, Number(new URL(request.url).searchParams.get('offset')) || 0)
  let items: Article[], total: number
  try {
    if (!import.meta.env.VITE_DIRECTUS_URL) throw new Error('no Directus')
    ;[items, total] = await getDirectusCategoryStories(category, offset)
  } catch (e) {
    if (import.meta.env.VITE_DIRECTUS_URL) console.error(e) // Directus down → mock
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

async function getDirectusCategoryStories(category: string, offset: number): Promise<[Article[], number]> {
  const client = await directusClient()
  // category in the URL is its slug, or its name while slugs are empty ("News")
  const filter = { _and: [{ archived: { _neq: true } }, { _or: [{ category: { slug: { _eq: category } } }, { category: { name: { _eq: category } } }] }] }
  const [items, count] = await Promise.all([
    client.request(readItems('story', { fields: STORY_CARD_FIELDS, filter, sort: ['-published_at'], limit: CATEGORY_PAGE_SIZE, offset })) as unknown as Promise<DxStory[]>,
    client.request(aggregate('story', { aggregate: { count: '*' }, query: { filter } })) as unknown as Promise<{ count: string | number }[]>,
  ])
  return [items.map(toArticle), Number(count[0]?.count ?? 0)]
}

// ── rankings: Directus published_ranking → main menu + /<section>/:slug pages ──

/** event.event_type (and establishment.type) → URL section. Matched case-insensitively ("Restaurant" / "restaurant"). */
const SECTION_OF: Record<string, RankingSection> = { restaurant: 'restaurants', bars: 'bars', hotels: 'hotels', vineyards: 'vineyards' }
const TYPE_OF: Record<RankingSection, string> = { restaurants: 'restaurant', bars: 'bars', hotels: 'hotels', vineyards: 'vineyards' }
export const SECTION_LABEL: Record<RankingSection, string> = { restaurants: 'Restaurants', bars: 'Bars', hotels: 'Hotels', vineyards: 'Vineyards' }

// ponytail: published_ranking has no slug field — derived from the title; add a `slug` field if titles start colliding
const slugify = (t: string) => t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

interface DxPublishedRanking {
  id: number
  title: string
  event: { id: number; event_type: string | null; banner_image: string | null } | null
}

async function getPublishedRankings(): Promise<(RankingNavItem & { event: DxPublishedRanking['event'] })[]> {
  const client = await directusClient()
  const items = (await client.request(readItems('published_ranking', {
    fields: ['id', 'title', 'event.id', 'event.event_type', 'event.banner_image'],
    sort: ['id'],
  }))) as unknown as DxPublishedRanking[]
  return items.flatMap((r) => {
    const section = SECTION_OF[(r.event?.event_type ?? '').toLowerCase()]
    return section ? [{ id: r.id, slug: slugify(r.title), title: r.title, section, event: r.event }] : []
  })
}

/** Root loader: the rankings shown in the Restaurants / Bars / Hotels / Vineyards dropdowns. */
export async function getRankingNav(): Promise<RankingNavItem[]> {
  if (!import.meta.env.VITE_DIRECTUS_URL) return []
  try {
    return (await getPublishedRankings()).map(({ event: _event, ...nav }) => nav)
  } catch (e) {
    console.error(e) // Directus down → empty dropdowns, rest of the site still works
    return []
  }
}

/** Landing page and 1-50 / 51-100 list pages share this loader. Venues = `ranking` rows of the event whose establishment type matches the event type. */
export async function getRankingPage(section: RankingSection, slug: string): Promise<RankingPage> {
  if (!import.meta.env.VITE_DIRECTUS_URL) throw new Response('Rankings need Directus', { status: 404 })
  const r = (await getPublishedRankings()).find((x) => x.section === section && x.slug === slug)
  if (!r || !r.event) throw new Response('Ranking not found', { status: 404 })
  const client = await directusClient()
  const [rows, linked] = await Promise.all([
    client.request(readItems('ranking', {
      fields: ['place', ...VENUE_FIELDS.map((f) => `establishment.${f}`)],
      filter: { event: { _eq: r.event.id }, establishment: { type: { _eq: TYPE_OF[section] } } },
      sort: ['place'],
      limit: -1,
    })) as unknown as Promise<{ place: number; establishment: DxEstablishment | null }[]>,
    client.request(readItems('published_ranking', {
      fields: STORY_CARD_FIELDS.map((f) => `stories.story_id.${f}`),
      filter: { id: { _eq: r.id } },
      limit: 1,
    })) as unknown as Promise<{ stories: { story_id: DxStory | null }[] }[]>,
  ])
  return {
    ranking: { id: r.id, slug: r.slug, title: r.title, section, image: r.event.banner_image ?? undefined },
    entries: rows.flatMap((x) => (x.establishment ? [{ place: x.place, venue: toVenue(x.establishment) }] : [])),
    stories: (linked[0]?.stories ?? []).flatMap((x) => (x.story_id ? [toArticle(x.story_id)] : [])),
    films: FILMS,
    partners: PARTNERS,
  }
}

/** Accolades on a venue page: its `ranking` places in events that have a published ranking, newest event first. */
async function getAccolades(establishmentId: number): Promise<string[]> {
  const client = await directusClient()
  const [rows, published] = await Promise.all([
    client.request(readItems('ranking', {
      fields: ['place', 'event.id'],
      filter: { establishment: { _eq: establishmentId } },
      sort: ['-event.date_created'],
      limit: -1,
    })) as unknown as Promise<{ place: number; event: { id: number } | null }[]>,
    getPublishedRankings(),
  ])
  // ponytail: an event with several published rankings is labelled with the first one's title
  const titleOf = new Map<number, string>()
  for (const r of published) if (r.event && !titleOf.has(r.event.id)) titleOf.set(r.event.id, r.title)
  return rows.flatMap((r) => (r.event && titleOf.has(r.event.id) ? [`No.${r.place} ${titleOf.get(r.event.id)}`] : []))
}
