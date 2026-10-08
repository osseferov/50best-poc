// Inline SVGs copied from the static export, one per distinct path.

const svg = (d: string, sw: number) => () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true"><path d={d} /></svg>
)

export const ArrowShort = svg('M5 12h14M13 6l6 6-6 6', 1.8) // "view all"
export const ArrowCard = svg('M5 12h14M13 6l6 6-6 6', 1.6) // explore cards
export const ArrowLong = svg('M3 12h18M15 6l6 6-6 6', 1.6) // "View more"
export const ChevronLeft = svg('M15 5 8 12l7 7', 1.8)
export const ChevronRight = svg('m9 5 7 7-7 7', 1.8)
export const RailPrev = svg('M21 12H3M9 6l-6 6 6 6', 1.8)
export const RailNext = svg('M3 12h18M15 6l6 6-6 6', 1.8)
export const Burger = svg('M3 6h18M3 12h18M3 18h18', 1.6)
export const Close = svg('M6 6l12 12M18 6 6 18', 2)
export const MenuChevron = svg('m9 5 7 7-7 7', 2)
export const Bookmark = svg('M6 4h12v16l-6-4-6 4z', 1.6) // homepage story cards
export const BookmarkSlim = svg('M7 4h10v16l-5-4-5 4z', 1.6) // icard / lead
export const Heart = svg('M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', 1.6)
export const AddToList = svg('M5 7h9M7 12h7M9 17h5M17 12h5M19.5 9.5v5', 1.5)

export const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
)
export const Play = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
export const Eye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" />
  </svg>
)

// venue page "Add to favourites" / "Add to lists" (the50.com, 20px grid)
export const HeartOutline = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4.932 10.173 10 15l5.068-4.827A2.97 2.97 0 0 0 16 8.03v-.135C16 6.296 14.64 5 12.96 5c-.923 0-1.796.4-2.373 1.086L10 6.786l-.587-.7C8.836 5.4 7.963 5 7.039 5 5.361 5 4 6.296 4 7.895v.135c0 .804.335 1.575.932 2.143Z" /></svg>
)
export const ListAdd = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinejoin="round" aria-hidden="true"><path d="M12.667 5H4m5.333 5H4m8.667 5H4M14 7.857v4.286M16 10h-4" /></svg>
)
