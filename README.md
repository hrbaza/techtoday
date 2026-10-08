# TechToday

The tech blog at [techtoday.space](https://techtoday.space) — Next.js 16 on
Vercel, with articles stored in MongoDB and written through a password-protected
admin panel at `/admin`.

## Writing articles

Go to [techtoday.space/admin](https://techtoday.space/admin), log in, and use
**New article**. Publishing is instant — saving refreshes the live pages.
Tick **Save as draft** to keep an article off the site while you work on it.

The article box takes Markdown. Use the toolbar (Bold, Italic, H2, H3, lists,
Link, Quote, Table, Image) or type it:

- `**bold**`, `*italic*` — Ctrl/⌘+B and Ctrl/⌘+I also work; Ctrl/⌘+K adds a link
- `## Heading`, `### Sub-heading`
- `- item` for bullets, `1. item` for a numbered list
- `> text` — a highlighted quote
- `[link text](/blog/article-url)` — a link
- `| A | B |` rows — a table (the toolbar inserts a starter one)
- leave an empty line between paragraphs

Basic HTML such as `<strong>` or `<ul><li>` also works. Everything is rendered
by `lib/markdown.ts` and passed through an allowlist sanitizer, so scripts,
event handlers and `javascript:` links never reach the page. **Preview** shows
the article exactly as it will be published.

Articles saved before the Markdown editor are stored as blocks (`body`); they
are converted on the fly and switch to Markdown (`markdown`) the next time
they are saved.

## Environment variables (Vercel)

| Name | What it is |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (articles and cover images) |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID; adds the ad script, meta tag and `/ads.txt` |
| `NEXT_PUBLIC_SITE_URL` | Optional; defaults to `https://techtoday.space` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional; Search Console HTML-tag verification |

MongoDB Atlas must allow connections from anywhere (`0.0.0.0/0`), because
Vercel's server addresses change.

## Where things live

- `app/` — pages; `app/admin/` and `app/api/admin/` are the admin panel
- `lib/posts.ts` — reading and saving articles; `lib/db.ts` — MongoDB connection
- `content/site.ts` — site name, author, contact email
- `content/posts/*.json` — the original 16 articles, used to seed the database
  and as a read-only fallback when no `MONGODB_URI` is set

## Local development

```bash
npm install
npx vercel env pull .env.local
npm run dev
```

Without `MONGODB_URI`, the site reads `content/posts/` and the admin panel (with
`ADMIN_PASSWORD` set) writes to those files instead.

`npm run db:seed` copies `content/posts/` into MongoDB without overwriting
articles that already exist there.
