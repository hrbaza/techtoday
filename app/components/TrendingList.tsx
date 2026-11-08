import Link from "next/link";
import type { Article } from "@/content/articles";

// "Trending now": a numbered list of articles. On the home page it is a
// full-width section under the hero (two columns); on article pages it sits
// at the top of the sidebar (one column). On phones both become a swipeable
// row of cards. Article pages also reuse it for "More in <topic>".
export default function TrendingList({
  articles,
  variant = "section",
  title = "Trending now",
  headingId = "trending-title",
  moreHref = "/blog",
}: {
  articles: Article[];
  variant?: "section" | "sidebar";
  title?: string;
  headingId?: string;
  moreHref?: string;
}) {
  if (!articles.length) return null;

  const box = (
    <div className={variant === "sidebar" ? "trending trending-side" : "trending"}>
      <div className="trending-head">
        <h2 id={headingId} className="trending-title">
          {title}
        </h2>
        <Link className="section-link" href={moreHref}>
          View all <span className="arrow">→</span>
        </Link>
      </div>
      <ol className="trend-list">
        {articles.map((article, index) => (
          <li key={article.slug} className="trend-item">
            <span className="trend-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="trend-cat">{article.topic.name}</span>
              <h3>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>
              <span className="trend-meta">{article.readTime}</span>
            </div>
            <img
              className="trend-thumb"
              src={article.image}
              alt=""
              width={168}
              height={128}
              loading="lazy"
            />
          </li>
        ))}
      </ol>
    </div>
  );

  if (variant === "sidebar") {
    return <section aria-labelledby={headingId}>{box}</section>;
  }
  return (
    <section className="trending-section" aria-labelledby={headingId}>
      <div className="container">{box}</div>
    </section>
  );
}
