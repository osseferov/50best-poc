import { getCategoryStories } from '../server/content.js'
import { handle, intParam, labelParam } from '../server/http.js'

export const GET = (request: Request) =>
  handle(request, ['category', 'offset'], (url) => getCategoryStories(labelParam(url, 'category'), intParam(url, 'offset', 100_000)))
