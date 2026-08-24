import Link from "next/link";
import type { Article } from "@/content/articles";

export default function ArticleCard({ article }: { article: Article }) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="story-card">
      <Link href={href} aria-label={article.title}>
        <img
          src={article.image}
          alt={article.imageAlt}
          width={800}
          height={420}
          loading="lazy"
        />
      </Link>
      <div className="story-content">
        <span>{article.category}</span>
        <h3>
          <Link href={href}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <Link href={href}>Read article →</Link>
      </div>
    </article>
  );
}
