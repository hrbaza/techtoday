export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string; // ISO date, used for sitemap + machine reading
  dateLabel: string; // human-friendly display date
  readTime: string;
  image: string;
  imageAlt: string;
  body: Block[];
};

// Rough word count of an article body — used to confirm the 800+ word target.
export function wordCount(article: Article): number {
  return article.body.reduce((total, block) => {
    if (block.type === "list") {
      return total + block.items.join(" ").split(/\s+/).filter(Boolean).length;
    }
    return total + block.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}
