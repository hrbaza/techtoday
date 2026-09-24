import fs from "node:fs";
import path from "node:path";
import { toArticle, type Article, type PostFile } from "./types";

export type { Article, Block, PostFile } from "./types";
export { wordCount } from "./types";

// Posts live one-per-file in content/posts/<slug>.json (the /admin panel
// commits new ones there). They are read at build time, so every article page
// is still prerendered as static HTML.
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function loadArticles(): Article[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map(
      (name) =>
        JSON.parse(
          fs.readFileSync(path.join(POSTS_DIR, name), "utf8"),
        ) as PostFile,
    )
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    .map(toArticle);
}

// All published articles, newest first.
export const articles: Article[] = loadArticles();

export function getAllSlugs(): string[] {
  return articles.map((article) => article.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

// A few related articles to show at the bottom of an article page.
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  const others = articles.filter((article) => article.slug !== slug);
  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter(
    (article) => article.category === current.category,
  );
  const rest = others.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
