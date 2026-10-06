import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/content/articles";
import {
  AUTHOR_BIO,
  AUTHOR_NAME,
  AUTHOR_PATH,
  AUTHOR_ROLE,
  SITE_NAME,
  SITE_URL,
} from "@/content/site";
import ArticleCard from "../components/ArticleCard";
import AuthorBio from "../components/AuthorBio";

export const metadata: Metadata = {
  title: `${AUTHOR_NAME}, Founder & Editor`,
  description: AUTHOR_BIO,
  alternates: { canonical: AUTHOR_PATH },
  openGraph: { type: "profile", url: AUTHOR_PATH },
};

export default async function AuthorPage() {
  const articles = await getArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}${AUTHOR_PATH}`,
    mainEntity: {
      "@type": "Person",
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_ROLE,
      description: AUTHOR_BIO,
      url: `${SITE_URL}${AUTHOR_PATH}`,
      worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="page-hero">
        <div className="container">
          <span className="tag">Author</span>
          <h1>{AUTHOR_NAME}</h1>
          <p className="lead">{AUTHOR_ROLE}</p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <AuthorBio linked={false} />
          <p>
            Questions, corrections or topic ideas? Get in touch through the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>

      <section className="more-stories">
        <div className="container">
          <div className="section-title">
            <h2>Articles by {AUTHOR_NAME}</h2>
          </div>
          <div className="story-grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
