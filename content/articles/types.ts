export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

// What is stored on disk in content/posts/<slug>.json — written by hand or by
// the /admin panel.
export type PostFile = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string; // ISO date (YYYY-MM-DD), used for sitemap + machine reading
  image: string; // absolute URL or a path under /public
  imageAlt: string;
  draft?: boolean; // drafts are saved but not shown on the site
  body: Block[];
};

// A post as the site renders it, with display-only fields derived.
export type Article = PostFile & {
  dateLabel: string; // human-friendly display date
  readTime: string;
};

// Rough word count of an article body — used to confirm the 800+ word target.
export function wordCount(article: { body: Block[] }): number {
  return article.body.reduce((total, block) => {
    if (block.type === "list") {
      return total + block.items.join(" ").split(/\s+/).filter(Boolean).length;
    }
    return total + block.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

export function formatDateLabel(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function toArticle(post: PostFile): Article {
  const minutes = Math.max(1, Math.round(wordCount(post) / 200));
  return {
    ...post,
    dateLabel: formatDateLabel(post.date),
    readTime: `${minutes} min read`,
  };
}
