import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR_NAME, SITE_NAME } from "@/content/site";
import AuthorBio from "../components/AuthorBio";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_NAME} — who we are, what we cover, and our commitment to clear, honest, jargon-free technology writing.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">About us</span>
          <h1>About {SITE_NAME}</h1>
          <p className="lead">
            Clear, honest explanations of the technology shaping our world —
            written for curious people, not just experts.
          </p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <h2>Our mission</h2>
          <p>
            {SITE_NAME} exists to make modern technology understandable. Every
            day brings new headlines about artificial intelligence, robotics,
            cybersecurity, and the systems that quietly run our digital lives.
            Too often that news is buried in jargon, hype, or fear. Our goal is
            simple: to explain what is really happening in plain language, so
            that anyone can follow along and make sense of it.
          </p>

          <h2>What we cover</h2>
          <p>
            We write in-depth guides and explainers across the topics that
            matter most in technology today — including artificial intelligence
            and machine learning, robotics and automation, cloud and edge
            computing, cybersecurity, connectivity, health technology, and the
            infrastructure and energy systems that power it all. Each article is
            written to stand on its own and to be genuinely useful, whether you
            are a student, a professional, or simply curious.
          </p>

          <h2>How we write</h2>
          <p>
            We believe good technology writing respects the reader. That means
            avoiding unnecessary jargon, explaining ideas from first principles,
            and being honest about what a technology can and cannot do. We are
            just as interested in the limits and trade-offs of a new tool as in
            its promise, because that balanced view is what helps people make
            good decisions.
          </p>
          <p>
            Our articles are researched and written to be clear and accurate. We
            aim to explain concepts rather than chase every passing rumour, so
            the guides you read here should remain useful well beyond the news
            cycle.
          </p>

          <h2>Who writes {SITE_NAME}</h2>
          <p>
            {SITE_NAME} is an independent technology blog founded and written by{" "}
            {AUTHOR_NAME}. Every article is researched and written by hand — we
            are not affiliated with any of the companies or products we cover,
            and we write about technology strictly on its merits.
          </p>
          <AuthorBio />

          <h2>Get in touch</h2>
          <p>
            We welcome questions, corrections, and suggestions for topics you
            would like us to explain. You can reach us anytime through our{" "}
            <Link href="/contact">contact page</Link>. If you find our work
            useful, the best thing you can do is share an article with someone
            who might enjoy it too.
          </p>
        </div>
      </section>
    </main>
  );
}
