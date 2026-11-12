import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/content/articles";
import { topicPath, TOPICS } from "@/content/topics";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Browse TechToday by topic: AI, chips, computing, internet, wireless, security, phones, batteries, energy, wearables, robots, space and health.",
  alternates: { canonical: "/topics" },
};

export default async function TopicsIndex() {
  const articles = await getArticles();
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.topic.slug, (counts.get(article.topic.slug) ?? 0) + 1);
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Topics</span>
          <h1>Browse by topic</h1>
          <p className="lead">
            {TOPICS.length} topics, each with a starting guide and every article that
            builds on it.
          </p>
        </div>
      </section>

      <section className="more-stories">
        <div className="container">
          <ul className="topic-grid">
            {TOPICS.map((topic) => {
              const count = counts.get(topic.slug) ?? 0;
              return (
                <li key={topic.slug} className="topic-card">
                  <h2>
                    <Link href={topicPath(topic)}>{topic.name}</Link>
                  </h2>
                  <p>{topic.description}</p>
                  <span className="topic-count">
                    {count} {count === 1 ? "article" : "articles"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
