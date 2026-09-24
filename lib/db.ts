import { MongoClient, type Collection, type Db } from "mongodb";
import type { PostFile } from "@/content/articles/types";

// MongoDB connection, shared across requests in the same server instance.
// MONGODB_URI is set in Vercel (the MongoDB Atlas integration adds it).

export type PostDoc = PostFile & { createdAt: Date; updatedAt: Date };
export type ImageDoc = {
  contentType: string;
  data: Buffer;
  createdAt: Date;
};

const globalForMongo = globalThis as unknown as {
  mongoDb?: Promise<Db>;
};

export function hasDatabase(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

async function connect(): Promise<Db> {
  const client = await new MongoClient(process.env.MONGODB_URI!, {
    maxPoolSize: 5,
  }).connect();
  const db = client.db(process.env.MONGODB_DB || "techtoday");
  await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
  await db.collection("posts").createIndex({ draft: 1, date: -1 });
  return db;
}

export function getDb(): Promise<Db> {
  if (!hasDatabase()) throw new Error("MONGODB_URI is not set.");
  globalForMongo.mongoDb ??= connect().catch((error) => {
    // Let the next request retry instead of caching the failure forever.
    globalForMongo.mongoDb = undefined;
    throw error;
  });
  return globalForMongo.mongoDb;
}

export async function postsCollection(): Promise<Collection<PostDoc>> {
  return (await getDb()).collection<PostDoc>("posts");
}

export async function imagesCollection(): Promise<Collection<ImageDoc>> {
  return (await getDb()).collection<ImageDoc>("images");
}
