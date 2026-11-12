import Link from "next/link";
import type { Article } from "@/content/articles";
import { responsiveImage } from "@/lib/images";

// Cards are 3 across on desktop, 2 on tablets and full width on phones.
const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";

// The title link is stretched over the whole card, so the card is one click
// target and one tab stop.
export default function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="story-card">
      <div className="story-media">
        <img
          {...responsiveImage(article.image, CARD_SIZES)}
          alt={article.imageAlt}
          width={800}
          height={500}
          loading="lazy"
        />
        <span className="story-chip">{article.topic.name}</span>
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
