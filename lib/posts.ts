import fs from "node:fs/promises";
import path from "node:path";
import { Binary, ObjectId } from "mongodb";
import type { PostFile } from "@/content/articles/types";
import { hasDatabase, imagesCollection, postsCollection } from "./db";

// All reads and writes of articles go through here.
//
// - "mongo": MONGODB_URI is set (production). Posts and uploaded images live
//   in MongoDB; images are served from /media/<id>.
// - "files": no database configured. Posts are read from the JSON files in
//   content/posts (the original articles, also used to seed the database).
//   Writing is only allowed in `npm run dev`, straight into those files.

export type Backend = "mongo" | "files";

export function backend(): Backend {
  return hasDatabase() ? "mongo" : "files";
}

export function canWrite(): boolean {
  return backend() === "mongo" || process.env.NODE_ENV !== "production";
}

export class DuplicateSlugError extends Error {}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const LOCAL_IMAGES_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "public",
  "images",
  "posts",
);
const MEDIA_PREFIX = "/media/";
const LOCAL_IMAGE_PREFIX = "/images/posts/";

function sortNewestFirst(posts: PostFile[]): PostFile[] {
  return posts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

function stripDoc<T extends PostFile>(doc: T): PostFile {
  const { slug, title, category, excerpt, date, image, imageAlt, draft, body } = doc;
  return { slug, title, category, excerpt, date, image, imageAlt, draft: Boolean(draft), body };
}

async function readPostFiles(): Promise<PostFile[]> {
  const names = (await fs.readdir(POSTS_DIR)).filter((name) => name.endsWith(".json"));
  return Promise.all(
    names.map(
      async (name) =>
        JSON.parse(await fs.readFile(path.join(POSTS_DIR, name), "utf8")) as PostFile,
    ),
  );
}

export async function listPosts({ includeDrafts = false } = {}): Promise<PostFile[]> {
  if (backend() === "mongo") {
    const posts = await postsCollection();
    const docs = await posts
      .find(includeDrafts ? {} : { draft: { $ne: true } })
      .sort({ date: -1, slug: 1 })
      .toArray();
    return docs.map(stripDoc);
  }
  const all = await readPostFiles();
  return sortNewestFirst(includeDrafts ? all : all.filter((post) => !post.draft));
}

export async function getPost(
  slug: string,
  { includeDrafts = false } = {},
): Promise<PostFile | null> {
  if (backend() === "mongo") {
    const posts = await postsCollection();
    const doc = await posts.findOne(
      includeDrafts ? { slug } : { slug, draft: { $ne: true } },
    );
    return doc ? stripDoc(doc) : null;
  }
  const post = (await readPostFiles()).find((item) => item.slug === slug) ?? null;
  return post && (includeDrafts || !post.draft) ? post : null;
}

function assertWritable() {
  if (!canWrite()) {
    throw new Error("MONGODB_URI is not set in Vercel, so articles cannot be saved.");
  }
}

export async function savePost(post: PostFile, { isNew }: { isNew: boolean }) {
  assertWritable();
  if (backend() === "mongo") {
    const posts = await postsCollection();
    const now = new Date();
    if (isNew) {
      try {
        await posts.insertOne({ ...post, createdAt: now, updatedAt: now });
      } catch (error) {
        if ((error as { code?: number }).code === 11000) throw new DuplicateSlugError();
        throw error;
      }
    } else {
      await posts.updateOne({ slug: post.slug }, { $set: { ...post, updatedAt: now } });
    }
    return;
  }
  if (isNew && (await getPost(post.slug, { includeDrafts: true }))) {
    throw new DuplicateSlugError();
  }
  await fs.writeFile(
    path.join(/*turbopackIgnore: true*/ POSTS_DIR, `${post.slug}.json`),
    `${JSON.stringify(post, null, 2)}\n`,
  );
}

export async function deletePost(slug: string) {
  assertWritable();
  if (backend() === "mongo") {
    await (await postsCollection()).deleteOne({ slug });
    return;
  }
  await fs.rm(path.join(/*turbopackIgnore: true*/ POSTS_DIR, `${slug}.json`), {
    force: true,
  });
}

// Stores an uploaded image and returns the URL path to use in the post.
export async function saveImage(
  data: Buffer,
  contentType: string,
  baseName: string,
): Promise<string> {
  assertWritable();
  if (backend() === "mongo") {
    const images = await imagesCollection();
    const { insertedId } = await images.insertOne({
      contentType,
      data,
      createdAt: new Date(),
    });
    return `${MEDIA_PREFIX}${insertedId.toHexString()}`;
  }
  const ext = contentType === "image/jpeg" ? "jpg" : contentType.split("/")[1];
  const fileName = `${baseName}-${Date.now()}.${ext}`;
  await fs.mkdir(LOCAL_IMAGES_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_IMAGES_DIR, fileName), data);
  return `${LOCAL_IMAGE_PREFIX}${fileName}`;
}

// Removes an image previously returned by saveImage; ignores external URLs.
export async function deleteImage(url: string) {
  if (url.startsWith(MEDIA_PREFIX) && backend() === "mongo") {
    const id = url.slice(MEDIA_PREFIX.length);
    if (ObjectId.isValid(id)) {
      await (await imagesCollection()).deleteOne({ _id: new ObjectId(id) });
    }
  } else if (url.startsWith(LOCAL_IMAGE_PREFIX) && backend() === "files") {
    await fs.rm(path.join(LOCAL_IMAGES_DIR, path.basename(url)), { force: true });
  }
}

export async function readImage(
  id: string,
): Promise<{ contentType: string; data: Buffer } | null> {
  if (backend() !== "mongo" || !ObjectId.isValid(id)) return null;
  const doc = await (await imagesCollection()).findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  const data = doc.data as unknown as Buffer | Binary;
  return {
    contentType: doc.contentType,
    data: data instanceof Binary ? Buffer.from(data.buffer) : data,
  };
}
