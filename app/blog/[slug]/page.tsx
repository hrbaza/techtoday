import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
  wordCount,
} from "@/content/articles";
import {
  AUTHOR_NAME,
  AUTHOR_PATH,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/content/site";
import ArticleContent from "../../components/ArticleContent";
import AuthorBio from "../../components/AuthorBio";
import Avatar from "../../components/Avatar";
import { LogoMark } from "../../components/Logo";
import ReadingProgress from "../../components/ReadingProgress";
import ShareBar from "../../components/ShareBar";

type Params = { slug: string };

// Existing articles are prebuilt; new ones render on first visit and are
// then cached until the admin panel revalidates them.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  const url = `/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}${AUTHOR_PATH}` }],
    category: article.category,
    keywords: [article.category, "technology", "explained", SITE_NAME],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.date,
      authors: [`${SITE_URL}${AUTHOR_PATH}`],
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const canonical = `${SITE_URL}/blog/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    inLanguage: "en",
    wordCount: wordCount(article.markdown),
    keywords: [article.category, "technology", SITE_NAME].join(", "),
    url: canonical,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}${AUTHOR_PATH}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <ReadingProgress />

      <article>
        <div className="container article-hero">
          <header className="article-header">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep" aria-hidden="true">/</span>
              <Link href="/blog">Articles</Link>
            </nav>
            <span className="pill">{article.category}</span>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-dek">{article.excerpt}</p>
            <div className="byline">
              <Avatar className="avatar avatar-sm" />
              <span className="byline-author">
                By <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link>
              </span>
              <span className="byline-sep" aria-hidden="true">·</span>
              <time dateTime={article.date}>{article.dateLabel}</time>
              <span className="byline-sep" aria-hidden="true">·</span>
              <span>{article.readTime}</span>
            </div>
          </header>
          <figure className="article-cover">
            <img
              src={article.image}
              alt={article.imageAlt}
              width={1600}
              height={800}
              fetchPriority="high"
            />
          </figure>
        </div>

        <div className="container article-layout article-section">
          <div className="article-body">
            <ArticleContent
              markdown={article.markdown}
              midImage={article.midImage}
              midImageAlt={article.midImageAlt}
            />

            <ShareBar url={canonical} title={article.title} />

            <AuthorBio />

            <div className="article-cta">
              <Link className="ghost-button" href="/blog">
                <span aria-hidden="true">←</span> Back to all articles
              </Link>
            </div>
          </div>

          <aside className="sidebar">
            {related.length > 0 && (
              <div className="side-box">
                <h3 className="side-title">Related reading</h3>
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    className="related-item"
                    href={`/blog/${item.slug}`}
                  >
                    <img
                      src={item.image}
                      alt=""
                      width={144}
                      height={112}
                      loading="lazy"
                    />
                    <span>
                      <span className="related-title">{item.title}</span>
                      <span className="related-meta">{item.readTime}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="side-box side-about">
              <LogoMark idPrefix="sidebar" />
              <p className="side-title">About {SITE_NAME}</p>
              <p>{SITE_TAGLINE}</p>
              <Link className="section-link" href="/about">
                Learn more <span className="arrow">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
