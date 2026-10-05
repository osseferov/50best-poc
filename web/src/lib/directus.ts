const URL = import.meta.env.VITE_DIRECTUS_URL as string | undefined
const TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined

/** GET a Directus REST path, e.g. directus('/items/venues', { fields: '*,image.*', limit: '8' }). Returns `data`. */
export async function directus<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const res = await fetch(`${URL}${path}?${new URLSearchParams(params)}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
  })
  if (!res.ok) throw new Error(`Directus ${res.status} on ${path}`)
  return (await res.json()).data as T
}
