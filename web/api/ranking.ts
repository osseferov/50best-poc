import { getRanking, SECTIONS } from '../server/content.js'
import { enumParam, handle, slugParam } from '../server/http.js'

export const GET = (request: Request) =>
  handle(request, ['section', 'slug'], (url) => getRanking(enumParam(url, 'section', SECTIONS), slugParam(url, 'slug')))
