/**
 * Content shapes, one per future Directus collection.
 * `Image` is either a Directus file id (UUID) or a plain URL/path — see lib/image.ts.
 */
export type Image = string

export interface Link {
  label: string
  url: string
}

export interface Venue {
  id: string
  name: string
  type: 'Restaurant' | 'Bar' | 'Hotel' | 'Vineyard'
  city: string
  country: string
  style: string
  image: Image
  gem?: boolean // "The 50" gemstone badge
  url: string
}

/** A city, country or wine region card. */
export interface Destination {
  id: string
  name: string
  description?: string
  image: Image
  alt?: string
  url: string
}

export interface Article {
  id: string
  title: string
  description?: string
  image: Image
  alt?: string
  author?: string
  label?: string // e.g. "Promotional feature"
  category?: string
  read_minutes?: number
  url: string
}

export interface Film {
  id: string
  title: string
  duration: string
  image: Image
  alt: string
  url: string
}

export interface ExploreCard {
  name: string
  image: Image
  alt: string
  url: string
}

// ── pages ──────────────────────────────────────────────────────────────

export interface HomePage {
  hero: { title: string; subtitle: string; image: Image; alt: string; cta: Link }
  explore: ExploreCard[]
  destinations: Destination[]
  stories: Article[]
  films: Film[]
}

/** Discovery is an ordered list of blocks — maps to a Directus M2A "page builder" field. */
export type DiscoveryBlock =
  | { type: 'venues'; id: string; title: string; description?: string; label: string; items: Venue[] }
  | { type: 'features'; id: string; title: string; more: Link; items: Article[] }
  | { type: 'destinations'; id: string; title: string; label: string; items: Destination[] }
  | { type: 'promos'; id: string; collection: { title: string; text: string; image: Image; url: string }; signup: { title: string; text: string; image: Image } }

export interface DiscoveryPage {
  hero: { title: string; subtitle: string; image: Image }
  blocks: DiscoveryBlock[]
}

/** Venue (establishment) detail page. `description` is rich-text HTML from Directus. */
export interface VenueDetail extends Venue {
  description: string
  gallery: Image[]
  address?: string
  map?: { lat: number; lng: number }
  placeId?: string // Google place id: map pin + Key Information
  price?: string // full line, e.g. "Average price per person $66"
  hours?: string[] // one line per day (or one summary line)
  phone?: string
  website?: string
  keyInfoSource?: 'google' // credit Google under Key Information
}

export interface VenuePage {
  venue: VenueDetail
  nearby: Venue[]
}

export interface StoriesPage {
  lead: Article
  stories: Article[]
  discovery: Article[]
  guides: Article[]
  best: { feature: Article; items: Article[] }
  taxonomy: { featuredTags: Link[]; archive: Link[]; categories: Link[]; authors: Link[] }
}
