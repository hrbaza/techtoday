import type { MetadataRoute } from "next";
import { getArticles } from "@/content/articles";
import { SITE_URL } from "@/content/site";

// Build the sitemap from the database on every request. Caching it has failed
// twice on Vercel: neither the admin panel's on-demand refresh (revalidatePath
// in app/api/admin/posts/route.ts) nor an hourly `revalidate = 3600` ever
// replaced the copy cached at deploy time, so new articles went live but never
// reached the sitemap. Crawlers fetch it rarely and it costs one query.
export const dynamic = "force-dynamic";

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
