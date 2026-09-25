import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
  wordCount,
} from "@/content/articles";
import { SITE_NAME, SITE_URL } from "@/content/site";
import ArticleBody from "../../components/ArticleBody";

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
    authors: [{ name: SITE_NAME, url: `${SITE_URL}/about` }],
    category: article.category,
    keywords: [article.category, "technology", "explained", SITE_NAME],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.date,
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
    wordCount: wordCount(article),
    keywords: [article.category, "technology", SITE_NAME].join(", "),
    url: canonical,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
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

      <article className="article-section">
        <div className="container article-layout">
          <div className="article-body">
            <p className="breadcrumb">
              <Link href="/">Home</Link> <span>/</span>{" "}
              <Link href="/blog">Articles</Link> <span>/</span>{" "}
              {article.category}
            </p>
            <h1 className="article-title">{article.title}</h1>
            <div className="byline">
              <span className="byline-author">By {SITE_NAME}</span>
              <span className="byline-sep">·</span>
              <time dateTime={article.date}>{article.dateLabel}</time>
              <span className="byline-sep">·</span>
              <span>{article.readTime}</span>
              <span className="byline-sep">·</span>
              <span>{article.category}</span>
            </div>
            <img
              className="article-image"
              src={article.image}
              alt={article.imageAlt}
              width={1600}
              height={900}
            />
            <ArticleBody blocks={article.body} />

            <div className="article-cta">
              <Link className="primary-button" href="/blog">
                ← Back to all articles
              </Link>
            </div>
          </div>

          <aside className="sidebar">
            <div className="side-box">
              <h3>Related reading</h3>
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`}>
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
