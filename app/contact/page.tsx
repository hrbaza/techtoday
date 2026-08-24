import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team — questions, feedback, corrections, and topic suggestions are all welcome.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Contact</span>
          <h1>Get in touch</h1>
          <p className="lead">
            We would love to hear from you. Questions, feedback, corrections, and
            ideas for future articles are always welcome.
          </p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <h2>Email us</h2>
          <p>
            The best way to reach {SITE_NAME} is by email. We read every message
            and do our best to reply as quickly as we can.
          </p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>

          <h2>What you can write to us about</h2>
          <ul className="article-list">
            <li>Questions about anything we have covered on the site</li>
            <li>Corrections — if you spot an error, please let us know</li>
            <li>Suggestions for topics you would like us to explain</li>
            <li>General feedback about the site and how we can improve it</li>
          </ul>

          <h2>Response time</h2>
          <p>
            We are a small team, so please allow a few days for a reply during
            busy periods. We genuinely value every message and appreciate you
            taking the time to get in touch.
          </p>

          <h2>A note on advice</h2>
          <p>
            We are happy to point you toward helpful resources, but please note
            that our articles and replies are for general information only and
            are not professional, legal, medical, or financial advice. For
            decisions that matter, always consult a qualified professional.
          </p>
        </div>
      </section>
    </main>
  );
}
