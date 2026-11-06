/** Input validators for server functions: the browser may only send these narrow shapes, never fields/filters/collections. */

const SLUG = /^[A-Za-z0-9_-]{1,200}$/
const LABEL = /^[\p{L}\p{N} _-]{1,100}$/u

/** Slug or numeric id. */
export function slug(v: unknown): string {
  if (typeof v !== 'string' || !SLUG.test(v)) throw new Error('invalid slug')
  return v
}

/** Human label such as a category slug or name ("News"). */
export function label(v: unknown): string {
  if (typeof v !== 'string' || !LABEL.test(v)) throw new Error('invalid label')
  return v
}

export function offset(v: unknown, max = 100_000): number {
  if (v === undefined || v === null) return 0
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > max) throw new Error('invalid offset')
  return v
}

export function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T {
  if (typeof v !== 'string' || !allowed.includes(v as T)) throw new Error('invalid value')
  return v as T
}
