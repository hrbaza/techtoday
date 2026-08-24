import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/content/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <Link className="brand" href="/">
            {SITE_NAME}
          </Link>
          <p>{SITE_TAGLINE}</p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
        <p className="copyright">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
