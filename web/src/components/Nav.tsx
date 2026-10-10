import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useSignIn } from './SignIn'
import { Burger, Close, MenuChevron, Search } from './icons'

const LOGO = 'https://www.the50.com/filestore/svg/the-50-logo-white.svg'
const LINKS = [
  { name: 'Restaurants', to: '#' },
  { name: 'Bars', to: '#' },
  { name: 'Hotels', to: '#' },
  { name: 'Vineyards', to: '#' },
  { name: 'Discovery', to: '/discovery' },
  { name: 'Stories', to: '/stories' },
  { name: 'Films', to: '#' },
  { name: 'About', to: '#' },
]
const MENU_GROUPS = [['Restaurants', 'Bars', 'Hotels', 'Vineyards'], ['Discovery', 'Stories'], ['About']]

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

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onResize = () => window.innerWidth > 920 && setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  return (
    <header className="nav" data-open={open}>
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
                {LINKS.map((l) => <li key={l.name}><Item className="nav__link" {...l} /></li>)}
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

      <div className="mmenu" hidden={!open}>
        <div className="mmenu__auth">
          <button className="mmenu__signin" type="button" onClick={() => { setOpen(false); signIn() }}>Sign in</button>
          <button className="mmenu__register" type="button">Register</button>
        </div>
        {MENU_GROUPS.map((g) => (
          <ul className="mmenu__group" key={g[0]}>
            {g.map((name) => (
              <li key={name}>
                <Item className="mmenu__link" name={name} to={LINKS.find((l) => l.name === name)!.to}>
                  <span>{name}</span><MenuChevron />
                </Item>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </header>
  )
}
