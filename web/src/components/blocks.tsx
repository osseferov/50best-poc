import { Fragment } from 'react'
import { SmartLink } from './SmartLink'
import { useSignIn } from './SignIn'
import { ArrowLong, ArrowShort } from './icons'
import type { Link, StoriesPage } from '../types'

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
