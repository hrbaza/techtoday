// Copies the articles in content/posts/*.json into MongoDB.
// Safe to re-run: articles that already exist in the database are left as is,
// so edits made in the admin panel are never overwritten.
//
//   npx vercel env pull .env.local   (fetches MONGODB_URI)
//   npm run db:seed

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "posts");
const client = await new MongoClient(uri).connect();
try {
  const posts = client.db(process.env.MONGODB_DB || "techtoday").collection("posts");
  await posts.createIndex({ slug: 1 }, { unique: true });
  await posts.createIndex({ draft: 1, date: -1 });

  let added = 0;
  let skipped = 0;
  for (const name of (await readdir(dir)).filter((file) => file.endsWith(".json"))) {
    const post = JSON.parse(await readFile(path.join(dir, name), "utf8"));
    const now = new Date();
    const result = await posts.updateOne(
      { slug: post.slug },
      { $setOnInsert: { ...post, draft: Boolean(post.draft), createdAt: now, updatedAt: now } },
      { upsert: true },
    );
    if (result.upsertedCount) added++;
    else skipped++;
  }
  console.log(`Seeded ${added} new article(s); ${skipped} already in the database.`);
  console.log(`The database now has ${await posts.countDocuments()} article(s).`);
} finally {
  await client.close();
}
