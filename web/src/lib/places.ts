/**
 * Google Places API (New) — Place Details for a venue's Key Information.
 * Fetched live on every page view: Google's terms forbid storing these fields (only the place id may be kept).
 */
import type { Venue, VenueDetail } from '../types'

type KeyInfo = Pick<VenueDetail, 'price' | 'hours' | 'phone' | 'website'>

interface Money { currencyCode: string; units?: string }
interface Point { day: number; hour?: number; minute?: number } // day 0 = Sunday
export interface PlaceDetails {
  priceRange?: { startPrice?: Money; endPrice?: Money }
  priceLevel?: string
  regularOpeningHours?: { periods?: { open: Point; close?: Point }[] }
  internationalPhoneNumber?: string
  websiteUri?: string
}

const FIELDS = 'priceRange,priceLevel,regularOpeningHours.periods,internationalPhoneNumber,websiteUri'
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

// ── hours: "Lunch and dinner: Mon – Sat" ─────────────────────────────
// A day gets a slot when the venue is open for at least half of the slot's window.
// ponytail: fixed windows; tune here if editors disagree with a label
const SLOTS: Record<'meal' | 'time', [string, number, number][]> = {
  meal: [['breakfast', 7, 10.5], ['lunch', 12, 14.5], ['dinner', 19, 22]],
  time: [['morning', 8, 11], ['afternoon', 14, 17], ['evening', 19, 22]],
}
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] // Mon first
const WEEK = 7 * 1440
const minute = (t: Point) => t.day * 1440 + (t.hour ?? 0) * 60 + (t.minute ?? 0)

const joinWords = (w: string[]) => {
  const s = w.length > 1 ? `${w.slice(0, -1).join(', ')} and ${w.at(-1)}` : w[0]
  return s[0].toUpperCase() + s.slice(1)
}

export function formatHours(p: PlaceDetails, type: Venue['type']): string[] | undefined {
  const periods = p.regularOpeningHours?.periods
  if (!periods?.length) return undefined
  // open intervals in minutes from Sunday 00:00; no `close` = open 24/7; overnight closes wrap into next week
  const spans = periods.map(({ open, close }) => {
    if (!close) return [0, WEEK]
    const a = minute(open), b = minute(close)
    return [a, b > a ? b : b + WEEK]
  })
  const openFor = (from: number, to: number) =>
    spans.reduce((sum, [a, b]) => sum + [0, -WEEK].reduce((s, k) => s + Math.max(0, Math.min(b + k, to) - Math.max(a + k, from)), 0), 0)

  const slots = SLOTS[type === 'Restaurant' ? 'meal' : 'time']
  const byLabel = new Map<string, number[]>() // label → indexes into WEEK_ORDER
  WEEK_ORDER.forEach((day, i) => {
    const names = slots.filter(([, from, to]) => openFor(day * 1440 + from * 60, day * 1440 + to * 60) >= (to - from) * 30).map(([n]) => n)
    if (!names.length) return
    const label = joinWords(names)
    byLabel.set(label, [...(byLabel.get(label) ?? []), i])
  })

  return [...byLabel].map(([label, idx]) => {
    const runs: number[][] = []
    for (const i of idx) (runs.at(-1)?.at(-1) === i - 1 ? runs.at(-1)!.push(i) : runs.push([i]))
    const days = runs.map((r) => (r.length > 1 ? `${DAY[WEEK_ORDER[r[0]]]} – ${DAY[WEEK_ORDER[r.at(-1)!]]}` : DAY[WEEK_ORDER[r[0]]]))
    return `${label}: ${days.join(', ')}`
  })
}

export function toKeyInfo(p: PlaceDetails, type: Venue['type']): KeyInfo {
  return {
    price: formatPrice(p),
    hours: formatHours(p, type),
    phone: p.internationalPhoneNumber,
    website: p.websiteUri,
  }
}

export async function getPlaceKeyInfo(placeId: string, type: Venue['type']): Promise<KeyInfo> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: { 'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_KEY, 'X-Goog-FieldMask': FIELDS },
  })
  if (!res.ok) throw new Error(`Google Places ${res.status} for ${placeId}`)
  return toKeyInfo(await res.json(), type)
}
