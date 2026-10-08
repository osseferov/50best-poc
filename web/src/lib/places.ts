/**
 * Google Places API (New) — Place Details for a venue's Key Information.
 * Fetched live on every page view: Google's terms forbid storing these fields (only the place id may be kept).
 */
import type { VenueDetail } from '../types'

type KeyInfo = Pick<VenueDetail, 'price' | 'hours' | 'phone' | 'website'>

interface Money { currencyCode: string; units?: string }
export interface PlaceDetails {
  priceRange?: { startPrice?: Money; endPrice?: Money }
  priceLevel?: string
  regularOpeningHours?: { weekdayDescriptions?: string[] }
  internationalPhoneNumber?: string
  websiteUri?: string
}

const FIELDS = 'priceRange,priceLevel,regularOpeningHours.weekdayDescriptions,internationalPhoneNumber,websiteUri'
const LEVEL: Record<string, string> = {
  PRICE_LEVEL_INEXPENSIVE: '$', PRICE_LEVEL_MODERATE: '$$', PRICE_LEVEL_EXPENSIVE: '$$$', PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
}

const money = (m: Money) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: m.currencyCode, maximumFractionDigits: 0 }).format(Number(m.units ?? 0))

/** "Price per person $50–100" from priceRange, else "$$" from priceLevel. */
export function formatPrice(p: PlaceDetails): string | undefined {
  const { startPrice: s, endPrice: e } = p.priceRange ?? {}
  if (s && e) return `Price per person ${money(s)}–${money(e).replace(/^\D+/, '')}`
  if (s) return `Price per person ${money(s)}+`
  if (p.priceLevel && LEVEL[p.priceLevel]) return `Price ${LEVEL[p.priceLevel]}`
  return undefined
}

export function toKeyInfo(p: PlaceDetails): KeyInfo {
  return {
    price: formatPrice(p),
    hours: p.regularOpeningHours?.weekdayDescriptions,
    phone: p.internationalPhoneNumber,
    website: p.websiteUri,
  }
}

export async function getPlaceKeyInfo(placeId: string): Promise<KeyInfo> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: { 'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_KEY, 'X-Goog-FieldMask': FIELDS },
  })
  if (!res.ok) throw new Error(`Google Places ${res.status} for ${placeId}`)
  return toKeyInfo(await res.json())
}
