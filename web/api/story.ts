import { getStory } from '../server/content.js'
import { handle, slugParam } from '../server/http.js'

export const GET = (request: Request) => handle(request, ['slug'], (url) => getStory(slugParam(url, 'slug')))
