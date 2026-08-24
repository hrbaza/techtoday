import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/content/articles";
import { SITE_NAME, SITE_URL } from "@/content/site";
import ArticleBody from "../../components/ArticleBody";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  const url = `/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <div className="article-meta">
              <span>{article.category}</span>
              <span>{article.dateLabel}</span>
              <span>{article.readTime}</span>
            </div>
            <img
              className="article-image"
              src={article.image}
              alt={article.imageAlt}
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
