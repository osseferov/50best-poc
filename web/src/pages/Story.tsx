import { useRef, useState } from 'react'
import { useLoaderData } from 'react-router'
import type { Article, StoryPage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SmartLink } from '../components/SmartLink'
import { Crumbs, SignupCTA, Taxonomy } from '../components/blocks'
import { useSignIn } from '../components/SignIn'
import { BookmarkSlim, ChevronLeft, ChevronRight } from '../components/icons'

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB') // 05/10/2026, as on the live site
const GEM = 'https://www.the50.com/filestore/svg/disco-gemstone-logo.svg'

/** Editors drop `<a href="#register">` into the body (see the in-article sign-up box) — open the sign-in popup instead of jumping. */
const isRegisterLink = (t: EventTarget) => t instanceof Element && t.closest('a[href="#register"]')

/**
 * "Discover More" — after the live site's recommendation widget: the leftmost card is "active", a black bar
 * fills along its bottom (2s), and the moment it's full the row advances one card and loops. Pauses on hover; off for reduced motion.
 */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function DiscoverMore({ items }: { items: Article[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const animated = items.length > 1 && !reducedMotion()

  const go = (i: number) => {
    const n = items.length, idx = (i + n) % n
    setActive(idx)
    const t = track.current, card = t?.children[idx] as HTMLElement | undefined
    if (t && card) t.scrollTo({ left: card.offsetLeft - (t.children[0] as HTMLElement).offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="dmore" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <h2 className="dmore__title">Discover More</h2>
      <p className="dmore__desc">Explore a selection of related articles and videos below</p>
      <div className="dmore__main">
        <div ref={track} className="dmore__track">
          {items.map((a, i) => (
            <SmartLink key={a.id} className="dmore__card" href={a.url}>
              <span className="dmore__media">
                {a.image && <img src={imageUrl(a.image, 640)} alt={a.alt ?? ''} loading="lazy" />}
                <span className="dmore__badge">Article</span>
              </span>
              <span className="dmore__name">{a.title}</span>
              <span className="dmore__source"><img src={GEM} alt="" />The 50 Stories<span className="dmore__sep" /></span>
              <span className="dmore__progress">
                {/* remounts per activation so the fill restarts; frozen while paused; advancing is driven by the fill ending */}
                {i === active && animated && (
                  <span key={active} className="dmore__bar" style={{ animationPlayState: paused ? 'paused' : 'running' }} onAnimationEnd={() => go(active + 1)} />
                )}
              </span>
            </SmartLink>
          ))}
        </div>
        {items.length > 2 && (
          <>
            <button className="dmore__btn dmore__btn--prev" type="button" aria-label="Previous stories" onClick={() => go(active - 1)}><ChevronLeft /></button>
            <button className="dmore__btn dmore__btn--next" type="button" aria-label="Next stories" onClick={() => go(active + 1)}><ChevronRight /></button>
          </>
        )}
      </div>
    </section>
  )
}

export default function Story() {
  const { story: s, related, taxonomy } = useLoaderData() as StoryPage
  const signIn = useSignIn()
  return (
    <>
      <title>{`${s.title} | The 50`}</title>
      {s.subtitle && <meta name="description" content={s.subtitle} />}
      <Nav search />
      <main id="content">
        <div className="pagehead"><Crumbs trail={[{ label: 'Stories', url: '/stories' }]} /></div>

        <article className="story">
          <header className="story__lead">
            <h1 className="story__title">{s.title}</h1>
            <div className="story__meta">
              {(s.author || s.date) && (
                <p className="story__byline">
                  {s.author && <a href="#">{s.author}</a>}
                  {s.author && s.date && ' - '}
                  {s.date && date(s.date)}
                </p>
              )}
              <button className="story__save" type="button" onClick={signIn}><BookmarkSlim />Add to saved articles</button>
            </div>
            {s.image && <img className="story__image" src={imageUrl(s.image, 2000)} alt={s.title} />}
          </header>

          <div
            className="story__body"
            onClick={(e) => { if (isRegisterLink(e.target)) { e.preventDefault(); signIn() } }}
            dangerouslySetInnerHTML={{ __html: s.body }}
          />

          {related.length > 0 && <DiscoverMore items={related} />}

          {s.tags.length > 0 && (
            <div className="story__tags">
              <p className="story__tags-title">Tags</p>
              {s.tags.map((t) => <a key={t} href="#">{t}</a>)}
            </div>
          )}
        </article>

        <SignupCTA />
        <Taxonomy taxonomy={taxonomy} />
      </main>
      <Footer />
    </>
  )
}
