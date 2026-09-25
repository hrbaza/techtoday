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
import ArticleContent from "../../components/ArticleContent";
import ImagePicker from "./ImagePicker";

type Props = {
  initial?: PostFile;
  categories: string[];
  initialMessage?: string;
};

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
  const [midImage, setMidImage] = useState(initial?.midImage ?? "");
  const [midImageUpload, setMidImageUpload] = useState<string | null>(null);
  const [midImageAlt, setMidImageAlt] = useState(initial?.midImageAlt ?? "");
  const [bodyText, setBodyText] = useState(initial ? blocksToText(initial.body) : "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(initialMessage);

  const blocks = useMemo(() => textToBlocks(bodyText), [bodyText]);
  const words = wordCount({ body: blocks });

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
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
        post: {
          slug,
          title,
          category,
          excerpt,
          date,
          draft,
          image,
          imageAlt,
          midImage,
          midImageAlt,
        },
        bodyText,
        imageUpload,
        midImageUpload,
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
    setMidImage(data.post.midImage ?? "");
    setMidImageUpload(null);
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

        <ImagePicker
          id="cover"
          label="Cover image"
          hint="Shown at the top of the article and when the link is shared."
          required
          url={image}
          upload={imageUpload}
          alt={imageAlt}
          defaultAlt={title}
          onUrl={setImage}
          onUpload={setImageUpload}
          onAlt={setImageAlt}
          onError={setError}
        />

        <ImagePicker
          id="mid"
          label="Middle image (optional)"
          hint="Placed automatically halfway through the article, between two sections."
          url={midImage}
          upload={midImageUpload}
          alt={midImageAlt}
          defaultAlt={title}
          onUrl={setMidImage}
          onUpload={setMidImageUpload}
          onAlt={setMidImageAlt}
          onError={setError}
        />

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
              <ArticleContent
                body={blocks}
                midImage={midImageUpload || midImage || undefined}
                midImageAlt={midImageAlt}
              />
            </div>
          )}
          <p className={`admin-hint${words < 800 ? " bad" : ""}`}>
            {words} words{words < 800 ? " — aim for 800+ for AdSense-quality articles" : ""}
          </p>
          <div className="admin-help">
            <code>## Heading</code> for a section heading · <code>- item</code> for a
            bullet list · <code>&gt; text</code> for a highlighted quote ·{" "}
            <code>[link text](/blog/article-url)</code> for a link · leave an empty
            line between paragraphs.
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
