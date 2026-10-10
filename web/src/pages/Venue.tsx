import { useLoaderData } from 'react-router'
import type { VenuePage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Rail } from '../components/Rail'
import { Crumbs, RowTitle } from '../components/blocks'
import { VenueCard } from '../components/cards'
import { useSignIn } from '../components/SignIn'
import { HeartOutline, ListAdd } from '../components/icons'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined

/** Google place pin (Maps Embed API, needs the key) when there's a place id; plain coordinate pin otherwise. */
function mapSrc(v: VenuePage['venue']) {
  if (v.placeId && MAPS_KEY) return `https://www.google.com/maps/embed/v1/place?${new URLSearchParams({ key: MAPS_KEY, q: `place_id:${v.placeId}` })}`
  if (v.map) return `https://www.google.com/maps?q=${v.map.lat},${v.map.lng}&z=16&output=embed`
}

export default function Venue() {
  const { venue: v, nearby } = useLoaderData() as VenuePage
  const signIn = useSignIn()
  const map = mapSrc(v)
  return (
    <>
      <title>{`${v.name} - ${v.city} - ${v.type} - The 50 Discovery`}</title>
      <meta name="description" content={`${v.name}, ${v.city}, ${v.country} — ${v.style}`} />
      <Nav search />
      <main id="content">
        <div className="pagehead">
          <Crumbs trail={[
            { label: 'Discovery', url: '/discovery' },
            { label: v.country, url: '#' },
            { label: v.city, url: '#' },
          ]} />
        </div>

        {v.gallery.length > 0 && (
          <div className="vgallery">
            {v.gallery.map((src, i) => <img key={src} src={imageUrl(src, 800)} alt={`${v.name} ${i + 1}`} />)}
          </div>
        )}

        <article className="venue">
          <h1 className="venue__name">{v.name}</h1>
          <p className="venue__place">{`${v.city}, ${v.country}`}</p>
          <div className="venue__actions">
            <button className="venue__btn" type="button" onClick={signIn}><HeartOutline />Add to favourites</button>
            <button className="venue__btn" type="button" onClick={signIn}><ListAdd />Add to lists</button>
          </div>
          <div className="venue__desc" dangerouslySetInnerHTML={{ __html: v.description }} />

          {(v.price || v.hours?.length || v.phone || v.website) && (
            <>
              <h2 className="venue__h2">Key Information</h2>
              <ul className="venue__details">
                {v.price && <li className="venue__price">{v.price}</li>}
                {v.hours && <li className="venue__hours">{v.hours.map((d) => <span key={d}>{d}</span>)}</li>}
                {v.phone && <li className="venue__phone"><a href={`tel:${v.phone}`}>{v.phone}</a></li>}
                {v.website && <li className="venue__web"><a href={v.website} target="_blank" rel="noopener">{`Visit ${v.name}'s Website`}</a></li>}
              </ul>
            </>
          )}

          {(v.address || map) && (
            <>
              <h2 className="venue__h2">Location</h2>
              {v.address && <p className="venue__address">{v.address}</p>}
              {map && <iframe className="venue__map" title={`Map of ${v.name}`} src={map} loading="lazy" />}
            </>
          )}
        </article>

        {nearby.length > 0 && (
          <section className="rowblock rowblock--venues">
            <RowTitle title="Places nearby" description="Explore other great venues in the area" />
            <Rail label="venues">{nearby.map((n) => <VenueCard key={n.id} v={n} />)}</Rail>
          </section>
        )}
      </main>
      <Footer siteMap />
    </>
  )
}
