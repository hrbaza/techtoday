import { NextResponse } from "next/server";
import type { PostFile } from "@/content/articles/types";
import { isAdmin } from "@/lib/admin/auth";
import { SLUG_PATTERN, textToBlocks } from "@/lib/admin/format";
import {
  commitChanges,
  getPost,
  IMAGES_DIR,
  POSTS_DIR,
  storeMode,
  type FileChange,
} from "@/lib/admin/store";

type SaveRequest = {
  action: "save";
  isNew: boolean;
  post: Omit<PostFile, "body">;
  bodyText: string;
  // Cover image already resized in the browser, as a data: URL.
  imageUpload?: string | null;
};

type DeleteRequest = { action: "delete"; slug: string };

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const UPLOADED_IMAGE_PREFIX = "/images/posts/";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function uploadedImagePath(image: string): string | null {
  return image.startsWith(UPLOADED_IMAGE_PREFIX)
    ? `${IMAGES_DIR}/${image.slice(UPLOADED_IMAGE_PREFIX.length)}`
    : null;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return bad("Please log in again.", 401);
  if (storeMode() === "unconfigured") {
    return bad("GITHUB_TOKEN is not set in Vercel, so posts cannot be saved.", 503);
  }

  const payload = (await request.json().catch(() => null)) as
    | SaveRequest
    | DeleteRequest
    | null;
  if (!payload) return bad("Invalid request.");

  try {
    if (payload.action === "delete") return await deletePost(payload.slug);
    if (payload.action === "save") return await savePost(payload);
    return bad("Unknown action.");
  } catch (error) {
    console.error("[admin] post action failed", error);
    return bad(error instanceof Error ? error.message : "Save failed.", 500);
  }
}

async function savePost({ isNew, post, bodyText, imageUpload }: SaveRequest) {
  const slug = String(post.slug ?? "").trim();
  const title = String(post.title ?? "").trim();
  const category = String(post.category ?? "").trim();
  const excerpt = String(post.excerpt ?? "").trim();
  const date = String(post.date ?? "").trim();
  const imageAlt = String(post.imageAlt ?? "").trim();
  let image = String(post.image ?? "").trim();

  if (!SLUG_PATTERN.test(slug)) {
    return bad("URL slug may only use lowercase letters, numbers and dashes.");
  }
  if (!title) return bad("Title is required.");
  if (!category) return bad("Category is required.");
  if (!excerpt) return bad("Short description is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("Date is invalid.");

  const body = textToBlocks(String(bodyText ?? ""));
  if (!body.length) return bad("Article text is empty.");

  const existing = await getPost(slug);
  if (isNew && existing) {
    return bad(`An article with the URL /blog/${slug} already exists.`, 409);
  }
  if (!isNew && !existing) return bad("This article no longer exists.", 404);

  const changes: FileChange[] = [];

  if (imageUpload) {
    const match = /^data:image\/(webp|jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(
      imageUpload,
    );
    if (!match) return bad("Cover image must be a JPEG, PNG or WebP.");
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > MAX_IMAGE_BYTES) return bad("Cover image is too large.");
    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    const fileName = `${slug}-${Date.now()}.${ext}`;
    changes.push({ path: `${IMAGES_DIR}/${fileName}`, content: bytes });
    image = `${UPLOADED_IMAGE_PREFIX}${fileName}`;
  }
  if (!image) return bad("Cover image is required.");
  if (!imageAlt) return bad("Image description (alt text) is required.");

  const previousImage = existing && uploadedImagePath(existing.image);
  if (previousImage && existing.image !== image) {
    changes.push({ path: previousImage, content: null });
  }

  const saved: PostFile = {
    slug,
    title,
    category,
    excerpt,
    date,
    image,
    imageAlt,
    draft: Boolean(post.draft),
    body,
  };
  changes.push({
    path: `${POSTS_DIR}/${slug}.json`,
    content: Buffer.from(`${JSON.stringify(saved, null, 2)}\n`),
  });

  const verb = isNew ? "Add" : "Update";
  await commitChanges(changes, `${verb} article: ${title}${saved.draft ? " (draft)" : ""}`);
  return NextResponse.json({ ok: true, post: saved, mode: storeMode() });
}

async function deletePost(slug: string) {
  if (!SLUG_PATTERN.test(String(slug))) return bad("Invalid slug.");
  const existing = await getPost(slug);
  if (!existing) return bad("This article no longer exists.", 404);

  const changes: FileChange[] = [{ path: `${POSTS_DIR}/${slug}.json`, content: null }];
  const image = uploadedImagePath(existing.image);
  if (image) changes.push({ path: image, content: null });

  await commitChanges(changes, `Delete article: ${existing.title}`);
  return NextResponse.json({ ok: true, mode: storeMode() });
}
