import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/content/articles";
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/content/site";
import ArticleCard from "./components/ArticleCard";
import Avatar from "./components/Avatar";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [featured, ...rest] = await getArticles();
  if (!featured) {
    return (
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>New articles are on the way</h1>
          </div>
        </section>
      </main>
    );
  }

  const featuredHref = `/blog/${featured.slug}`;
  const trending = rest.slice(0, 4);
  const latest = rest.slice(4, 13);

  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og.png`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
      />
      <section className="hero" id="home">
        <div
          className={`container hero-layout${trending.length ? "" : " hero-layout-solo"}`}
        >
          {/* The title link is stretched over the card, so the whole cover
              story is one click target. */}
          <article className="feature-card">
            <img
              src={featured.image}
              alt={featured.imageAlt}
              width={1600}
              height={1000}
              fetchPriority="high"
            />
            <div className="feature-body">
              <div className="hero-eyebrow">
                <span className="pill pill-live pill-glass">Featured story</span>
                <span className="hero-cat">{featured.category}</span>
              </div>
              <h1>
                <Link href={featuredHref}>{featured.title}</Link>
              </h1>
              <p className="feature-excerpt">{featured.excerpt}</p>
              <div className="feature-foot">
                <div className="feature-meta">
                  <Avatar className="avatar avatar-sm" />
                  <span>
                    By <strong>{AUTHOR_NAME}</strong>
                  </span>
                  <span className="dot-sep" aria-hidden="true">·</span>
                  <time dateTime={featured.date}>{featured.dateLabel}</time>
                  <span className="dot-sep" aria-hidden="true">·</span>
                  <span>{featured.readTime}</span>
                </div>
                <span className="feature-cta" aria-hidden="true">
                  Read the story <span className="arrow">→</span>
                </span>
              </div>
            </div>
          </article>

          {trending.length > 0 && (
            <aside className="trending" aria-labelledby="trending-title">
              <div className="trending-head">
                <h2 id="trending-title" className="trending-title">
                  Trending now
                </h2>
                <Link className="section-link" href="/blog">
                  View all <span className="arrow">→</span>
                </Link>
              </div>
              <ol className="trend-list">
                {trending.map((article, index) => (
                  <li key={article.slug} className="trend-item">
                    <span className="trend-num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="trend-cat">{article.category}</span>
                      <h3>
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <span className="trend-meta">{article.readTime}</span>
                    </div>
                    <img
                      className="trend-thumb"
                      src={article.image}
                      alt=""
                      width={168}
                      height={128}
                    />
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </section>

      <section className="section" id="stories">
        <div className="container">
          <div className="section-title">
            <div>
              <span>Latest stories</span>
              <h2>Technology, explained clearly</h2>
            </div>
            <Link className="section-link" href="/blog">
              View all articles <span className="arrow">→</span>
            </Link>
          </div>
          <div className="story-grid">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2>Technology, without the hype.</h2>
              <p>
                Clear, honest explainers on AI, computing and the systems shaping
                everyday life — written so anyone can follow along.
              </p>
            </div>
            <div className="cta-actions">
              <Link className="primary-button" href="/blog">
                Start reading <span className="arrow">→</span>
              </Link>
              <Link className="ghost-button" href="/about">
                About {SITE_NAME}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
