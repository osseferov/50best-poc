import { useLoaderData } from 'react-router'
import type { RankingPage } from '../types'
import { SECTION_LABEL } from '../api/pages'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SmartLink } from '../components/SmartLink'
import { Crumbs, FilmsSection, Partners, StoriesFeed } from '../components/blocks'

/** Ranking landing — matched to the50.com/bars/best-in-the-world/: hero → top-9 grid → films → stories → partners. */
export default function Ranking() {
  const { ranking: r, entries, stories, films, partners } = useLoaderData() as RankingPage
  const base = `/${r.section}/${r.slug}`
  const label = SECTION_LABEL[r.section]
  return (
    <>
      <title>{`${r.title} | ${label} | The 50`}</title>
      <Nav />
      <main id="content">
        <div className="pagehead"><Crumbs trail={[{ label, url: '#' }, { label: r.title, url: base }]} /></div>

        <section className="rlead">
          <SmartLink className="rlead__hero" href={`${base}/list/1-50`}>
            {r.image ? <img src={imageUrl(r.image, 1400)} alt={r.title} /> : <span className="rlead__noimg" />}
            <span className="rlead__text">
              <h1 className="rlead__title">{r.title}</h1>
              <p className="rlead__sub">{`Discover the ${label.toLowerCase()} voted into the 1-50 list`}</p>
            </span>
          </SmartLink>
          <hr className="rlead__rule" />
          {entries.length > 0 && (
            <div className="rlead__grid">
              {entries.slice(0, 9).map(({ place, venue: v }) => (
                <SmartLink key={v.id} className="rlead__item" href={v.url}>
                  <span className="rlead__media">{v.image && <img src={imageUrl(v.image, 800)} alt={v.name} loading="lazy" />}</span>
                  <h2 className="rlead__name">{v.name}</h2>
                  <p className="rlead__caption">{`No. ${place}, ${r.title}`}</p>
                </SmartLink>
              ))}
            </div>
          )}
        </section>

        <FilmsSection films={films} />
        <StoriesFeed stories={stories} />
        <Partners partners={partners} />
      </main>
      <Footer />
    </>
  )
}
