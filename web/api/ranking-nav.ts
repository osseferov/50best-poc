import { getRankingNav } from '../server/content.js'
import { handle } from '../server/http.js'

export const GET = (request: Request) => handle(request, [], () => getRankingNav())
