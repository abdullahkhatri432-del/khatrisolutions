import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { blogPosts } from '../config/blog'
import { faqs } from '../config/site'

const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

export default function BlogList() {
  useSeo({ ...pageSeo['/blog'], posts: sortedPosts })

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1>Guides for small businesses</h1>
          <p className="lede">
            Practical guides on website costs, timelines, AI automation, e-commerce and what your online presence should
            include. Written for Indian small businesses that want clear answers, not jargon.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head__row">
            <SectionHeading
              eyebrow="Latest from the blog"
              title="Written for small businesses"
              intro="Clear, practical guides on websites, e-commerce and AI automation for Indian businesses."
            />
            <Button to="/contact" variant="outline" size="sm">
              Discuss your project
            </Button>
          </div>

          <div className="blog-list">
            {sortedPosts.map((post) => (
              <article key={post.slug} className="blog-post">
                <div className="blog-post__meta">
                  <Calendar size={14} aria-hidden="true" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span className="blog-post__category">{post.category}</span>
                </div>
                <h2 className="blog-post__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-post__excerpt">{post.excerpt}</p>
                <div className="blog-post__tags">
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className="tag">
                      <Tag size={11} aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="link-arrow">
                  Read the guide
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <div className="section-head__row" style={{ marginTop: '3rem' }}>
            <SectionHeading eyebrow="Questions" title="The things clients ask" align="center" />
            <Button to="/contact" variant="outline" size="sm">
              Ask something else
            </Button>
          </div>
          <FAQ items={faqs.slice(0, 3)} idPrefix="blog-faq" />
        </div>
      </section>

      <CTASection
        eyebrow="Get in touch"
        title="Your project could be the next portfolio entry."
        body="Tell us what your business needs and we will tell you what is realistic and what we would build first."
        primaryLabel="Discuss your project"
        secondaryLabel="See starting prices"
      />
    </>
  )
}
