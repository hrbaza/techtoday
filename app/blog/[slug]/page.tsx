import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
  wordCount,
} from "@/content/articles";
import { AUTHOR_NAME, AUTHOR_PATH, SITE_NAME, SITE_URL } from "@/content/site";
import { tableOfContents } from "@/lib/markdown";
import ArticleCard from "../../components/ArticleCard";
import ArticleContent from "../../components/ArticleContent";
import AuthorBio from "../../components/AuthorBio";
import Avatar from "../../components/Avatar";
import ReadingProgress from "../../components/ReadingProgress";
import ShareBar from "../../components/ShareBar";
import TableOfContents from "../../components/TableOfContents";
import TrendingList from "../../components/TrendingList";

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

  // Newest other articles under the cover; "Keep reading" avoids repeating them.
  const trending = (await getArticles())
    .filter((item) => item.slug !== slug)
    .slice(0, 4);
  const trendingSlugs = new Set(trending.map((item) => item.slug));
  const related = (await getRelatedArticles(slug, 3 + trending.length))
    .filter((item) => !trendingSlugs.has(item.slug))
    .slice(0, 3);
  const canonical = `${SITE_URL}/blog/${article.slug}`;
  const toc = tableOfContents(article.markdown);
  const hasSidebar = trending.length > 0 || toc.length > 1;

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
        <header className="article-hero">
          <div className="article-cover-hero">
            <img
              src={article.image}
              alt={article.imageAlt}
              width={1920}
              height={1080}
              fetchPriority="high"
            />
            <div className="container">
              <div className="article-hero-body">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  <Link href="/">Home</Link>
                  <span className="sep" aria-hidden="true">/</span>
                  <Link href="/blog">Articles</Link>
                </nav>
                <span className="pill pill-glass">{article.category}</span>
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
              </div>
            </div>
          </div>
        </header>

        <div
          className={`container article-layout article-section${hasSidebar ? "" : " article-layout-solo"}`}
        >
          <div className="article-body">
            <ArticleContent
              markdown={article.markdown}
              midImage={article.midImage}
              midImageAlt={article.midImageAlt}
            />

            <ShareBar url={canonical} title={article.title} />

            <AuthorBio />
          </div>

          {hasSidebar && (
            <aside className="sidebar">
              <TrendingList articles={trending} variant="sidebar" />
              {toc.length > 1 && <TableOfContents items={toc} />}
            </aside>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="keep-reading">
          <div className="container">
            <div className="section-title">
              <div>
                <span>Keep reading</span>
                <h2>More from {SITE_NAME}</h2>
              </div>
              <Link className="section-link" href="/blog">
                View all articles <span className="arrow">→</span>
              </Link>
            </div>
            <div className="story-grid">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
