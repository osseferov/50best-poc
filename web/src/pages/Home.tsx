import { useLoaderData } from 'react-router'
import type { HomePage } from '../types'
import { imageUrl } from '../lib/image'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Rail } from '../components/Rail'
import { SmartLink } from '../components/SmartLink'
import { FilmsSection, SecHead, SignupCTA } from '../components/blocks'
import { DestinationCard, ExploreCard, StoryCard } from '../components/cards'

export default function Home() {
  const { hero, explore, destinations, stories, films } = useLoaderData() as HomePage
  return (
    <>
      <title>The 50 | Best Restaurants, Bars, Hotels &amp; Vineyards</title>
      <meta name="description" content="Discover the best restaurants, bars, hotels and vineyards in the world through rankings and stories." />
      <Nav />
      <main id="content">
        <section className="hero">
          <div className="hero__media"><img src={imageUrl(hero.image, 1920)} alt={hero.alt} fetchPriority="high" /></div>
          <div className="hero__overlay" aria-hidden="true" />
          <div className="hero__content">
            <div className="hero__text">
              <h1 className="hero__title">{hero.title}</h1>
              <p className="hero__sub">{hero.subtitle}</p>
            </div>
            <SmartLink className="btn btn--glass hero__cta" href={hero.cta.url}>{hero.cta.label}</SmartLink>
          </div>
        </section>

        <nav className="explore" aria-label="Explore categories">
          <div className="explore__grid">{explore.map((c) => <ExploreCard key={c.name} c={c} />)}</div>
        </nav>

        <section className="destinations">
          <SecHead title="The 50 Discovery" more={{ label: 'Search by destination', url: '/discovery' }}
            sub="Explore the world's best places to eat, drink and stay, as voted by our global experts." />
          <p className="destinations__subheading">Popular destinations</p>
          <Rail label="destinations" arrows="chevron">{destinations.map((d) => <DestinationCard key={d.id} d={d} />)}</Rail>
          <SmartLink className="btn btn--solid btn-stacked" href="/discovery">Search by destination</SmartLink>
        </section>

        <SignupCTA />

        <section className="stories">
          <SecHead title="Stories" more={{ label: 'Read more', url: '/stories' }} sub="Inspiration, guides and news from our global community." />
          <div className="stories__body">
            <div className="stories__grid">{stories.map((a) => <StoryCard key={a.id} a={a} />)}</div>
          </div>
          <SmartLink className="btn btn--outline btn-stacked" href="/stories">Read more</SmartLink>
        </section>

        <FilmsSection films={films} />
      </main>
      <Footer />
    </>
  )
}
