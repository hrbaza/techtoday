"use client";

import { useState } from "react";

const stories = [
  {
    category: "AI & Work",
    title: "How AI agents are changing everyday work",
    text: "AI agents can now organize information, prepare documents, monitor projects, and complete repetitive steps. The most useful systems still keep people in control of important decisions.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=82",
    alt: "Close-up of a modern computer circuit board",
  },
  {
    category: "Robotics",
    title: "Robots are moving beyond the factory floor",
    text: "Better sensors, smaller models, and improved batteries are helping robots enter warehouses, hospitals, offices, and public spaces in practical new roles.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=82",
    alt: "White humanoid robot in a technology laboratory",
  },
  {
    category: "Infrastructure",
    title: "The hidden data centers powering the AI boom",
    text: "Every AI answer depends on physical infrastructure: chips, cooling systems, fiber networks, and enormous data centers designed to run around the clock.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
    alt: "Rows of illuminated servers inside a data center",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home">TechToday</a>
          <nav aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#article">Latest</a>
            <a href="#stories">Technology</a>
            <a href="#newsletter">Newsletter</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="tag">Trending technology</span>
            <h1>AI agents are becoming the next big step in computing</h1>
            <p className="lead">Artificial intelligence is moving from answering questions to completing useful tasks. Here is what that change means, why it matters, and what to watch next.</p>
            <a className="primary-button" href="#article">Read the full article</a>
          </div>
          <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85" alt="Abstract visualization of artificial intelligence and digital connections" />
        </div>
      </section>

      <section className="article-section" id="article">
        <div className="article-layout container">
          <article className="article-body">
            <div className="article-meta"><span>Artificial Intelligence</span><span>August 24, 2026</span><span>8 minute read</span></div>
            <h2>What exactly is an AI agent?</h2>
            <p>An AI agent is a software system that can understand a goal, decide which steps are needed, use digital tools, and check whether the work has been completed. A normal chatbot usually responds to one request at a time. An agent can continue working through a longer process.</p>
            <p>For example, you might ask an agent to research a travel plan. Instead of only suggesting destinations, it could compare schedules, organize prices, create an itinerary, and prepare a list of actions for your approval. In a workplace, an agent might collect project updates, summarize customer messages, or draft a weekly report from several trusted sources.</p>

            <img className="article-image" src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=84" alt="A colorful digital brain representing artificial intelligence" />
            <span className="caption">Modern AI systems combine language models with tools, data, and human approval.</span>

            <h2>Why is this happening now?</h2>
            <p>Recent language models have become better at following instructions, understanding context, writing code, and working with different kinds of information. At the same time, software companies are giving these models safer ways to search databases, open applications, and perform approved actions.</p>
            <p>The result is a new layer of computing. Instead of learning every menu and setting, a person can describe the outcome they want. The agent translates that request into a series of smaller actions. This could make complicated software easier to use, especially for people who are not technical experts.</p>

            <div className="quote">“The most valuable AI will not simply give us more information. It will help turn information into useful action.”</div>

            <h2>What AI agents can do today</h2>
            <p>Current agents are best at structured, reviewable tasks. They can search and summarize documents, categorize support requests, prepare presentations, analyze tables, write first drafts, and help software developers test or improve code. They are also useful for monitoring information and notifying a person when something needs attention.</p>
            <p>However, agents are not perfect employees. They can misunderstand instructions, use incomplete information, or make confident mistakes. Reliable systems need clear limits, permission controls, activity logs, and human review before sensitive actions are completed.</p>

            <h2>What this means for people</h2>
            <p>The near-term story is more about collaboration than replacement. People will increasingly define goals, provide context, review results, and decide when an automated system is allowed to act. Good judgment, communication, subject knowledge, and the ability to verify information will become even more important.</p>
            <p>For everyday users, the best approach is simple: begin with low-risk tasks, check the sources behind important claims, and never give an AI tool more access than it needs. The technology is moving quickly, but trust should be earned one useful result at a time.</p>
          </article>

          <aside className="sidebar">
            <div className="side-box">
              <h3>In this article</h3>
              <a href="#article">What is an AI agent?</a>
              <a href="#article">Why now?</a>
              <a href="#article">What can agents do?</a>
              <a href="#article">What it means for people</a>
            </div>
            <div className="side-box key-points">
              <h3>Key points</h3>
              <p>Agents work toward goals, not just single prompts.</p>
              <p>They combine AI models with tools and trusted data.</p>
              <p>Human approval remains essential for important decisions.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="more-stories" id="stories">
        <div className="container">
          <div className="section-title"><div><span>More to explore</span><h2>Latest technology stories</h2></div><a href="#stories">View all stories</a></div>
          <div className="story-grid">
            {stories.map((story) => (
              <article className="story-card" key={story.title}>
                <img src={story.image} alt={story.alt} />
                <div className="story-content"><span>{story.category}</span><h3>{story.title}</h3><p>{story.text}</p><a href="#article">Read article →</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter" id="newsletter">
        <div className="container newsletter-inner">
          <div><span>Weekly newsletter</span><h2>Understand technology without the hype.</h2><p>Get one clear, useful technology story in your inbox every Friday.</p></div>
          {subscribed ? <div className="thanks" role="status"><strong>Thank you for subscribing!</strong><p>Your first issue will arrive next Friday.</p></div> : <form onSubmit={(event) => { event.preventDefault(); if (email) setSubscribed(true); }}><label htmlFor="email">Email address</label><div><input id="email" type="email" required placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit">Subscribe</button></div><small>You can unsubscribe at any time.</small></form>}
        </div>
      </section>

      <footer id="about"><div className="container footer-inner"><div><a className="brand" href="#home">TechToday</a><p>Simple explanations of the technology shaping our world.</p></div><div className="footer-links"><a href="#home">Home</a><a href="#article">Latest</a><a href="#stories">Technology</a><a href="#newsletter">Newsletter</a></div><p className="copyright">© 2026 TechToday</p></div></footer>
    </main>
  );
}
