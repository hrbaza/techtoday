import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
  getTopicArticles,
  wordCount,
} from "@/content/articles";
import { AUTHOR_LINKS, AUTHOR_NAME, AUTHOR_PATH, SITE_NAME, SITE_URL } from "@/content/site";
import { topicPath } from "@/content/topics";
import { absoluteUrl, responsiveImage } from "@/lib/images";
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
  const image = absoluteUrl(article.image);
  return {
    // A set SEO title is used as the whole <title>, without the site-name
    // suffix, so the editor controls exactly what search results show.
    title: article.seoTitle ? { absolute: article.seoTitle } : article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}${AUTHOR_PATH}` }],
    category: article.topic.name,
    keywords: [article.topic.name, "technology", "explained", SITE_NAME],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.date,
      modifiedTime: article.modifiedDate,
      authors: [`${SITE_URL}${AUTHOR_PATH}`],
      images: [{ url: image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
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
  // "More in <topic>": the rest of this article's topic (pillar first), so
  // every article keeps linking to its topic after it leaves "Trending now".
  const shown = new Set([slug, ...trendingSlugs, ...related.map((item) => item.slug)]);
  const moreInTopic = (await getTopicArticles(article.topic.slug))
    .filter((item) => !shown.has(item.slug))
    .slice(0, 5);
  const topicUrl = topicPath(article.topic);
  const canonical = `${SITE_URL}/blog/${article.slug}`;
  const toc = tableOfContents(article.markdown);
  const hasSidebar = trending.length > 0 || moreInTopic.length > 0 || toc.length > 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    datePublished: article.date,
    dateModified: article.modifiedDate,
    articleSection: article.topic.name,
    inLanguage: "en",
    wordCount: wordCount(article.markdown),
    keywords: [article.topic.name, "technology", SITE_NAME].join(", "),
    url: canonical,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${SITE_URL}${AUTHOR_PATH}`,
      ...(AUTHOR_LINKS.length ? { sameAs: AUTHOR_LINKS.map((link) => link.url) } : {}),
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
        name: article.topic.name,
        item: `${SITE_URL}${topicUrl}`,
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
            <div className="cover-media">
              <img
                {...responsiveImage(article.image, "(max-width: 860px) 100vw, 52vw")}
                alt={article.imageAlt}
                width={1200}
                height={900}
                fetchPriority="high"
              />
            </div>
            <div className="article-hero-body">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span className="sep" aria-hidden="true">/</span>
                <Link href={topicUrl}>{article.topic.name}</Link>
              </nav>
              <Link className="pill" href={topicUrl}>
                {article.topic.name}
              </Link>
              <h1 className="article-title">{article.title}</h1>
              <p className="article-dek">{article.excerpt}</p>
              <div className="byline">
                <Avatar className="avatar avatar-sm" />
                <span className="byline-author">
                  By <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link>
                </span>
                <span className="byline-sep" aria-hidden="true">·</span>
                <time dateTime={article.date}>{article.dateLabel}</time>
                {article.updatedLabel && (
                  <>
                    <span className="byline-sep" aria-hidden="true">·</span>
                    <span>
                      Updated <time dateTime={article.modifiedDate}>{article.updatedLabel}</time>
                    </span>
                  </>
                )}
                <span className="byline-sep" aria-hidden="true">·</span>
                <span>{article.readTime}</span>
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
              <TrendingList
                articles={moreInTopic}
                variant="sidebar"
                title={`More in ${article.topic.name}`}
                headingId="topic-more-title"
                moreHref={topicUrl}
              />
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
