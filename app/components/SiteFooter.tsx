import Link from "next/link";
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

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label={`${SITE_NAME} — home`}>
            <Logo idPrefix="footer" />
          </Link>
          <p>{SITE_DESCRIPTION}</p>
          <a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>

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

      <div className="container footer-bottom">
        <p>
          © {year} {SITE_NAME}. All rights reserved.
        </p>
        <p>{SITE_TAGLINE}</p>
      </div>
    </footer>
  );
}
