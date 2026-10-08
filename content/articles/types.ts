import { blocksToMarkdown, markdownWordCount } from "@/lib/markdown";

// The format articles were stored in before the Markdown editor. Articles
// saved since then use `markdown` instead; old ones are converted when read.
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
  markdown?: string; // article body (see lib/markdown.ts)
  body?: Block[]; // article body in the old format, until it is next saved
};

// An article's body as Markdown, whichever format it is stored in.
export function postMarkdown(post: Pick<PostFile, "markdown" | "body">): string {
  return post.markdown ?? blocksToMarkdown(post.body ?? []);
}

// A post as the site renders it, with display-only fields derived.
export type Article = PostFile & {
  markdown: string;
  dateLabel: string; // human-friendly display date
  readTime: string;
};

// Words a reader sees in an article body — used to confirm the 800+ word
// target. Markdown syntax and link URLs are not counted.
export function wordCount(markdown: string): number {
  return markdownWordCount(markdown);
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
  const markdown = postMarkdown(post);
  const minutes = Math.max(1, Math.round(wordCount(markdown) / 200));
  return {
    ...post,
    markdown,
    dateLabel: formatDateLabel(post.date),
    readTime: `${minutes} min read`,
  };
}
