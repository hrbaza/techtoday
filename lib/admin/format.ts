import type { Block } from "@/content/articles/types";

// The admin editor uses a small plain-text format for article bodies:
//
//   ## Heading
//   > A pull quote
//   - List item
//   Anything else is a paragraph; separate paragraphs with a blank line.

export function blocksToText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `## ${block.text}`;
        case "quote":
          return `> ${block.text}`;
        case "list":
          return block.items.map((item) => `- ${item}`).join("\n");
        default:
          return block.text;
      }
    })
    .join("\n\n");
}

export function textToBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    if (quote.length) blocks.push({ type: "quote", text: quote.join(" ") });
    if (list.length) blocks.push({ type: "list", items: list });
    paragraph = [];
    quote = [];
    list = [];
  };

  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flush();
    } else if (/^#{1,6}\s+/.test(line)) {
      flush();
      blocks.push({ type: "h2", text: line.replace(/^#{1,6}\s+/, "") });
    } else if (line.startsWith(">")) {
      if (!quote.length) flush();
      quote.push(line.replace(/^>\s*/, ""));
    } else if (/^[-*•]\s+/.test(line)) {
      if (!list.length) flush();
      list.push(line.replace(/^[-*•]\s+/, ""));
    } else {
      if (!paragraph.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function savedMessage(saved: string, mode?: string): string {
  if (saved === "draft") return "Saved as a draft. It is not visible on the site.";
  return mode === "mongo" ? "Published! It is live on the site now." : "Published!";
}
