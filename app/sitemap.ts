import type { MetadataRoute } from "next";
import { getArticles } from "@/content/articles";
import { SITE_URL } from "@/content/site";

// Rebuild the sitemap from the database at most once an hour. The admin panel
// also asks for a refresh on every save (revalidatePath in
// app/api/admin/posts/route.ts), but on Vercel that on-demand refresh does not
// reach this route — the sitemap stayed frozen at the last deploy while new
// articles went live — so this timer is what keeps it current.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  // Home and /blog change whenever an article is published.
  const latestArticle = articles[0] ? new Date(articles[0].date) : undefined;

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const, lastModified: latestArticle },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" as const, lastModified: latestArticle },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/author", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  // Pages without a known change date leave lastModified out rather than
  // claiming they changed at every rebuild.
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    ...("lastModified" in page && page.lastModified
      ? { lastModified: page.lastModified }
      : {}),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}
