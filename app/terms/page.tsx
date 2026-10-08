import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms of service for ${SITE_NAME} — the rules for using the site and its content.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Legal</span>
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: October 8, 2026</p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <h2>Agreement to these terms</h2>
          <p>
            These Terms of Service govern your use of {SITE_NAME} at {SITE_URL}{" "}
            (the &ldquo;site&rdquo;). By accessing or using the site, you agree to
            be bound by these terms. If you do not agree with any part of them,
            please do not use the site.
          </p>

          <h2>Use of the site</h2>
          <p>
            {SITE_NAME} is a free technology blog. You may read, share and link
            to our articles for personal, non-commercial purposes. When using the
            site, you agree not to:
          </p>
          <ul className="article-list">
            <li>
              Copy, republish, sell or redistribute our articles or images, in
              whole or in substantial part, without our written permission.
            </li>
            <li>
              Scrape, crawl or harvest content from the site with automated tools
              in a way that places an unreasonable load on it, other than through
              standard search engine indexing.
            </li>
            <li>
              Attempt to gain unauthorised access to the site, its admin area, or
              the systems that run it, or interfere with its normal operation.
            </li>
            <li>Use the site for any unlawful purpose.</li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            Unless otherwise stated, the articles, text, graphics and site design
            on {SITE_NAME} are owned by {SITE_NAME} and protected by copyright.
            Some images are used under licence from third-party providers and
            remain the property of their owners. Short quotations with a clear
            credit and a link back to the original article are welcome.
          </p>

          <h2>Accuracy of information</h2>
          <p>
            We work hard to keep our articles accurate and up to date, but
            technology changes quickly and we cannot guarantee that every detail
            is complete or current. Our content is for general information and
            education only and is not professional advice. Please read our{" "}
            <Link href="/disclaimer">Disclaimer</Link> for more details.
          </p>

          <h2>Advertising and third-party links</h2>
          <p>
            The site may display advertisements served by third parties such as
            Google AdSense, and our articles may link to other websites. We do
            not control and are not responsible for the content, products,
            services or privacy practices of any third-party site or advertiser.
            Visiting them is at your own risk and subject to their own terms.
          </p>

          <h2>Privacy</h2>
          <p>
            Our use of cookies and any information collected when you visit the
            site is described in our{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            The site and its content are provided &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo;, without warranties of any kind. To the
            fullest extent permitted by law, {SITE_NAME} will not be liable for
            any loss or damage arising from your use of, or inability to use, the
            site or from reliance on any information published on it.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. When we do, we will
            revise the &ldquo;Last updated&rdquo; date at the top of this page.
            Continuing to use the site after changes are posted means you accept
            the updated terms.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have any questions about these terms, please email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
