import { Marked, type Token, type TokensList } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Block } from "@/content/articles/types";

// Article bodies are Markdown (GitHub flavour: **bold**, *italic*, lists,
// tables, links, images, > quotes) and may contain a small set of inline HTML
// tags. Everything is rendered here, on the public pages and in the admin
// preview alike, and every result passes through the allowlist sanitizer below
// before it reaches a page.

const marked = new Marked({ gfm: true, breaks: false, async: false });

const ALLOWED_TAGS = [
  "p", "br", "hr", "h2", "h3", "h4",
  "strong", "b", "em", "i", "u", "s", "del", "mark", "sub", "sup", "small",
  "code", "pre", "blockquote", "ul", "ol", "li", "a", "img", "figure",
  "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  "caption", "div", "span",
];

const SITE_HOSTS = new Set(["techtoday.space", "www.techtoday.space"]);

function isExternal(href: string): boolean {
  try {
    return !SITE_HOSTS.has(new URL(href).hostname);
  } catch {
    return false; // relative link, e.g. /blog/some-article
  }
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    ol: ["start", "reversed"],
    th: ["align", "colspan", "rowspan", "scope"],
    td: ["align", "colspan", "rowspan"],
    div: ["class"],
  },
  allowedClasses: { div: ["table-wrap"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  // An image whose src was rejected (e.g. a data: URL) would render empty.
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  transformTags: {
    // The article title is the page's only <h1>.
    h1: "h2",
    a: (tagName, attribs) => {
      const { target: _target, rel: _rel, ...rest } = attribs;
      void _target;
      void _rel;
      return {
        tagName,
        attribs:
          rest.href && isExternal(rest.href)
            ? { ...rest, target: "_blank", rel: "noopener noreferrer" }
            : rest,
      };
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: "lazy" },
    }),
  },
};

// Markdown typed in the admin editor, tidied so old and new syntax both work.
export function normalizeMarkdown(markdown: string): string {
  return markdown
    .replace(/\r\n?/g, "\n")
    .replace(/^(\s*)•\s+/gm, "$1- ") // pasted "•" bullets, accepted by the old editor
    .trim();
}

function toSafeHtml(rawHtml: string): string {
  // Tables scroll sideways on narrow screens instead of breaking the layout.
  const wrapped = rawHtml
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return sanitizeHtml(wrapped, SANITIZE_OPTIONS);
}

function parse(tokens: Token[], links: TokensList["links"]): string {
  const list = Object.assign([...tokens], { links }) as TokensList;
  return toSafeHtml(marked.parser(list));
}

// ── Section anchors ──
// Every <h2> gets an id (from its text, made unique) so the table of contents
// and shared links like /blog/x#section can jump to it. Ids are added after
// sanitizing and only ever contain [a-z0-9-].

export type TocItem = { id: string; text: string };

const H2_BLOCK = /<h2>([\s\S]*?)<\/h2>/g;
const H2_WITH_ID = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
};

function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] !== "#") return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
      const point = code[1] === "x" || code[1] === "X"
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

// Adds ids to the <h2>s of one or more consecutive pieces of an article, so
// ids stay unique when the article is rendered in halves.
function withHeadingIds(parts: string[]): string[] {
  const used = new Map<string, number>();
  const ids = parts
    .flatMap((part) => [...part.matchAll(H2_BLOCK)].map((match) => htmlToText(match[1])))
    .map((text) => {
      const base = slugify(text) || "section";
      const count = (used.get(base) ?? 0) + 1;
      used.set(base, count);
      return count === 1 ? base : `${base}-${count}`;
    });
  let index = 0;
  return parts.map((part) => part.replace(/<h2>/g, () => `<h2 id="${ids[index++]}">`));
}

export function renderMarkdown(markdown: string): string {
  return withHeadingIds([toSafeHtml(marked.parse(normalizeMarkdown(markdown)) as string)])[0];
}

// The article's sections, in order — the same ids renderMarkdown adds.
export function tableOfContents(markdown: string): TocItem[] {
  return [...renderMarkdown(markdown).matchAll(H2_WITH_ID)].map((match) => ({
    id: match[1],
    text: htmlToText(match[2]),
  }));
}

// Renders an article in two halves so the optional middle image can sit
// between them: before the section heading nearest the middle of the article,
// so it lands between two sections rather than mid-thought.
export function renderMarkdownSplit(markdown: string): [string, string] {
  const tokens = marked.lexer(normalizeMarkdown(markdown));
  const blocks = tokens.filter((token) => token.type !== "space");
  const isSection = (token: Token) =>
    token.type === "heading" && (token as { depth: number }).depth <= 2;

  const half = Math.floor(blocks.length / 2);
  let split = half;
  const after = blocks.slice(half).findIndex(isSection);
  if (after >= 0) {
    split = half + after;
  } else {
    for (let i = half - 1; i > 0; i--) {
      if (isSection(blocks[i])) {
        split = i;
        break;
      }
    }
  }
  const [firstHalf, secondHalf] = withHeadingIds([
    parse(blocks.slice(0, split), tokens.links),
    parse(blocks.slice(split), tokens.links),
  ]);
  return [firstHalf, secondHalf];
}

export function markdownWordCount(markdown: string): number {
  return renderMarkdown(markdown)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .split(/\s+/)
    .filter((word) => /\w/.test(word)).length;
}

// Articles written before the Markdown editor are stored as blocks. Their text
// already uses Markdown's syntax for links, headings, quotes and lists, so
// they convert directly.
export function blocksToMarkdown(blocks: Block[]): string {
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
