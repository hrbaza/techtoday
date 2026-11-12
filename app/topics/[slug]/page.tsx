import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getTopicArticles } from "@/content/articles";
import { SITE_NAME, SITE_URL } from "@/content/site";
import { getTopic, topicPath, TOPICS } from "@/content/topics";
import { absoluteUrl } from "@/lib/images";
import ArticleCard from "../../components/ArticleCard";

type Params = { slug: string };

// One hub per topic. The admin panel's save hook refreshes every page under
// the root layout, so new articles appear here as soon as they are published.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  // Setting openGraph here replaces the site-wide one, image included, so the
  // share image must be given again: the pillar's cover, else the site image.
  const pillar = await getArticleBySlug(topic.pillar);
  const image = pillar
    ? { url: absoluteUrl(pillar.image), alt: pillar.imageAlt }
    : { url: absoluteUrl("/og.png"), width: 1536, height: 1024, alt: SITE_NAME };
  return {
    title: `${topic.name} Explained`,
    description: topic.metaDescription,
    alternates: { canonical: topicPath(topic) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${topic.name} Explained · ${SITE_NAME}`,
      description: topic.metaDescription,
      url: topicPath(topic),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.name} Explained · ${SITE_NAME}`,
      description: topic.metaDescription,
      images: [image.url],
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const articles = await getTopicArticles(topic.slug);
  const pillar = articles.find((article) => article.slug === topic.pillar);
  const rest = articles.filter((article) => article !== pillar);
  const others = TOPICS.filter((item) => item.slug !== topic.slug);
  const url = `${SITE_URL}${topicPath(topic)}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topic.name} Explained`,
    description: topic.description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${article.slug}`,
        name: article.title,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
      { "@type": "ListItem", position: 3, name: topic.name, item: url },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep" aria-hidden="true">/</span>
            <Link href="/topics">Topics</Link>
          </nav>
          <span className="tag">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
          <h1>{topic.name}</h1>
          <p className="lead">{topic.description}</p>
        </div>
      </section>

      {pillar && (
        <section className="topic-start">
          <div className="container">
            <div className="section-title">
              <div>
                <span>Start here</span>
                <h2>The essential guide</h2>
              </div>
            </div>
            <div className="story-grid">
              <ArticleCard article={pillar} />
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="more-stories">
          <div className="container">
            <div className="section-title">
              <div>
                <span>{topic.name}</span>
                <h2>Every article in this topic</h2>
              </div>
            </div>
            <div className="story-grid">
              {rest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="topic-others">
        <div className="container">
          <h2>Explore other topics</h2>
          <nav className="topic-chips" aria-label="Other topics">
            {others.map((item) => (
              <Link key={item.slug} className="tag" href={topicPath(item)}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
