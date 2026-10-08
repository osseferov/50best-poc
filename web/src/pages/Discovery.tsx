import { useLoaderData } from 'react-router'
import type { DiscoveryBlock, DiscoveryPage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Rail } from '../components/Rail'
import { Crumbs, IfeatHead, RowTitle } from '../components/blocks'
import { ArticleCard, CityCard, VenueCard } from '../components/cards'

function Block({ b }: { b: DiscoveryBlock }) {
  switch (b.type) {
    case 'venues':
      return (
        <section className="rowblock rowblock--venues">
          <RowTitle title={b.title} description={b.description} />
          <Rail label={b.label}>{b.items.map((v) => <VenueCard key={v.id} v={v} />)}</Rail>
        </section>
      )
    case 'destinations':
      return (
        <section className="rowblock rowblock--venues rowblock--cities">
          <RowTitle title={b.title} />
          <Rail label={b.label}>{b.items.map((d) => <CityCard key={d.id} d={d} />)}</Rail>
        </section>
      )
    case 'features':
      return (
        <section className="ifeat">
          <div className="ifeat__inner">
            <IfeatHead title={b.title} more={b.more} />
            <Rail className="ifeat__rail">{b.items.map((a) => <ArticleCard key={a.id} a={a} />)}</Rail>
          </div>
        </section>
      )
    case 'promos':
      return (
        <section className="promo2">
          <div className="promo2__card">
            <div className="promo2__body">
              <h2 className="promo2__title"><a href={b.collection.url}>{b.collection.title}</a></h2>
              <p className="promo2__text">{b.collection.text}</p>
              <a className="promo2__btn" href={b.collection.url}>Dive in</a>
            </div>
            <a className="promo2__media" href={b.collection.url}><img src={imageUrl(b.collection.image, 1000)} alt={b.collection.title} loading="lazy" /></a>
          </div>
          <div className="promo2__card">
            <div className="promo2__body">
              <h2 className="promo2__title">{b.signup.title}</h2>
              <p className="promo2__text">{b.signup.text}</p>
              <button className="promo2__btn" type="button">Register</button>
            </div>
            <div className="promo2__media"><img src={imageUrl(b.signup.image, 1000)} alt="" loading="lazy" /></div>
          </div>
        </section>
      )
  }
}

export default function Discovery() {
  const { hero, blocks } = useLoaderData() as DiscoveryPage
  return (
    <>
      <title>Discovery | The 50</title>
      <meta name="description" content="Explore the best restaurants, bars, hotels and vineyards around the world — editors' picks, city spotlights and wine regions." />
      <Nav search />
      <main id="content">
        <div className="pagehead pagehead--split">
          <div>
            <Crumbs trail={[{ label: 'Discovery', url: '/discovery' }]} />
            <img className="pagehead__brand" src="https://www.the50.com/filestore/svg/the-50-logo-discovery.svg" alt="The 50 Discovery" height={54} />
            <h1 className="pagehead__title">{hero.title}</h1>
            <p className="pagehead__sub">{hero.subtitle}</p>
          </div>
          <div className="pagehead__media"><img src={imageUrl(hero.image, 1200)} alt="The 50 Discovery" /></div>
        </div>
        <hr className="pagehead__hr pagehead__hr--wide" />
        {blocks.map((b) => <Block key={b.id} b={b} />)}
      </main>
      <Footer siteMap />
    </>
  )
}
