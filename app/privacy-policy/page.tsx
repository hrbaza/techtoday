import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `The privacy policy for ${SITE_NAME} — what information we collect, how cookies and advertising partners work, and your choices.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="tag">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: August 24, 2026</p>
        </div>
      </section>

      <section className="prose-section">
        <div className="container prose">
          <p>
            At {SITE_NAME} (accessible from {SITE_URL}), the privacy of our
            visitors is important to us. This Privacy Policy explains what
            information we collect, how we use it, and the choices you have. By
            using our website, you agree to the terms described here.
          </p>

          <h2>Information we collect</h2>
          <p>
            We aim to collect as little personal information as possible. If you
            contact us by email, we receive the details you choose to share, such
            as your name and email address, so that we can reply. If you
            subscribe to our newsletter, we collect the email address you
            provide. We do not require you to create an account to read our
            articles.
          </p>

          <h2>Log files</h2>
          <p>
            Like most websites, {SITE_NAME} may use standard log files. These may
            record information such as your browser type, internet service
            provider, referring and exit pages, and the date and time of your
            visit. This information is not linked to any personally identifiable
            information and is used to analyse trends and administer the site.
          </p>

          <h2>Cookies and web beacons</h2>
          <p>
            {SITE_NAME} uses cookies to store information about visitors&rsquo;
            preferences and the pages they access or visit, and to help improve
            your experience by customising our content. Cookies are small files
            saved to your device. You can choose to disable cookies through your
            browser settings, though doing so may affect how some parts of the
            site function.
          </p>

          <h2>Advertising and third-party partners</h2>
          <p>
            We may display advertising to support our work. Third-party ad
            networks, including Google, may use cookies, web beacons, and similar
            technologies to serve ads based on your prior visits to this and
            other websites. This allows them and their partners to show ads that
            may be more relevant to you.
          </p>
          <ul className="article-list">
            <li>
              Third-party vendors, including Google, use cookies to serve ads
              based on a user&rsquo;s previous visits to our website or other
              websites.
            </li>
            <li>
              Google&rsquo;s use of advertising cookies enables it and its
              partners to serve ads to our users based on their visit to our site
              and/or other sites on the internet.
            </li>
            <li>
              You may opt out of personalised advertising by visiting
              Google&rsquo;s Ads Settings, or opt out of a third-party
              vendor&rsquo;s use of cookies for personalised advertising by
              visiting www.aboutads.info.
            </li>
          </ul>
          <p>
            We do not control the cookies used by third-party advertisers. We
            encourage you to review the privacy policies of any third-party ad
            servers for detailed information on their practices, as well as
            instructions about how to opt out of certain options.
          </p>

          <h2>Analytics</h2>
          <p>
            We may use analytics services to understand how visitors use our
            site — for example, which articles are most popular. These services
            may collect information such as pages viewed and general location,
            in an aggregated and anonymous form, to help us improve our content.
          </p>

          <h2>Your choices</h2>
          <p>
            You can manage or disable cookies through your browser settings, opt
            out of personalised advertising through the links above, and
            unsubscribe from our newsletter at any time using the link in any
            email we send. If you would like us to delete any information you
            have shared with us, please contact us.
          </p>

          <h2>Children&rsquo;s information</h2>
          <p>
            {SITE_NAME} does not knowingly collect any personally identifiable
            information from children under the age of 13. If you believe your
            child has provided such information on our website, please contact us
            and we will make our best efforts to remove it promptly.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with an updated revision date. We encourage
            you to review this page periodically to stay informed about how we
            protect your information.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can reach us
            at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through
            our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
