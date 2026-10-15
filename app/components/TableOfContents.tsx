"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";

// Offset below the sticky header at which a section counts as "being read".
const ACTIVE_LINE = 140;

// "On this page": links to the article's sections, highlighting the one being
// read. A sticky box beside the text on desktop; collapsible above it on phones.
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= ACTIVE_LINE) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <button
        type="button"
        className="toc-toggle"
        aria-expanded={open}
        aria-controls="toc-list"
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          On this page <span className="toc-count">· {items.length} sections</span>
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ol id="toc-list" className="toc-list" data-open={open}>
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="toc-num">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
