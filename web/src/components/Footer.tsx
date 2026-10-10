import { Fragment } from 'react'
import { Wordmark } from './Nav'

const SOCIAL = [
  ['Instagram', 'https://www.instagram.com/the50_global', 'instagram'],
  ['LinkedIn', 'https://www.linkedin.com/company/the50global/', 'linkedin'],
  ['YouTube', 'https://www.youtube.com/@the50global', 'youtube'],
  ['Facebook', 'https://www.facebook.com/the50global', 'facebook'],
  ['X', 'https://www.x.com/the50global', 'x'],
]
const LEGAL = ['Website Terms', 'Privacy Notice', 'Cookie Statement', 'Cookie Preferences', 'William Reed and AI']

/** `siteMap` adds the extra About link the Discovery footer carries. */
export function Footer({ siteMap = false }: { siteMap?: boolean }) {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__rule" aria-hidden="true" />

        <div className="foot__top">
          <Wordmark />
          <a className="foot__cta" href="#">Create an account</a>

          <div className="foot__col">
            <h3 className="foot__heading">About</h3>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Partner with us</a></li>
              <li><a href="#">Contact us</a></li>
              {siteMap && <li><a href="#">Site map</a></li>}
            </ul>
          </div>

          <div className="foot__col">
            <h3 className="foot__heading">Press</h3>
            <ul>
              <li><a href="#">Press contacts</a></li>
              <li><a href="#">Media sign up</a></li>
              <li><a href="#">Media centre</a></li>
            </ul>
          </div>

          <div className="foot__col">
            <h3 className="foot__heading">Social</h3>
            <div className="foot__social">
              {SOCIAL.map(([name, href, icon]) => (
                <a key={name} className="foot__icon" href={href} aria-label={name} target="_blank" rel="noopener">
                  <img src={`https://www.the50.com/filestore/svg/the-50-${icon}-white.svg`} alt={name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="foot__bottom">
          <p className="foot__pub">WilliamReed<span className="foot__pubdot">.</span></p>

          <div className="foot__legal">
            <p>© William Reed Ltd 2026. All rights reserved.</p>
            <p>Registered Office: Broadfield Park, Crawley RH11 9RT. Registered in England No. 2883992. VAT No. 644 3073 52.</p>
            <p>
              {LEGAL.map((l, i) => (
                <Fragment key={l}>
                  {i > 0 && <span aria-hidden="true">|</span>}<a href="#">{l}</a>
                </Fragment>
              ))}
            </p>
          </div>

          <div className="foot__award" aria-label="PPA 2025 2026, AOP 2021 2026 — Digital Publisher of the Year">
            <div className="foot__award-orgs">
              <p><b>ppa</b><span>2025<br />2026</span></p>
              <p><b>aop</b><span>2021<br />2026</span></p>
            </div>
            <p className="foot__award-title">Digital<br />Publisher<br />of the year</p>
          </div>

          <p className="foot__powered"><small>Powered by</small><strong>Directus</strong></p>
        </div>
      </div>
    </footer>
  )
}
