import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, ChevronRight, Clock, Tag, User } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { blogPostMeta } from '../config/seo'
import { blogPosts, getBlogPost } from '../config/blog'
import { services, site } from '../config/site'

const readingTime = (post) => {
  const text = [post.excerpt, ...post.sections.map((section) => `${section.heading} ${section.body}`)].join(' ')
  return Math.max(2, Math.round(text.split(/\s+/).length / 200))
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

  useSeo(post ? blogPostMeta(post) : { title: 'Post not found', path: `/blog/${slug || ''}`, noindex: true })

  if (!post) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="notfound__code" aria-hidden="true">
            404
          </p>
          <h1>Post not found</h1>
          <p>The blog post you are looking for does not exist. Browse the guides instead.</p>
          <Button to="/blog" variant="outline" icon={ArrowLeft}>
            Browse all guides
          </Button>
        </div>
      </section>
    )
  }

  const service = services.find((item) => item.slug === post.serviceSlug)
  const morePosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2)

  return (
    <>
      <header className="pagehead">
        <div className="container container--narrow">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to="/blog">Blog</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{post.title}</span>
          </nav>

          <div className="blog-post__meta" style={{ marginTop: '1.25rem' }}>
            <span className="blog-post__category">{post.category}</span>
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <Clock size={14} aria-hidden="true" />
            <span>{readingTime(post)} min read</span>
          </div>

          <h1 style={{ marginTop: '0.85rem' }}>{post.title}</h1>
          <p className="lede">{post.excerpt}</p>

          <p className="blog-post__byline">
            <User size={14} aria-hidden="true" />
            <span>
              By{' '}
              <Link to="/about#team" style={{ textDecoration: 'underline' }}>
                {site.founder.name}
              </Link>
              , Web Development &amp; Technical Lead
            </span>
          </p>
        </div>
      </header>

      <article className="section">
        <div className="container container--narrow">
          <div className="prose blog-post__content">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          {post.tags?.length ? (
            <div className="blog-post__tags" style={{ marginTop: '2rem' }}>
              <Tag size={14} aria-hidden="true" />
              <span>Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {service ? (
            <div className="notice notice--accent" style={{ marginTop: '2rem' }}>
              <span>
                <strong>Related service:</strong>{' '}
                <Link to={`/services/${service.slug}`} style={{ textDecoration: 'underline' }}>
                  {service.title}
                </Link>{' '}
                — {service.summary}
              </span>
            </div>
          ) : null}

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Button to="/contact" variant="primary" iconRight={ArrowRight}>
              Discuss a similar project
            </Button>
            <Button to="/blog" variant="outline" icon={ArrowLeft}>
              All guides
            </Button>
          </div>
        </div>
      </article>

      {post.faq?.length ? (
        <section className="section section--sunk">
          <div className="container container--narrow">
            <SectionHeading eyebrow="Questions" title="Still have questions?" align="center" />
            <FAQ items={post.faq} idPrefix={`${post.slug}-faq`} />
          </div>
        </section>
      ) : null}

      {morePosts.length ? (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Keep reading" title="More guides" />
            <div className="blog-list">
              {morePosts.map((item) => (
                <article key={item.slug} className="blog-post">
                  <div className="blog-post__meta">
                    <Calendar size={14} aria-hidden="true" />
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="blog-post__category">{item.category}</span>
                  </div>
                  <h3 className="blog-post__title">
                    <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="blog-post__excerpt">{item.excerpt}</p>
                  <Link to={`/blog/${item.slug}`} className="link-arrow">
                    Read the guide
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        eyebrow="Next step"
        title="Your project could use this thinking."
        body="Tell us what your business needs and we will tell you what is realistic and what we would build first."
        primaryLabel="Discuss your project"
        secondaryLabel="See starting prices"
      />
    </>
  )
}
