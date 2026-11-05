/**
 * Server-side content queries. Every query here is fixed: the browser can only choose validated parameters
 * (slug, section, offset) through `api/*`, never fields, filters or collections.
 */
import { aggregate, readItems, readSingleton } from '@directus/sdk'
import type { Article, DiscoveryBlock, RankingNavItem, RankingPage, RankingSection, StoryPage, Venue, VenuePage } from '../src/types'
import { client, directusUrl } from './directus.js'
import { NotFound } from './http.js'

/** Embedded `${DIRECTUS_URL}/assets/<id>…` URLs in rich text → the same-origin asset proxy (no token in the browser). */
function richTextAssets(html: string): string {
  const base = directusUrl()
  if (!base) return html
  const assets = `${base}/assets/`
  return html.replace(/(src=["'])([^"']+)/g, (m, attr: string, src: string) => {
    const url = src.replace(/&amp;/g, '&')
    if (!url.startsWith(assets)) return m
    const id = url.slice(assets.length).split(/[?#]/)[0]
    return /^[0-9a-f-]{36}$/i.test(id) ? `${attr}/api/assets/${id}` : m
  })
}

// ── establishment → Venue ──────────────────────────────────────────────

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

// ── discovery_landing (singleton, M2A `sections`) ──────────────────────

type DxSection = {
  collection: string
  item: { id: number; title: string; subtitle: string | null; establishments: { establishment_id: DxEstablishment }[] }
}
const EC = 'sections.item:discovery_establishment_carousel'

export interface DiscoveryLanding {
  id: number
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  meta_title: string | null
  meta_description: string | null
  blocks: DiscoveryBlock[]
}

export async function getDiscoveryLanding(): Promise<DiscoveryLanding> {
  const landing = (await client().request(readSingleton('discovery_landing', {
    fields: [
      'id', 'hero_title', 'hero_subtitle', 'hero_image', 'meta_title', 'meta_description',
      'sections.collection', `${EC}.id`, `${EC}.title`, `${EC}.subtitle`,
      ...VENUE_FIELDS.map((f) => `${EC}.establishments.establishment_id.${f}`),
    ],
  }))) as unknown as Omit<DiscoveryLanding, 'blocks'> & { sections: DxSection[] }

  // ponytail: only establishment carousels are mapped; other section types are skipped until their blocks are built
  const { sections, ...rest } = landing
  const blocks = sections
    .filter((s) => s.collection === 'discovery_establishment_carousel')
    .map(({ item }): DiscoveryBlock => ({
      type: 'venues',
      id: `dx-carousel-${item.id}`,
      label: 'venues',
      title: item.title,
      description: item.subtitle ?? undefined,
      items: item.establishments.map(({ establishment_id: e }) => toVenue(e)),
    }))
  return { ...rest, blocks }
}

// ── venue page ─────────────────────────────────────────────────────────

/** `slug` may also be a numeric id. Key Information (Google Places) is added by the browser, not here. */
export async function getVenue(slug: string): Promise<VenuePage> {
  const c = client()
  const [e] = (await c.request(readItems('establishment', {
    fields: [...VENUE_FIELDS, 'editorial_description', 'address', 'location', 'google_place_id'],
    filter: /^\d+$/.test(slug) ? { id: { _eq: Number(slug) } } : { slug: { _eq: slug } },
    limit: 1,
  }))) as unknown as DxEstablishmentDetail[]
  if (!e) throw new NotFound()
  const placeId = e.google_place_id?.trim().split(/\s/)[0] || undefined // editors paste "<id> <address>"; ids never contain spaces

  const [nearby, accolades] = await Promise.all([
    c.request(readItems('establishment', {
      fields: VENUE_FIELDS,
      filter: { city: { _eq: e.city }, id: { _neq: e.id } }, // ponytail: same-city match; switch to a _dwithin on `location` for real distance
      limit: 8,
    })) as unknown as Promise<DxEstablishment[]>,
    getAccolades(e.id).catch((err) => (console.error(err), [] as string[])), // no accolades block rather than no page
  ])

  return {
    venue: {
      ...toVenue(e),
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

// ── stories ────────────────────────────────────────────────────────────

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

export async function getLatestStories(excludeId?: number): Promise<Article[]> {
  const items = (await client().request(readItems('story', {
    fields: STORY_CARD_FIELDS,
    filter: { archived: { _neq: true }, ...(excludeId && { id: { _neq: excludeId } }) },
    sort: ['-published_at'],
    limit: 8, // same as the static grid
  }))) as unknown as DxStory[]
  return items.map(toArticle)
}

/** `slug` may also be a numeric id. `taxonomy` is still mock and added by the browser. */
export async function getStory(slug: string): Promise<Omit<StoryPage, 'taxonomy'>> {
  const [s] = (await client().request(readItems('story', {
    fields: [...STORY_CARD_FIELDS, 'published_at', 'tags', 'body', ...STORY_CARD_FIELDS.map((f) => `related_stories.story_id.${f}`)],
    filter: /^\d+$/.test(slug) ? { id: { _eq: Number(slug) } } : { slug: { _eq: slug } },
    limit: 1,
  }))) as unknown as DxStoryDetail[]
  if (!s) throw new NotFound()
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
  }
}

export const CATEGORY_PAGE_SIZE = 20 // as on the live site

export async function getCategoryStories(category: string, offset: number): Promise<{ items: Article[]; total: number }> {
  const c = client()
  // category in the URL is its slug, or its name while slugs are empty ("News")
  const filter = { _and: [{ archived: { _neq: true } }, { _or: [{ category: { slug: { _eq: category } } }, { category: { name: { _eq: category } } }] }] }
  const [items, count] = await Promise.all([
    c.request(readItems('story', { fields: STORY_CARD_FIELDS, filter, sort: ['-published_at'], limit: CATEGORY_PAGE_SIZE, offset })) as unknown as Promise<DxStory[]>,
    c.request(aggregate('story', { aggregate: { count: '*' }, query: { filter } })) as unknown as Promise<{ count: string | number }[]>,
  ])
  return { items: items.map(toArticle), total: Number(count[0]?.count ?? 0) }
}

// ── rankings ───────────────────────────────────────────────────────────

export const SECTIONS = ['restaurants', 'bars', 'hotels', 'vineyards'] as const satisfies readonly RankingSection[]

/** event.event_type (and establishment.type) → URL section. Matched case-insensitively ("Restaurant" / "restaurant"). */
const SECTION_OF: Record<string, RankingSection> = { restaurant: 'restaurants', bars: 'bars', hotels: 'hotels', vineyards: 'vineyards' }
const TYPE_OF: Record<RankingSection, string> = { restaurants: 'restaurant', bars: 'bars', hotels: 'hotels', vineyards: 'vineyards' }

// ponytail: published_ranking has no slug field — derived from the title; add a `slug` field if titles start colliding
const slugify = (t: string) => t.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

interface DxPublishedRanking {
  id: number
  title: string
  event: { id: number; event_type: string | null; banner_image: string | null } | null
}

async function getPublishedRankings(): Promise<(RankingNavItem & { event: DxPublishedRanking['event'] })[]> {
  const items = (await client().request(readItems('published_ranking', {
    fields: ['id', 'title', 'event.id', 'event.event_type', 'event.banner_image'],
    sort: ['id'],
  }))) as unknown as DxPublishedRanking[]
  return items.flatMap((r) => {
    const section = SECTION_OF[(r.event?.event_type ?? '').toLowerCase()]
    return section ? [{ id: r.id, slug: slugify(r.title), title: r.title, section, event: r.event }] : []
  })
}

/** The rankings shown in the Restaurants / Bars / Hotels / Vineyards dropdowns. */
export async function getRankingNav(): Promise<RankingNavItem[]> {
  return (await getPublishedRankings()).map(({ event: _event, ...nav }) => nav)
}

/** Venues = `ranking` rows of the event whose establishment type matches the event type. Films/partners are mock, added by the browser. */
export async function getRanking(section: RankingSection, slug: string): Promise<Omit<RankingPage, 'films' | 'partners'>> {
  const r = (await getPublishedRankings()).find((x) => x.section === section && x.slug === slug)
  if (!r || !r.event) throw new NotFound()
  const c = client()
  const [rows, linked] = await Promise.all([
    c.request(readItems('ranking', {
      fields: ['place', ...VENUE_FIELDS.map((f) => `establishment.${f}`)],
      filter: { event: { _eq: r.event.id }, establishment: { type: { _eq: TYPE_OF[section] } } },
      sort: ['place'],
      limit: -1,
    })) as unknown as Promise<{ place: number; establishment: DxEstablishment | null }[]>,
    c.request(readItems('published_ranking', {
      fields: STORY_CARD_FIELDS.map((f) => `stories.story_id.${f}`),
      filter: { id: { _eq: r.id } },
      limit: 1,
    })) as unknown as Promise<{ stories: { story_id: DxStory | null }[] }[]>,
  ])
  return {
    ranking: { id: r.id, slug: r.slug, title: r.title, section, image: r.event.banner_image ?? undefined },
    entries: rows.flatMap((x) => (x.establishment ? [{ place: x.place, venue: toVenue(x.establishment) }] : [])),
    stories: (linked[0]?.stories ?? []).flatMap((x) => (x.story_id ? [toArticle(x.story_id)] : [])),
  }
}

/** Accolades on a venue page: its `ranking` places in events that have a published ranking, newest event first. */
async function getAccolades(establishmentId: number): Promise<string[]> {
  const [rows, published] = await Promise.all([
    client().request(readItems('ranking', {
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
