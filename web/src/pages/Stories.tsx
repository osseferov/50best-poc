import { useLoaderData } from 'react-router'
import type { Link, StoriesPage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Crumbs, IfeatHead, SignupCTA } from '../components/blocks'
import { ArticleCard } from '../components/cards'
import { useSignIn } from '../components/SignIn'
import { BookmarkSlim } from '../components/icons'

const STORIES_MORE = 'https://www.the50.com/stories/categories/News'
const more = (url: string): Link => ({ label: 'View more', url })
const LinkList = ({ items }: { items: Link[] }) => <ul>{items.map((l) => <li key={l.url}><a href={l.url}>{l.label}</a></li>)}</ul>

export default function Stories() {
  const { lead, stories, discovery, guides, best, taxonomy } = useLoaderData() as StoriesPage
  const signIn = useSignIn()
  return (
    <>
      <title>Stories | The 50</title>
      <meta name="description" content="Inspiration, guides and news from The 50's global community of chefs, bartenders, writers and hoteliers." />
      <Nav search />
      <main id="content">
        <div className="pagehead"><Crumbs label="Stories" to="/stories" /></div>

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

        <section className="sgrid sgrid--list">
          <IfeatHead title="Stories" more={more(STORIES_MORE)} />
          <div className="sgrid__wrap">{stories.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
          <a className="sgrid__more" href={STORIES_MORE}>View more</a>
        </section>

        <SignupCTA />

        <section className="ifeat sfive">
          <div className="ifeat__inner">
            <IfeatHead title="Discovery" more={more('https://www.the50.com/stories/tags/Discovery')} />
            <div className="sfive__wrap">{discovery.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          </div>
        </section>

        <section className="sgrid sfive">
          <IfeatHead title="Destination guides" more={more('https://www.the50.com/stories/tags/Destination+guides')} />
          <div className="sfive__wrap">{guides.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
        </section>

        <section className="sgrid sbest">
          <IfeatHead title="Best of the Best" more={more('https://www.the50.com/stories/tags/Best+of+the+Best')} />
          <div className="sbest__grid">
            <article className="sbest__card">
              <a className="sbest__media" href={best.feature.url}><img src={imageUrl(best.feature.image, 1200)} alt={best.feature.alt} loading="lazy" /></a>
              <h3 className="sbest__title"><a href={best.feature.url}>{best.feature.title}</a></h3>
              <p className="sbest__label">{best.feature.label}</p>
            </article>
            {best.items.map((a) => <ArticleCard key={a.id} a={a} light />)}
          </div>
        </section>

        <nav className="taxo" aria-label="Browse stories">
          <div className="taxo__featured">
            <p className="taxo__featured-label">Featured Tags</p>
            <ul className="taxo__chips">{taxonomy.featuredTags.map((l) => <li key={l.url}><a href={l.url}>{l.label}</a></li>)}</ul>
          </div>
          <div className="taxo__inner">
            <div className="taxo__col"><h3 className="taxo__heading">Archive</h3><LinkList items={taxonomy.archive} /></div>
            <div className="taxo__col"><h3 className="taxo__heading">Categories</h3><LinkList items={taxonomy.categories} /></div>
            <div className="taxo__col"><h3 className="taxo__heading">Featured Tags</h3><LinkList items={taxonomy.featuredTags} /></div>
            <div className="taxo__col"><h3 className="taxo__heading">Authors</h3><LinkList items={taxonomy.authors} /></div>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  )
}
