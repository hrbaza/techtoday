"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
            <strong>Thank you for subscribing!</strong>
            <p>Your first issue will arrive next Friday.</p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (email) setSubscribed(true);
            }}
          >
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
