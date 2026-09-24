import { cache } from "react";
import { getPost, listPosts } from "@/lib/posts";
import { toArticle, type Article } from "./types";

export type { Article, Block, PostFile } from "./types";
export { wordCount } from "./types";

// Published articles, newest first. Pages are cached, and the admin panel
// revalidates them whenever an article is saved or deleted.
export const getArticles = cache(async (): Promise<Article[]> =>
  (await listPosts()).map(toArticle),
);

export const getArticleBySlug = cache(
  async (slug: string): Promise<Article | undefined> => {
    const post = await getPost(slug);
    return post ? toArticle(post) : undefined;
  },
);

// A few related articles to show at the bottom of an article page.
export async function getRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  const current = articles.find((article) => article.slug === slug);
  const others = articles.filter((article) => article.slug !== slug);
  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter(
    (article) => article.category === current.category,
  );
  const rest = others.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
