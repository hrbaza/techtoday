import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main>
      <section className="page-hero not-found">
        <div className="container">
          <span className="tag">Error 404</span>
          <h1>This page drifted out of orbit</h1>
          <p className="lead">
            The link may be old, or the page may have moved. Head back home or
            browse every article instead.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/">
              Back to home
            </Link>
            <Link className="ghost-button" href="/blog">
              Browse all articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
