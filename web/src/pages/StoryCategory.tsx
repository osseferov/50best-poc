import { Link, useLoaderData } from 'react-router'
import type { StoryCategoryPage } from '../types'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Crumbs, Taxonomy } from '../components/blocks'
import { ArticleCard } from '../components/cards'

/** Live pager: << < [current … +5] > >>, windowed so the last pages still show six numbers. */
function Pager({ page, pages, pageSize }: Pick<StoryCategoryPage, 'page' | 'pages' | 'pageSize'>) {
  if (pages < 2) return null
  const to = (p: number) => (p > 1 ? `?offset=${(p - 1) * pageSize}` : '?')
  const first = Math.max(1, Math.min(page, pages - 5))
  const nums = Array.from({ length: Math.min(6, pages - first + 1) }, (_, i) => first + i)
  return (
    <nav className="pager" aria-label="Pagination">
      <ul>
        {page > 1 && <li><Link to={to(1)} aria-label="First page">&lt;&lt;</Link></li>}
        {page > 1 && <li><Link to={to(page - 1)} aria-label="Previous page">&lt;</Link></li>}
        {nums.map((n) => (
          <li key={n} className={n === page ? 'is-active' : undefined}>
            <Link to={to(n)} aria-current={n === page ? 'page' : undefined}>{n}</Link>
          </li>
        ))}
        {page < pages && <li><Link to={to(page + 1)} aria-label="Next page">&gt;</Link></li>}
        {page < pages && <li><Link to={to(pages)} aria-label="Last page">&gt;&gt;</Link></li>}
      </ul>
    </nav>
  )
}

export default function StoryCategory() {
  const { category, items, page, pages, pageSize, taxonomy } = useLoaderData() as StoryCategoryPage
  return (
    <>
      <title>{`${category} | Stories | The 50`}</title>
      <Nav search />
      <main id="content">
        <div className="pagehead">
          <Crumbs trail={[{ label: 'Stories', url: '/stories' }, { label: `Categories : ${category}`, url: `/stories/categories/${category}` }]} />
        </div>
        <section className="scat">
          <h1 className="scat__title">Browsing stories within the category: {category}</h1>
          {items.length
            ? <div className="scat__grid">{items.map((a) => <ArticleCard key={a.id} a={a} light />)}</div>
            : <p className="scat__empty">No stories in this category yet.</p>}
          <Pager page={page} pages={pages} pageSize={pageSize} />
        </section>
        <Taxonomy taxonomy={taxonomy} />
      </main>
      <Footer />
    </>
  )
}
