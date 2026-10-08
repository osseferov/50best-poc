// Self-check for the Places → Key Information mapping. Run (in web/): node --experimental-strip-types scripts/places.check.ts
import assert from 'node:assert/strict'
import { formatPrice, toKeyInfo } from '../src/lib/places.ts'

const usd = (units: string) => ({ currencyCode: 'USD', units })
assert.equal(formatPrice({ priceRange: { startPrice: usd('50'), endPrice: usd('100') } }), 'Price per person $50–100')
assert.equal(formatPrice({ priceRange: { startPrice: { currencyCode: 'GBP', units: '30' }, endPrice: { currencyCode: 'GBP', units: '40' } } }), 'Price per person £30–40')
assert.equal(formatPrice({ priceRange: { startPrice: usd('100') } }), 'Price per person $100+')
assert.equal(formatPrice({ priceLevel: 'PRICE_LEVEL_EXPENSIVE' }), 'Price $$$')
assert.equal(formatPrice({ priceLevel: 'PRICE_LEVEL_UNSPECIFIED' }), undefined)
assert.deepEqual(toKeyInfo({ regularOpeningHours: { weekdayDescriptions: ['Monday: Closed'] }, websiteUri: 'https://x.mx/' }),
  { price: undefined, hours: ['Monday: Closed'], phone: undefined, website: 'https://x.mx/' })
console.log('places.check ok')
