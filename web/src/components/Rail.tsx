import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, RailNext, RailPrev } from './icons'

interface Props {
  children: ReactNode
  /** Plural noun for the arrow labels: "Previous {label}". Omit for a rail without controls. */
  label?: string
  /** Homepage uses chevrons; Discovery uses long arrows. */
  arrows?: 'chevron' | 'long'
  className?: string
}

/** Native overflow scroller with arrow pair + progress track. Renders track and controls as siblings, like the export. */
export function Rail({ children, label, arrows = 'long', className = '' }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [s, setS] = useState({ atStart: true, atEnd: false, fill: 100, none: false })

  const sync = () => {
    const t = track.current
    if (!t) return
    const max = t.scrollWidth - t.clientWidth
    setS({ atStart: t.scrollLeft <= 2, atEnd: t.scrollLeft >= max - 2, fill: max > 0 ? (t.scrollLeft / max) * 100 : 100, none: max <= 0 })
  }

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const go = (dir: 1 | -1) => {
    const t = track.current!
    const first = t.firstElementChild
    const card = first ? first.getBoundingClientRect().width + 16 : 264
    // advance by whole cards, never more than one viewport
    t.scrollBy({ left: dir * Math.max(card, Math.floor(t.clientWidth / card) * card), behavior: 'smooth' })
  }

  const [Prev, Next] = arrows === 'chevron' ? [ChevronLeft, ChevronRight] : [RailPrev, RailNext]

  return (
    <>
      <div ref={track} className={`rail ${className}`.trim()} onScroll={sync}>{children}</div>
      {label && (
        <div className="controls" hidden={s.none}>
          <div className="controls__nav">
            <button className="controls__btn" aria-label={`Previous ${label}`} disabled={s.atStart} onClick={() => go(-1)}><Prev /></button>
            <button className="controls__btn" aria-label={`Next ${label}`} disabled={s.atEnd} onClick={() => go(1)}><Next /></button>
          </div>
          <div className="controls__track"><span className="controls__fill" style={{ width: `${s.fill}%` }} /></div>
        </div>
      )}
    </>
  )
}
