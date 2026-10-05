import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'

/** Internal paths ("/stories") route client-side; everything else is a plain anchor. */
export function SmartLink({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return href.startsWith('/') ? <Link to={href} {...rest} /> : <a href={href} {...rest} />
}
