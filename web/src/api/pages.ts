/**
 * The only place pages get content from. Each route loader calls one of these.
 * Today they return bundled mock data; when the Directus schema lands, replace the
 * body with `client.request(readItems('…', { fields: … }))` calls (client from lib/directus) and map to the same types —
 * components never change.
 */
import { readItems, readSingleton } from '@directus/sdk'
import type { LoaderFunctionArgs } from 'react-router'
import type { DiscoveryBlock, DiscoveryPage, HomePage, StoriesPage, Venue, VenuePage } from '../types'
import { home } from '../data/home'
import { discovery } from '../data/discovery'
import { stories } from '../data/stories'
import { venues } from '../data/venue'
import { getPlaceKeyInfo } from '../lib/places'

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

  const [nearby, keyInfo] = await Promise.all([
    client.request(readItems('establishment', {
      fields: VENUE_FIELDS,
      filter: { city: { _eq: e.city }, id: { _neq: e.id } }, // ponytail: same-city match; switch to a _dwithin on `location` for real distance
      limit: 8,
    })) as unknown as Promise<DxEstablishment[]>,
    getKeyInfo(placeId),
  ])

  return {
    venue: {
      ...toVenue(e),
      ...keyInfo,
      description: e.editorial_description ?? '',
      gallery: e.photos.map((p) => p.directus_files_id),
      address: e.address ?? undefined,
      map: e.location ? { lat: e.location.coordinates[1], lng: e.location.coordinates[0] } : undefined,
      placeId,
    },
    nearby: nearby.map(toVenue),
  }
}

export async function getStoriesPage(): Promise<StoriesPage> {
  return stories
}

/** Key Information is fetched live from Google Places (never stored — Google's terms); hidden without a place id. */
async function getKeyInfo(placeId: string | undefined) {
  if (!placeId || !import.meta.env.VITE_GOOGLE_MAPS_KEY) return {} // no place id → section hidden
  try {
    return { ...(await getPlaceKeyInfo(placeId)), keyInfoSource: 'google' as const }
  } catch (e) {
    console.error(e) // Google down / bad place id → page still renders, without Key Information
    return {}
  }
}
