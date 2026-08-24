import type { Article } from "./types";
import { set1 } from "./set1";
import { set2 } from "./set2";
import { set3 } from "./set3";
import { set4 } from "./set4";

export type { Article, Block } from "./types";
export { wordCount } from "./types";

// All articles, newest first (sets are authored in reverse-chronological order).
export const articles: Article[] = [...set1, ...set2, ...set3, ...set4];

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
