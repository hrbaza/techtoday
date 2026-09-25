import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "@/content/articles";

// Inline links use Markdown syntax: [link text](/blog/some-article) or
// [link text](https://example.com). Anything else is rendered as plain text.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const start = match.index;
    const internal = href.startsWith("/") && !href.startsWith("//");
    const external = /^https?:\/\//.test(href);
    if (!internal && !external) continue;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      internal ? (
        <Link key={start} href={href}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    last = start + whole.length;
  }
  if (last === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return <h2 key={index}>{block.text}</h2>;
          case "quote":
            return (
              <div className="quote" key={index}>
                {renderInline(block.text)}
              </div>
            );
          case "list":
            return (
              <ul className="article-list" key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "p":
          default:
            return <p key={index}>{renderInline(block.text)}</p>;
        }
      })}
    </>
  );
}
