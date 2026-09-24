import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/content/site";
import ArticleCard from "./components/ArticleCard";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const [featured, ...rest] = articles;

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
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="tag">{featured.category}</span>
            <h1>{featured.title}</h1>
            <p className="lead">{featured.excerpt}</p>
            <Link className="primary-button" href={`/blog/${featured.slug}`}>
              Read the full article
            </Link>
          </div>
          <img
            src={featured.image}
            alt={featured.imageAlt}
            width={1600}
            height={900}
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="more-stories" id="stories">
        <div className="container">
          <div className="section-title">
            <div>
              <span>Latest stories</span>
              <h2>Technology, explained clearly</h2>
            </div>
            <Link href="/blog">View all articles</Link>
          </div>
          <div className="story-grid">
            {rest.slice(0, 9).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
