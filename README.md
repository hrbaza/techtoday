# TechToday

The tech blog at [techtoday.space](https://techtoday.space) — Next.js 16 on
Vercel, with articles stored in MongoDB and written through a password-protected
admin panel at `/admin`.

## Writing articles

Go to [techtoday.space/admin](https://techtoday.space/admin), log in, and use
**New article**. Publishing is instant — saving refreshes the live pages.
Tick **Save as draft** to keep an article off the site while you work on it.

In the article box:

- `## Heading` — a section heading
- `- item` — a bullet list
- `> text` — a highlighted quote
- leave an empty line between paragraphs

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
