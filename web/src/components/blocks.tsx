import { Fragment } from 'react'
import { SmartLink } from './SmartLink'
import { useSignIn } from './SignIn'
import { ArrowLong, ArrowShort } from './icons'
import type { Article, Film, Link, Partner, StoriesPage } from '../types'
import { Rail } from './Rail'
import { ArticleCard, FilmCard } from './cards'
import { KALEIDOSCOPE_SVG } from './kaleidoscope'
import { imageUrl } from '../lib/image'

const LOGO = 'https://www.the50.com/filestore/svg/the-50-logo-white.svg'

/** Homepage section head: serif title, "view all" link, subtitle. */
export function SecHead({ title, more, sub }: { title: string; more: Link; sub: string }) {
  return (
    <div className="sec-head">
      <div className="sec-title-row">
        <h2 className="sec-title">{title}</h2>
        <SmartLink className="viewall" href={more.url}>{more.label}<ArrowShort /></SmartLink>
      </div>
      <p className="sec-sub">{sub}</p>
    </div>
  )
}

/** Discovery / Stories head: title + "View more" arrow. */
export function IfeatHead({ title, more }: { title: string; more: Link }) {
  return (
    <div className="ifeat__head">
      <h2 className="ifeat__title">{title}</h2>
      <SmartLink className="ifeat__more" href={more.url}>{more.label} <ArrowLong /></SmartLink>
    </div>
  )
}

export function Crumbs({ trail }: { trail: Link[] }) {
  return (
    <p className="crumbs">
      <SmartLink href="/">Home</SmartLink><span aria-hidden="true">/</span>
      {trail.map((c) => <Fragment key={c.label}><SmartLink href={c.url}>{c.label}</SmartLink><span aria-hidden="true">/</span></Fragment>)}
    </p>
  )
}

/** Discovery row head: eyebrow + serif title + description. */
export function RowTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rowtitle">
      <p className="rowtitle__type">Explore</p>
      <div className="rowtitle__head"><h2>{title}</h2></div>
      {description && <p className="rowtitle__desc">{description}</p>}
    </div>
  )
}

export function SignupCTA() {
  const signIn = useSignIn()
  return (
    <section className="signup">
      <div className="signup__inner">
        <span className="signup__rule" aria-hidden="true" />
        <img className="signup__logo" src={LOGO} alt="The 50" height={72} />
        <div className="signup__content">
          <h2 className="signup__title">Sign up to discover more</h2>
          <ul className="signup__benefits">
            {['Save top venues and articles', 'Create and share your own lists', 'Receive our weekly newsletter'].map((b) => (
              <li className="signup__benefit" key={b}><span className="signup__plus" aria-hidden="true">+</span>{b}</li>
            ))}
          </ul>
        </div>
        <button className="btn btn--on-black signup__btn" type="button" onClick={signIn}>Register</button>
      </div>
    </section>
  )
}

const LinkList = ({ items }: { items: Link[] }) => <ul>{items.map((l) => <li key={l.label}><a href={l.url}>{l.label}</a></li>)}</ul>

/** Stories footer nav: featured tags + archive / categories / tags / authors. */
export function Taxonomy({ taxonomy }: { taxonomy: StoriesPage['taxonomy'] }) {
  return (
    <nav className="taxo" aria-label="Browse stories">
      <div className="taxo__featured">
        <p className="taxo__featured-label">Featured Tags</p>
        <ul className="taxo__chips">{taxonomy.featuredTags.map((l) => <li key={l.label}><a href={l.url}>{l.label}</a></li>)}</ul>
      </div>
      <div className="taxo__inner">
        <div className="taxo__col"><h3 className="taxo__heading">Archive</h3><LinkList items={taxonomy.archive} /></div>
        <div className="taxo__col"><h3 className="taxo__heading">Categories</h3><LinkList items={taxonomy.categories} /></div>
        <div className="taxo__col"><h3 className="taxo__heading">Featured Tags</h3><LinkList items={taxonomy.featuredTags} /></div>
        <div className="taxo__col"><h3 className="taxo__heading">Authors</h3><LinkList items={taxonomy.authors} /></div>
      </div>
    </nav>
  )
}

/** Black "Films" band with the kaleidoscope rule (homepage + ranking landing). */
export function FilmsSection({ films }: { films: Film[] }) {
  return (
    <section className="films on-black">
      <div className="films__inner">
        <span className="films__rule" aria-hidden="true" dangerouslySetInnerHTML={{ __html: KALEIDOSCOPE_SVG }} />
        <div className="films__content">
          <SecHead title="Films" more={{ label: 'Watch more', url: '#' }} sub="Discover the people and places shaping the world's best hospitality." />
          <div className="films__curated">
            <Rail label="films" arrows="chevron">{films.map((f) => <FilmCard key={f.id} f={f} />)}</Rail>
          </div>
          <a className="btn btn--on-black btn-stacked" href="#">Watch more</a>
        </div>
      </div>
    </section>
  )
}

/** Ranking landing "Stories": 48px uppercase head + "View all articles", 4-column cards. */
export function StoriesFeed({ stories }: { stories: Article[] }) {
  if (!stories.length) return null
  return (
    <section className="sfeed">
      <div className="sfeed__head">
        <h2 className="sfeed__title">Stories</h2>
        <SmartLink className="sfeed__more" href="/stories">View all articles <ArrowShort /></SmartLink>
      </div>
      <div className="sfeed__grid">{stories.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
    </section>
  )
}

/** "Our Partners" logo wall (static for now). */
export function Partners({ partners }: { partners: Partner[] }) {
  return (
    <section className="partners">
      <div className="partners__head">
        <h2 className="partners__title">Our Partners</h2>
        <a className="partners__more" href="#">Become a partner</a>
      </div>
      <div className="partners__logos">
        {partners.map((p) => <a key={p.name} href="#"><img src={imageUrl(p.logo)} alt={p.name} width={140} height={100} loading="lazy" /></a>)}
      </div>
    </section>
  )
}
