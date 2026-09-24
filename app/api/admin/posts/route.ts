import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { PostFile } from "@/content/articles/types";
import { isAdmin } from "@/lib/admin/auth";
import { SLUG_PATTERN, textToBlocks } from "@/lib/admin/format";
import {
  backend,
  canWrite,
  deleteImage,
  deletePost,
  DuplicateSlugError,
  getPost,
  saveImage,
  savePost,
} from "@/lib/posts";

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

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Every public page lists or shows articles, so refresh them all.
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return bad("Please log in again.", 401);
  if (!canWrite()) {
    return bad("MONGODB_URI is not set in Vercel, so articles cannot be saved.", 503);
  }

  const payload = (await request.json().catch(() => null)) as
    | SaveRequest
    | DeleteRequest
    | null;
  if (!payload) return bad("Invalid request.");

  try {
    if (payload.action === "delete") return await handleDelete(payload.slug);
    if (payload.action === "save") return await handleSave(payload);
    return bad("Unknown action.");
  } catch (error) {
    console.error("[admin] post action failed", error);
    return bad(error instanceof Error ? error.message : "Save failed.", 500);
  }
}

async function handleSave({ isNew, post, bodyText, imageUpload }: SaveRequest) {
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
  if (!imageAlt) return bad("Image description (alt text) is required.");

  const body = textToBlocks(String(bodyText ?? ""));
  if (!body.length) return bad("Article text is empty.");

  const existing = await getPost(slug, { includeDrafts: true });
  if (isNew && existing) {
    return bad(`An article with the URL /blog/${slug} already exists.`, 409);
  }
  if (!isNew && !existing) return bad("This article no longer exists.", 404);

  let upload: { data: Buffer; contentType: string } | null = null;
  if (imageUpload) {
    const match = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(
      imageUpload,
    );
    if (!match) return bad("Cover image must be a JPEG, PNG or WebP.");
    const data = Buffer.from(match[2], "base64");
    if (data.length > MAX_IMAGE_BYTES) return bad("Cover image is too large.");
    upload = { data, contentType: match[1] };
  }
  if (!upload && !image) return bad("Cover image is required.");

  if (upload) image = await saveImage(upload.data, upload.contentType, slug);

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
  try {
    await savePost(saved, { isNew });
  } catch (error) {
    if (upload) await deleteImage(image);
    if (error instanceof DuplicateSlugError) {
      return bad(`An article with the URL /blog/${slug} already exists.`, 409);
    }
    throw error;
  }
  if (existing && existing.image !== image) await deleteImage(existing.image);

  refreshSite();
  return NextResponse.json({ ok: true, post: saved, mode: backend() });
}

async function handleDelete(slug: string) {
  if (!SLUG_PATTERN.test(String(slug))) return bad("Invalid slug.");
  const existing = await getPost(slug, { includeDrafts: true });
  if (!existing) return bad("This article no longer exists.", 404);

  await deletePost(slug);
  await deleteImage(existing.image);
  refreshSite();
  return NextResponse.json({ ok: true, mode: backend() });
}
