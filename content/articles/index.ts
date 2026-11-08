import { cache } from "react";
import { getPost, listPosts } from "@/lib/posts";
import { toArticle, type Article } from "./types";

export type { Article, Block, PostFile } from "./types";
export { postMarkdown, wordCount } from "./types";

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

// Every published article in a topic: its pillar first, then newest first.
export async function getTopicArticles(topicSlug: string): Promise<Article[]> {
  const inTopic = (await getArticles()).filter((article) => article.topic.slug === topicSlug);
  const pillar = inTopic.filter((article) => article.slug === article.topic.pillar);
  return [...pillar, ...inTopic.filter((article) => article.slug !== article.topic.pillar)];
}

// A few related articles to show at the bottom of an article page: the same
// topic first (led by its pillar, so every article links up to it), then the
// newest from other topics if the topic is small.
export async function getRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  const current = articles.find((article) => article.slug === slug);
  const others = articles.filter((article) => article.slug !== slug);
  if (!current) return others.slice(0, limit);

  const sameTopic = (await getTopicArticles(current.topic.slug)).filter(
    (article) => article.slug !== slug,
  );
  const rest = others.filter((article) => article.topic.slug !== current.topic.slug);
  return [...sameTopic, ...rest].slice(0, limit);
}
