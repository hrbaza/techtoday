"use client";

import { useState } from "react";
import { CONTACT_EMAIL, SITE_NAME } from "@/content/site";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    // No mailing-list backend is configured, so we open a real, pre-addressed
    // email to the site inbox rather than pretending to store the address.
    const subject = encodeURIComponent(`${SITE_NAME} newsletter signup`);
    const body = encodeURIComponent(
      `Please add this address to the ${SITE_NAME} newsletter: ${email}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubscribed(true);
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="container newsletter-inner">
        <div>
          <span>Weekly newsletter</span>
          <h2>Understand technology without the hype.</h2>
          <p>Get one clear, useful technology story in your inbox every Friday.</p>
        </div>
        {subscribed ? (
          <div className="thanks" role="status">
            <strong>Almost there!</strong>
            <p>
              Your email app should open with a pre-filled signup message — just
              hit send and we&rsquo;ll add you to the list.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <label htmlFor="email">Email address</label>
            <div>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit">Subscribe</button>
            </div>
            <small>You can unsubscribe at any time.</small>
          </form>
        )}
      </div>
    </section>
  );
}
