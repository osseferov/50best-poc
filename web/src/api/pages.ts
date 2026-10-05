/**
 * The only place pages get content from. Each route loader calls one of these.
 * Today they return bundled mock data; when the Directus schema lands, replace the
 * body with `directus<…>('/items/…', { fields: … })` calls and map to the same types —
 * components never change.
 */
import type { DiscoveryPage, HomePage, StoriesPage } from '../types'
import { home } from '../data/home'
import { discovery } from '../data/discovery'
import { stories } from '../data/stories'

export async function getHomePage(): Promise<HomePage> {
  return home
}

export async function getDiscoveryPage(): Promise<DiscoveryPage> {
  return discovery
}

export async function getStoriesPage(): Promise<StoriesPage> {
  return stories
}
