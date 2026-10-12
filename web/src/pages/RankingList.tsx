import { useLoaderData, useParams } from 'react-router'
import type { RankingPage } from '../types'
import { SECTION_LABEL } from '../api/pages'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SmartLink } from '../components/SmartLink'
import { Crumbs, Partners, SignupCTA } from '../components/blocks'
import { useSignIn } from '../components/SignIn'
import { AddToList, Heart } from '../components/icons'

export const RANGES = { '1-50': [1, 50], '51-100': [51, 100] } as const

/** Ranked list — matched to the50.com/bars/best-in-the-world/list/1-50: title, range tabs, venue cards counting down. */
export default function RankingList() {
  const { ranking: r, entries, partners } = useLoaderData() as RankingPage
  const range = useParams().range as keyof typeof RANGES
  const [from, to] = RANGES[range]
  const base = `/${r.section}/${r.slug}`
  const shown = entries.filter((e) => e.place >= from && e.place <= to).reverse() // live counts down: 50 → 1
  const signIn = useSignIn()
  return (
    <>
      <title>{`${r.title}: ${range} | The 50`}</title>
      <Nav />
      <main id="content">
        <div className="pagehead">
          <Crumbs trail={[{ label: SECTION_LABEL[r.section], url: '#' }, { label: r.title, url: base }, { label: `Lists : ${range}`, url: `${base}/list/${range}` }]} />
        </div>
        <section className="rlist">
          <h1 className="rlist__title">{r.title}</h1>
          <ul className="rlist__tabs">
            {Object.keys(RANGES).map((k) => (
              <li key={k}><SmartLink className={k === range ? 'is-active' : undefined} href={`${base}/list/${k}`}>{k}</SmartLink></li>
            ))}
          </ul>
          {shown.length ? (
            <div className="rlist__grid">
              {shown.map(({ place, venue: v }) => (
                <article key={v.id} className="vcard rcard">
                  <SmartLink className="vcard__media" href={v.url}>{v.image && <img src={imageUrl(v.image, 640)} alt={v.name} loading="lazy" />}</SmartLink>
                  <div className="vcard__contents">
                    <div className="vcard__top">
                      <p className="rcard__rank">{place}</p>
                      <div className="vcard__actions">
                        <button className="vcard__act" type="button" aria-label={`Add ${v.name} to a list`} onClick={signIn}><AddToList /></button>
                        <button className="vcard__act save" aria-pressed="false" aria-label={`Save ${v.name}`} onClick={signIn}><Heart /></button>
                      </div>
                    </div>
                    <div className="vcard__bottom">
                      <h3 className="vcard__name"><SmartLink href={v.url}>{v.name}</SmartLink></h3>
                      <p className="vcard__place">{v.city}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rlist__empty">{`No ${SECTION_LABEL[r.section].toLowerCase()} ranked ${range} yet.`}</p>
          )}
        </section>
        <SignupCTA />
        <Partners partners={partners} />
      </main>
      <Footer />
    </>
  )
}
