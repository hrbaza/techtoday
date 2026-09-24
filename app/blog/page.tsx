import type { Metadata } from "next";
import { getArticles } from "@/content/articles";
import ArticleCard from "../components/ArticleCard";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Browse every TechToday article — clear, useful explanations of AI, robotics, cloud, security, and the technology shaping our world.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const articles = await getArticles();
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Articles</span>
          <h1>All articles</h1>
          <p className="lead">
            {articles.length} in-depth guides to the technology shaping our
            world — written in plain language, with no hype.
          </p>
        </div>
      </section>

      <section className="more-stories">
        <div className="container">
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
