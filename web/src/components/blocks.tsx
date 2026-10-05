import { SmartLink } from './SmartLink'
import { ArrowLong, ArrowShort } from './icons'
import type { Link } from '../types'

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

export function Crumbs({ label, to }: { label: string; to: string }) {
  return (
    <p className="crumbs">
      <SmartLink href="/">Home</SmartLink><span aria-hidden="true">/</span>
      <SmartLink href={to}>{label}</SmartLink><span aria-hidden="true">/</span>
    </p>
  )
}

export function SignupCTA() {
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
        <button className="btn btn--on-black signup__btn" type="button">Register</button>
      </div>
    </section>
  )
}
