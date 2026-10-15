import Link from "next/link";
import { getArticles, type Article } from "@/content/articles";
import {
  AUTHOR_PATH,
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/content/site";
import Logo from "./Logo";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "All articles" },
      { href: AUTHOR_PATH, label: "Our author" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

async function latestArticles(): Promise<Article[]> {
  try {
    return (await getArticles()).slice(0, 3);
  } catch {
    return []; // the footer should never take a page down
  }
}

// A dark footer on every page: a call to action, the latest articles, site
// links, and a large faded wordmark along the bottom.
export default async function SiteFooter() {
  const year = new Date().getFullYear();
  const latest = await latestArticles();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <div>
            <p className="footer-eyebrow">Stay curious</p>
            <h2>Technology, explained without the hype.</h2>
            <p>
              Clear, honest explainers on AI, computing, security and the
              systems shaping everyday life.
            </p>
          </div>
          <div className="footer-cta-actions">
            <Link className="footer-btn footer-btn-light" href="/blog">
              Read the latest <span className="arrow">→</span>
            </Link>
            <Link className="footer-btn footer-btn-ghost" href="/contact">
              Suggest a topic
            </Link>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/" aria-label={`${SITE_NAME} — home`}>
              <Logo idPrefix="footer" />
            </Link>
            <p>{SITE_DESCRIPTION}</p>
            <a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {CONTACT_EMAIL}
            </a>
          </div>

          {latest.length > 0 && (
            <nav className="footer-col footer-latest" aria-label="Latest articles">
              <p className="footer-heading">Latest articles</p>
              {latest.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`}>
                  <span className="footer-latest-title">{article.title}</span>
                  <span className="footer-latest-meta">
                    {article.category} · {article.readTime}
                  </span>
                </Link>
              ))}
            </nav>
          )}

          {COLUMNS.map((column) => (
            <nav key={column.heading} className="footer-col" aria-label={column.heading}>
              <p className="footer-heading">{column.heading}</p>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="footer-tagline">{SITE_TAGLINE}</p>
          <a className="footer-top" href="#main-content">
            Back to top
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        {SITE_NAME}
      </div>
    </footer>
  );
}
