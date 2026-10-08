// Self-check for the Places → Key Information mapping. Run (in web/): node --experimental-strip-types scripts/places.check.ts
import assert from 'node:assert/strict'
import { formatHours, formatPrice, toKeyInfo } from '../src/lib/places.ts'

const usd = (units: string) => ({ currencyCode: 'USD', units })
assert.equal(formatPrice({ priceRange: { startPrice: usd('50'), endPrice: usd('100') } }), 'Price per person $50–100')
assert.equal(formatPrice({ priceRange: { startPrice: { currencyCode: 'GBP', units: '30' }, endPrice: { currencyCode: 'GBP', units: '40' } } }), 'Price per person £30–40')
assert.equal(formatPrice({ priceRange: { startPrice: usd('100') } }), 'Price per person $100+')
assert.equal(formatPrice({ priceLevel: 'PRICE_LEVEL_EXPENSIVE' }), 'Price $$$')
assert.equal(formatPrice({ priceLevel: 'PRICE_LEVEL_UNSPECIFIED' }), undefined)
// hours: build periods from [day, openHour, closeHour] (day 0 = Sun; closeHour < openHour = past midnight)
const week = (...d: [number, number, number][]) =>
  ({ regularOpeningHours: { periods: d.map(([day, o, c]) => ({ open: { day, hour: o }, close: { day: c <= o ? (day + 1) % 7 : day, hour: c } })) } })
const all = (o: number, c: number) => [0, 1, 2, 3, 4, 5, 6].map((d) => [d, o, c] as [number, number, number])

assert.deepEqual(formatHours(week(...all(12, 20)), 'Restaurant'), ['Lunch: Mon – Sun']) // Contramar, real Google data
assert.deepEqual(formatHours(week(...all(12, 22)), 'Restaurant'), ['Lunch and dinner: Mon – Sun']) // Rolf's
assert.deepEqual(formatHours(week(...all(14, 0)), 'Bar'), ['Afternoon and evening: Mon – Sun'])
assert.deepEqual(formatHours(week(...all(18, 2).filter(([d]) => d !== 0)), 'Bar'), ['Evening: Mon – Sat']) // closed Sun
assert.deepEqual( // split lunch/dinner service, Sun lunch only, Mon closed
  formatHours(week(...[2, 3, 4, 5, 6].flatMap((d) => [[d, 12, 15], [d, 19, 23]] as [number, number, number][]), [0, 12, 16]), 'Restaurant'),
  ['Lunch and dinner: Tue – Sat', 'Lunch: Sun'])
assert.deepEqual(formatHours(week([1, 8, 23], [3, 8, 23], [4, 8, 23]), 'Restaurant'), ['Breakfast, lunch and dinner: Mon, Wed – Thu'])
assert.deepEqual(formatHours({ regularOpeningHours: { periods: [{ open: { day: 0, hour: 0 } }] } }, 'Hotel'), ['Morning, afternoon and evening: Mon – Sun']) // 24/7
assert.equal(formatHours({}, 'Bar'), undefined)

assert.deepEqual(toKeyInfo({ websiteUri: 'https://x.mx/' }, 'Restaurant'),
  { price: undefined, hours: undefined, phone: undefined, website: 'https://x.mx/' })
console.log('places.check ok')
