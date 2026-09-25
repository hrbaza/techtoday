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
  image: string; // cover image: absolute URL or a site path
  imageAlt: string;
  midImage?: string; // optional second image, shown halfway through the body
  midImageAlt?: string;
  draft?: boolean; // drafts are saved but not shown on the site
  body: Block[];
};

// Where the middle image goes: before the section heading nearest the middle
// of the article, so it sits between two sections rather than mid-thought.
export function midImageIndex(blocks: Block[]): number {
  const half = Math.floor(blocks.length / 2);
  for (let i = half; i < blocks.length; i++) {
    if (blocks[i].type === "h2") return i;
  }
  for (let i = half - 1; i > 0; i--) {
    if (blocks[i].type === "h2") return i;
  }
  return half;
}

// A post as the site renders it, with display-only fields derived.
export type Article = PostFile & {
  dateLabel: string; // human-friendly display date
  readTime: string;
};

// Rough word count of an article body — used to confirm the 800+ word target.
// Inline links count only their visible text.
export function wordCount(article: { body: Block[] }): number {
  const words = (text: string) =>
    text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1").split(/\s+/).filter(Boolean).length;
  return article.body.reduce((total, block) => {
    if (block.type === "list") return total + words(block.items.join(" "));
    return total + words(block.text);
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
