import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `The disclaimer for ${SITE_NAME} — the information on this site is provided for general educational purposes only.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Legal</span>
          <h1>Disclaimer</h1>
          <p className="lead">Last updated: August 24, 2026</p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <h2>General information only</h2>
          <p>
            The information provided by {SITE_NAME} on {SITE_URL} is for general
            informational and educational purposes only. All content is offered
            in good faith; however, we make no representation or warranty of any
            kind, express or implied, regarding the accuracy, adequacy,
            validity, reliability, availability, or completeness of any
            information on the site.
          </p>

          <h2>Not professional advice</h2>
          <p>
            The content on {SITE_NAME} is not intended to be a substitute for
            professional advice. This includes, but is not limited to,
            professional, technical, financial, medical, or legal advice. Before
            taking any action based on information you read here, we strongly
            encourage you to consult with an appropriately qualified
            professional. Your reliance on any information on this site is
            strictly at your own risk.
          </p>

          <h2>External links</h2>
          <p>
            Our site may contain links to other websites or content belonging to
            or originating from third parties. Such external links are not
            investigated or monitored by us for accuracy, adequacy, validity,
            reliability, or completeness. We do not warrant, endorse, guarantee,
            or assume responsibility for the accuracy or reliability of any
            information offered by third-party websites linked through the site.
          </p>

          <h2>Technology and information changes</h2>
          <p>
            Technology moves quickly. While we work to keep our articles accurate
            and up to date, details, products, services, and best practices can
            change after publication. We cannot guarantee that every article
            reflects the very latest developments at the time you read it.
          </p>

          <h2>Affiliate and advertising disclosure</h2>
          <p>
            {SITE_NAME} may display third-party advertising and may, from time to
            time, include affiliate links. This means we could earn a small
            commission if you click certain links or make a purchase, at no extra
            cost to you. This does not influence the topics we choose or the
            honesty of our writing.
          </p>

          <h2>Consent</h2>
          <p>
            By using our website, you hereby consent to this disclaimer and agree
            to its terms. If you have any questions about it, please reach us
            through our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
