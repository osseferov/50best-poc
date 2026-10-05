import type { Article, Destination, ExploreCard as Explore, Film, Venue } from '../types'
import { imageUrl } from '../lib/image'
import { SmartLink } from './SmartLink'
import { useSignIn } from './SignIn'
import { AddToList, ArrowCard, Bookmark, BookmarkSlim, Heart, Play } from './icons'

const GEM = 'https://www.the50.com/filestore/svg/disco-gemstone-logo.svg'
const CARD_W = 640

// ── homepage ───────────────────────────────────────────────────────────

export function ExploreCard({ c }: { c: Explore }) {
  return (
    <SmartLink className={`ecard ecard--${c.name.toLowerCase()}`} href={c.url}>
      <span className="ecard__media"><img src={imageUrl(c.image, 800)} alt={c.alt} loading="lazy" /></span>
      <span className="ecard__body">
        <span className="ecard__text">
          <span className="ecard__eyebrow">Explore</span>
          <span className="ecard__name">{c.name}</span>
        </span>
        <span className="ecard__arrow"><ArrowCard /></span>
      </span>
      <span className="ecard__divider" aria-hidden="true" />
    </SmartLink>
  )
}

export function DestinationCard({ d }: { d: Destination }) {
  return (
    <SmartLink className="dcard" href={d.url}>
      <img src={imageUrl(d.image, CARD_W)} alt={d.alt ?? d.name} loading="lazy" />
      <span className="dcard__name">{d.name}</span>
    </SmartLink>
  )
}

export function StoryCard({ a }: { a: Article }) {
  const signIn = useSignIn()
  return (
    <article className="scard">
      <SmartLink className="scard__media" href={a.url}><img src={imageUrl(a.image, 800)} alt={a.alt ?? ''} loading="lazy" /></SmartLink>
      <div className="scard__body">
        <h3 className="scard__title"><SmartLink href={a.url}>{a.title}</SmartLink></h3>
        <div className="scard__meta">
          <p className="byline">{`${a.category} · ${a.read_minutes} min read`}</p>
          <button className="save" aria-pressed="false" aria-label="Save this article to your shortlist" onClick={signIn}><Bookmark /></button>
        </div>
      </div>
    </article>
  )
}

export function FilmCard({ f }: { f: Film }) {
  return (
    <SmartLink className="fcard" href={f.url}>
      <span className="fcard__media">
        <img src={imageUrl(f.image, CARD_W)} alt={f.alt} loading="lazy" />
        <span className="fcard__play" aria-hidden="true"><Play /></span>
      </span>
      <span className="fcard__title">{f.title}</span>
      <span className="fcard__meta">{f.duration}</span>
    </SmartLink>
  )
}

// ── discovery / stories ────────────────────────────────────────────────

export function VenueCard({ v }: { v: Venue }) {
  const signIn = useSignIn()
  return (
    <article className="vcard">
      <a className="vcard__media" href={v.url}>
        <img src={imageUrl(v.image, CARD_W)} alt={v.name} loading="lazy" />
        {v.gem && <img className="vcard__gem" src={GEM} alt="The 50" />}
      </a>
      <div className="vcard__contents">
        <div className="vcard__top">
          <p className="vcard__tag">{v.type}</p>
          <div className="vcard__actions">
            <button className="vcard__act" type="button" aria-label={`Add ${v.name} to a list`} onClick={signIn}><AddToList /></button>
            <button className="vcard__act save" aria-pressed="false" aria-label={`Save ${v.name}`} onClick={signIn}><Heart /></button>
          </div>
        </div>
        <div className="vcard__bottom">
          <h3 className="vcard__name"><a href={v.url}>{v.name}</a></h3>
          <p className="vcard__place">{`${v.city}, ${v.country}`}</p>
          <p className="vcard__style">{v.style}</p>
        </div>
      </div>
    </article>
  )
}

export function CityCard({ d }: { d: Destination }) {
  return (
    <SmartLink className="ccard" href={d.url}>
      <img src={imageUrl(d.image, CARD_W)} alt={d.alt ?? d.name} loading="lazy" />
      <span className="ccard__name">{d.name}</span>
      {d.description && <span className="ccard__desc">{d.description}</span>}
    </SmartLink>
  )
}

/** `light` = white-ground variant (Stories grids); default sits on the black band. */
export function ArticleCard({ a, light = false }: { a: Article; light?: boolean }) {
  const signIn = useSignIn()
  return (
    <article className={light ? 'icard icard--light' : 'icard'}>
      <SmartLink className="icard__media" href={a.url}><img src={imageUrl(a.image, CARD_W)} alt={a.alt ?? ''} loading="lazy" /></SmartLink>
      <div className="icard__text">
        {a.label && <p className="icard__label">{a.label}</p>}
        <h3 className="icard__title"><SmartLink href={a.url}>{a.title}</SmartLink></h3>
      </div>
      <div className="icard__foot">
        <p className="icard__author">{a.author}</p>
        <button className="icard__save save" aria-pressed="false" aria-label="Save article" onClick={signIn}><BookmarkSlim /></button>
      </div>
    </article>
  )
}
