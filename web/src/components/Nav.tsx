import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useRouteLoaderData } from 'react-router'
import type { RankingNavItem, RankingSection } from '../types'
import { useSignIn } from './SignIn'
import { Burger, ChevronRight, Close, MenuChevron, Search } from './icons'

const LOGO = 'https://www.the50.com/filestore/svg/the-50-logo-white.svg'
const LINKS: { name: string; to: string; section?: RankingSection }[] = [
  { name: 'Restaurants', to: '#', section: 'restaurants' },
  { name: 'Bars', to: '#', section: 'bars' },
  { name: 'Hotels', to: '#', section: 'hotels' },
  { name: 'Vineyards', to: '#', section: 'vineyards' },
  { name: 'Discovery', to: '/discovery' },
  { name: 'Stories', to: '/stories' },
  { name: 'Films', to: '#' },
  { name: 'About', to: '#' },
]
const MENU_GROUPS = [['Restaurants', 'Bars', 'Hotels', 'Vineyards'], ['Discovery', 'Stories'], ['About']]

const LISTS = ['1-50', '51-100']

export const Wordmark = () => (
  <Link className="wordmark" to="/" aria-label="The 50 — home"><img className="wordmark__logo" src={LOGO} alt="The 50" height={48} /></Link>
)

function Item({ name, to, className, children }: { name: string; to: string; className: string; children?: React.ReactNode }) {
  return to.startsWith('/')
    ? <NavLink className={className} to={to}>{children ?? name}</NavLink>
    : <a className={className} href={to}>{children ?? name}</a>
}

export function Nav({ search = false }: { search?: boolean }) {
  const [open, setOpen] = useState(false)
  const signIn = useSignIn()
  const { pathname } = useLocation()
  // Directus published rankings → the Restaurants / Bars / Hotels / Vineyards dropdowns (2 levels: ranking → lists)
  const rankings = (useRouteLoaderData('root') as RankingNavItem[] | undefined) ?? []
  const inSection = (s?: RankingSection) => rankings.filter((r) => r.section === s)
  const [mega, setMega] = useState<RankingSection | null>(null)
  const [hot, setHot] = useState(0) // highlighted ranking in the open dropdown
  const [expanded, setExpanded] = useState<RankingSection | null>(null) // mobile accordion
  const openMega = (s: RankingSection) => { if (inSection(s).length) { setMega(s); setHot(0) } }
  const megaItems = inSection(mega ?? undefined)
  const hotItem = megaItems[hot] ?? megaItems[0]

  useEffect(() => { setOpen(false); setMega(null) }, [pathname])
  useEffect(() => {
    if (!mega) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mega])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onResize = () => window.innerWidth > 920 && setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  return (
    <header className="nav" data-open={open} onMouseLeave={() => setMega(null)}>
      <div className="nav__inner">
        <div className="nav__stack">
          <div className="nav__top">
            <Wordmark />
            <div className="nav__auth">
              <button className="link" type="button" onClick={signIn}>Sign in</button>
              <button className="link btn-fill" type="button">Register</button>
            </div>
          </div>

          <div className="nav__bar">
            <nav aria-label="Primary">
              <ul className="nav__list">
                {LINKS.map((l) => (
                  <li key={l.name}>
                    {l.section ? (
                      // section items only open the dropdown — they aren't pages
                      <button
                        className="nav__link"
                        type="button"
                        aria-expanded={mega === l.section}
                        aria-haspopup={inSection(l.section).length > 0 || undefined}
                        onMouseEnter={() => openMega(l.section!)}
                        onClick={() => (mega === l.section ? setMega(null) : openMega(l.section!))}
                      >{l.name}</button>
                    ) : (
                      <Item className="nav__link" {...l} />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {search && (
              <form className="nav__search" role="search" onSubmit={(e) => e.preventDefault()}>
                <input className="nav__search-input" type="search" name="q" placeholder="Search by location or venue" aria-label="Search by location or venue" />
                <button className="nav__search-btn" type="submit" aria-label="Search"><Search /></button>
              </form>
            )}
            <button className="nav__burger" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
              {open ? <Close /> : <Burger />}
            </button>
          </div>
        </div>
      </div>

      {mega && hotItem && (
        <div className="mega">
          <div className="mega__panel">
            <ul className="mega__rankings">
              {megaItems.map((r, i) => (
                <li key={r.id}>
                  <Link className={`mega__ranking${r === hotItem ? ' is-hot' : ''}`} to={`/${r.section}/${r.slug}`} onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)}>
                    <span>{r.title}</span><ChevronRight />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mega__lists">
              <p className="mega__heading">Lists</p>
              {LISTS.map((k) => <Link key={k} className="mega__list" to={`/${hotItem.section}/${hotItem.slug}/list/${k}`}>{k}</Link>)}
            </div>
          </div>
        </div>
      )}

      <div className="mmenu" hidden={!open}>
        <div className="mmenu__auth">
          <button className="mmenu__signin" type="button" onClick={() => { setOpen(false); signIn() }}>Sign in</button>
          <button className="mmenu__register" type="button">Register</button>
        </div>
        {MENU_GROUPS.map((g) => (
          <ul className="mmenu__group" key={g[0]}>
            {g.map((name) => {
              const l = LINKS.find((x) => x.name === name)!
              const sub = inSection(l.section)
              if (!l.section) return (
                <li key={name}>
                  <Item className="mmenu__link" name={name} to={l.to}><span>{name}</span><MenuChevron /></Item>
                </li>
              )
              return (
                <li key={name}>
                  <button className="mmenu__link" type="button" aria-expanded={expanded === l.section} onClick={() => sub.length && setExpanded(expanded === l.section ? null : l.section!)}>
                    <span>{name}</span><MenuChevron />
                  </button>
                  {expanded === l.section && (
                    <ul className="mmenu__sub">
                      {sub.map((r) => (
                        <li key={r.id}>
                          <Link className="mmenu__sublink" to={`/${r.section}/${r.slug}`}>{r.title}</Link>
                          {LISTS.map((k) => <Link key={k} className="mmenu__sublink mmenu__sublink--list" to={`/${r.section}/${r.slug}/list/${k}`}>{k}</Link>)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </header>
  )
}
