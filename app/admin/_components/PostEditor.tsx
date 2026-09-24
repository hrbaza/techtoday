"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { wordCount, type PostFile } from "@/content/articles/types";
import {
  blocksToText,
  savedMessage,
  slugify,
  SLUG_PATTERN,
  textToBlocks,
} from "@/lib/admin/format";
import ArticleBody from "../../components/ArticleBody";

type Props = {
  initial?: PostFile;
  categories: string[];
  initialMessage?: string;
};

const MAX_IMAGE_WIDTH = 1600;

// Resize in the browser so uploads stay small (Vercel caps request bodies).
async function resizeImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const webp = canvas.toDataURL("image/webp", 0.82);
  return webp.startsWith("data:image/webp")
    ? webp
    : canvas.toDataURL("image/jpeg", 0.85);
}

function today(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function PostEditor({ initial, categories, initialMessage = "" }: Props) {
  const router = useRouter();
  const isNew = !initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [category, setCategory] = useState(initial?.category ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [date, setDate] = useState(initial?.date ?? today());
  const [draft, setDraft] = useState(initial?.draft ?? false);
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageUpload, setImageUpload] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
  const [bodyText, setBodyText] = useState(initial ? blocksToText(initial.body) : "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(initialMessage);

  const blocks = useMemo(() => textToBlocks(bodyText), [bodyText]);
  const words = wordCount({ body: blocks });
  const coverSrc = imageUpload || image;

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setImageUpload(await resizeImage(file));
      if (!imageAlt) setImageAlt(title);
    } catch {
      setError("That image could not be read. Try a JPEG or PNG.");
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        isNew,
        post: { slug, title, category, excerpt, date, draft, image, imageAlt },
        bodyText,
        imageUpload,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      post?: PostFile;
      mode?: string;
    };
    setBusy(false);
    if (!res.ok || !data.post) {
      setError(data.error || "Save failed.");
      return;
    }
    setImage(data.post.image);
    setImageUpload(null);
    const message = savedMessage(data.post.draft ? "draft" : "published", data.mode);
    if (isNew) {
      // The edit page re-mounts the editor, so hand the message over in the URL.
      const saved = data.post.draft ? "draft" : "published";
      router.replace(`/admin/edit/${data.post.slug}?saved=${saved}&mode=${data.mode}`);
    } else {
      setSuccess(message);
      router.refresh();
    }
  }

  const slugValid = SLUG_PATTERN.test(slug);

  return (
    <form className="admin-form" onSubmit={handleSave}>
      <div className="admin-bar">
        <h1>{isNew ? "New article" : "Edit article"}</h1>
        <Link className="admin-btn" href="/admin">
          ← All articles
        </Link>
      </div>

      <div className="admin-card admin-form">
        <div className="admin-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(event) => handleTitle(event.target.value)}
          />
        </div>

        <div className="admin-grid">
          <div className="admin-field">
            <label htmlFor="slug">URL</label>
            <input
              id="slug"
              type="text"
              required
              value={slug}
              readOnly={!isNew}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(event.target.value);
              }}
            />
            <p className={`admin-hint${slug && !slugValid ? " bad" : ""}`}>
              {isNew
                ? `techtoday.space/blog/${slug || "…"} — lowercase letters, numbers and dashes`
                : "The URL can't change after publishing (it would break links)."}
            </p>
          </div>
          <div className="admin-field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              required
              list="category-options"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
            <datalist id="category-options">
              {categories.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="excerpt">Short description</label>
          <textarea
            id="excerpt"
            rows={2}
            required
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
          <p className={`admin-hint${excerpt.length > 170 ? " bad" : ""}`}>
            Shown on cards and in Google results. {excerpt.length}/160 characters.
          </p>
        </div>

        <div className="admin-grid">
          <div className="admin-field">
            <label htmlFor="date">Publish date</label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <span className="admin-label" aria-hidden="true">
              &nbsp;
            </span>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={draft}
                onChange={(event) => setDraft(event.target.checked)}
              />
              Save as draft (not shown on the site)
            </label>
          </div>
        </div>

        <div className="admin-field">
          <span className="admin-label">Cover image</span>
          <div className="admin-cover">
            <div className="admin-cover-preview">
              {coverSrc ? <img src={coverSrc} alt="" /> : "No image"}
            </div>
            <div className="admin-form" style={{ gap: 12 }}>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
              <div className="admin-field">
                <label htmlFor="image-url">…or image link</label>
                <input
                  id="image-url"
                  type="url"
                  placeholder="https://"
                  value={imageUpload ? "" : image}
                  disabled={Boolean(imageUpload)}
                  onChange={(event) => setImage(event.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="image-alt">Image description (alt text)</label>
                <input
                  id="image-alt"
                  type="text"
                  required
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="body">Article</label>
          <div className="admin-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "write"}
              onClick={() => setTab("write")}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "preview"}
              onClick={() => setTab("preview")}
            >
              Preview
            </button>
          </div>
          {tab === "write" ? (
            <textarea
              id="body"
              className="body-input"
              required
              value={bodyText}
              onChange={(event) => setBodyText(event.target.value)}
            />
          ) : (
            <div className="admin-preview article-body">
              <ArticleBody blocks={blocks} />
            </div>
          )}
          <p className={`admin-hint${words < 800 ? " bad" : ""}`}>
            {words} words{words < 800 ? " — aim for 800+ for AdSense-quality articles" : ""}
          </p>
          <div className="admin-help">
            <code>## Heading</code> for a section heading · <code>- item</code> for a
            bullet list · <code>&gt; text</code> for a highlighted quote · leave an
            empty line between paragraphs.
          </div>
        </div>
      </div>

      {error && <div className="admin-notice error">{error}</div>}
      {success && (
        <div className="admin-notice success">
          {success}{" "}
          {!draft && (
            <a href={`/blog/${slug}`} target="_blank" rel="noreferrer">
              View article
            </a>
          )}
        </div>
      )}

      <div className="admin-footer-bar">
        <span className="admin-hint">
          {draft ? "Will be saved as a draft." : "Will be published on the site."}
        </span>
        <button className="admin-btn primary" type="submit" disabled={busy || !slugValid}>
          {busy ? "Saving…" : draft ? "Save draft" : isNew ? "Publish" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
