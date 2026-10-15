import Link from "next/link";
import type { Article } from "@/content/articles";

// The title link is stretched over the whole card, so the card is one click
// target and one tab stop.
export default function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="story-card">
      <div className="story-media">
        <img
          src={article.image}
          alt={article.imageAlt}
          width={800}
          height={500}
          loading="lazy"
        />
        <span className="story-chip">{article.category}</span>
      </div>
      <div className="story-content">
        <div className="story-meta">
          <time dateTime={article.date}>{article.dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>
        <h3>
          <Link href={href}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <span className="story-more" aria-hidden="true">
          Read article <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
