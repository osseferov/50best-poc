import { useLoaderData } from 'react-router'
import type { Article, Link, StoriesPage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Crumbs, IfeatHead, SignupCTA, Taxonomy } from '../components/blocks'
import { ArticleCard } from '../components/cards'
import { SmartLink } from '../components/SmartLink'
import { useSignIn } from '../components/SignIn'
import { BookmarkSlim } from '../components/icons'

const more = (url: string): Link => ({ label: 'View more', url })
/** The "Stories" list grid — shared by the Directus block and the static one below it. */
const STORIES_MORE = '/stories/categories/News'
const StoriesGrid = ({ items }: { items: Article[] }) => (
  <section className="sgrid sgrid--list">
    <IfeatHead title="Stories" more={more(STORIES_MORE)} />
    <div className="sgrid__wrap">{items.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
    <SmartLink className="sgrid__more" href={STORIES_MORE}>View more</SmartLink>
  </section>
)

export default function Stories() {
  const { lead, latest, stories, discovery, guides, best, taxonomy } = useLoaderData() as StoriesPage
  const signIn = useSignIn()
  return (
    <>
      <title>Stories | The 50</title>
      <meta name="description" content="Inspiration, guides and news from The 50's global community of chefs, bartenders, writers and hoteliers." />
      <Nav search />
      <main id="content">
        <div className="pagehead"><Crumbs trail={[{ label: 'Stories', url: '/stories' }]} /></div>

        <section className="slead">
          <article className="slead__card">
            <a className="slead__media" href={lead.url}><img src={imageUrl(lead.image, 1400)} alt={lead.alt} /></a>
            <div className="slead__text">
              <a className="slead__link" href={lead.url}>
                <h2 className="slead__title">{lead.title}</h2>
                <p className="slead__desc">{lead.description}</p>
              </a>
              <div className="slead__meta">
                <p className="slead__author">{lead.author}</p>
                <button className="slead__save save" aria-pressed="false" aria-label="Save article" onClick={signIn}><BookmarkSlim /></button>
              </div>
            </div>
          </article>
          <hr className="slead__rule" />
        </section>

        {latest?.length ? <StoriesGrid items={latest} /> : null}
        {/* Static Stories grid — replaced by the Directus block above (getLatestStories). Kept for reference.
        <StoriesGrid items={stories} />
        */}

        <SignupCTA />

        <section className="ifeat sfive">
          <div className="ifeat__inner">
            <IfeatHead title="Discovery" more={more('#')} />
            <div className="sfive__wrap">{discovery.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          </div>
        </section>

        <section className="sgrid sfive">
          <IfeatHead title="Destination guides" more={more('#')} />
          <div className="sfive__wrap">{guides.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
        </section>

        <section className="sgrid sbest">
          <IfeatHead title="Best of the Best" more={more('#')} />
          <div className="sbest__grid">
            <article className="sbest__card">
              <a className="sbest__media" href={best.feature.url}><img src={imageUrl(best.feature.image, 1200)} alt={best.feature.alt} loading="lazy" /></a>
              <h3 className="sbest__title"><a href={best.feature.url}>{best.feature.title}</a></h3>
              <p className="sbest__label">{best.feature.label}</p>
            </article>
            {best.items.map((a) => <ArticleCard key={a.id} a={a} light />)}
          </div>
        </section>

        <Taxonomy taxonomy={taxonomy} />
      </main>
      <Footer />
    </>
  )
}
