import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Close, Eye } from './icons'

const Ctx = createContext<() => void>(() => {})

/** Every save / add-to-list / "Sign in" control opens this modal, as in the static export. */
export const useSignIn = () => useContext(Ctx)

export function SignInProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const lastFocus = useRef<HTMLElement | null>(null)
  const email = useRef<HTMLInputElement>(null)

  const show = () => {
    lastFocus.current = document.activeElement as HTMLElement
    setOpen(true)
  }
  const close = () => {
    setOpen(false)
    lastFocus.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    email.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="signin" hidden={!open}>
        <div className="signin__backdrop" onClick={close} />
        <div className="signin__dialog" role="dialog" aria-modal="true" aria-labelledby="signin-title">
          <button className="signin__close" type="button" aria-label="Close" onClick={close}><Close /></button>
          <h2 className="signin__title" id="signin-title">Sign in</h2>
          <p className="signin__sub">Sign in to save your favourite venues, create lists and manage your account preferences</p>
          <form className="signin__form" noValidate onSubmit={(e) => e.preventDefault()}>
            <label className="signin__label" htmlFor="signin-email">Email</label>
            <input ref={email} className="signin__input" id="signin-email" type="email" placeholder="Email..." autoComplete="email" />
            <label className="signin__label" htmlFor="signin-password">Password</label>
            <div className="signin__pw">
              <input className="signin__input" id="signin-password" type={showPw ? 'text' : 'password'} placeholder="Password..." autoComplete="current-password" />
              <button className="signin__eye" type="button" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(!showPw)}><Eye /></button>
            </div>
            <div className="signin__row">
              <label className="signin__check"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
              <a className="signin__link" href="#">Forgotten password?</a>
            </div>
            <button className="signin__submit" type="submit">Sign in</button>
            <p className="signin__foot">Need an account? <a className="signin__link" href="#">Create account</a></p>
          </form>
        </div>
      </div>
    </Ctx.Provider>
  )
}
