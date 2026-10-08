"use client";

import { useRef, useState } from "react";
import { resizeImage } from "./ImagePicker";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
  slug: string; // used to name uploaded images
};

// Heading, list and quote markers at the start of a line.
const LINE_PREFIX = /^(#{1,6}\s+|[-*+•]\s+|\d+[.)]\s+|>\s?)/;

const TABLE_TEMPLATE = [
  "| Column 1 | Column 2 | Column 3 |",
  "| --- | --- | --- |",
  "| Cell | Cell | Cell |",
  "| Cell | Cell | Cell |",
].join("\n");

function normalizeUrl(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  if (/^(https?:\/\/|mailto:|\/)/i.test(url)) return url;
  if (/^[\w-]+(\.[\w-]+)+/.test(url)) return `https://${url}`;
  return null;
}

// A Markdown textarea with a formatting toolbar. Every button edits the text
// through the browser's own insert command, so Ctrl+Z undoes it as usual.
export default function MarkdownEditor({ value, onChange, onError, slug }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Replaces text[start, end) with `text`, then selects [selStart, selEnd).
  function replace(start: number, end: number, text: string, selStart: number, selEnd: number) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(start, end);
    if (!document.execCommand("insertText", false, text)) {
      el.setRangeText(text, start, end, "end");
    }
    el.setSelectionRange(selStart, selEnd);
    onChange(el.value);
  }

  function wrap(marker: string, placeholder: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value: text } = el;
    const m = marker.length;
    const before = text.slice(start - m, start);
    const after = text.slice(end, end + m);
    // For *italic*, a "*" that belongs to **bold** doesn't count.
    const partOfBold = marker === "*" && text[start - 2] === "*" && text[start - 3] !== "*";
    if (before === marker && after === marker && !partOfBold) {
      replace(start - m, end + m, text.slice(start, end), start - m, end - m);
      return;
    }
    const selected = text.slice(start, end) || placeholder;
    replace(start, end, `${marker}${selected}${marker}`, start + m, start + m + selected.length);
  }

  function prefixLines(kind: "h2" | "h3" | "ul" | "ol" | "quote") {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value: text } = el;
    // The whole lines the selection touches; a selection that ends right after
    // a line break doesn't include the line below it.
    const start = text.lastIndexOf("\n", selectionStart - 1) + 1;
    const last =
      selectionEnd > selectionStart && text[selectionEnd - 1] === "\n"
        ? selectionEnd - 1
        : selectionEnd;
    const lineEnd = text.indexOf("\n", last);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const lines = text.slice(start, end).split("\n");

    const prefixFor = (index: number) =>
      ({ h2: "## ", h3: "### ", ul: "- ", ol: `${index + 1}. `, quote: "> " })[kind];
    const has = (line: string) =>
      ({
        h2: /^##\s/.test(line),
        h3: /^###\s/.test(line),
        ul: /^[-*+•]\s/.test(line),
        ol: /^\d+[.)]\s/.test(line),
        quote: /^>/.test(line),
      })[kind];

    const filled = lines.filter((line) => line.trim());
    const removing = filled.length > 0 && filled.every(has);
    let count = 0;
    const next = lines
      .map((line) => {
        if (!line.trim()) return line;
        const bare = line.replace(LINE_PREFIX, "");
        return removing ? bare : `${prefixFor(count++)}${bare}`;
      })
      .join("\n");
    replace(start, end, next, start, start + next.length);
  }

  function link() {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value: text } = el;
    const input = window.prompt("Link address (e.g. /blog/article-url or https://…)", "https://");
    if (input === null) return;
    const url = normalizeUrl(input);
    if (!url) {
      onError("That link address doesn't look right. Use /blog/… or a full https:// address.");
      return;
    }
    const label = text.slice(start, end) || "link text";
    replace(start, end, `[${label}](${url})`, start + 1, start + 1 + label.length);
  }

  // Inserts a block (table, image) on its own lines, with blank lines around it.
  function insertBlock(block: string, selectFrom: number, selectLength: number) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value: text } = el;
    const before = text.slice(0, start);
    const lead = !before.trim() ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const after = text.slice(end);
    const trail = after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    const inserted = `${lead}${block}${trail}`;
    const at = start + lead.length + selectFrom;
    replace(start, end, inserted, at, at + selectLength);
  }

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    // Remember the cursor: the textarea loses focus while the upload runs.
    const el = ref.current;
    const selection = el ? [el.selectionStart, el.selectionEnd] : null;
    setUploading(true);
    try {
      const upload = await resizeImage(file);
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "image", slug, upload }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
      const alt = (window.prompt("Describe the image (alt text, for readers and Google)", "") ?? "")
        .replace(/[[\]]/g, "")
        .trim();
      if (el && selection) el.setSelectionRange(selection[0], selection[1]);
      insertBlock(`![${alt}](${data.url})`, 0, 0);
    } catch (error) {
      onError(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "The image could not be uploaded. Try a JPEG or PNG.",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
    const key = event.key.toLowerCase();
    const shortcuts: Record<string, Tool> = { b: "bold", i: "italic", k: "link" };
    if (!shortcuts[key]) return;
    runTool(shortcuts[key]);
    event.preventDefault();
  }

  type Tool = "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "quote" | "table" | "image";

  function runTool(tool: Tool) {
    switch (tool) {
      case "bold":
        return wrap("**", "bold text");
      case "italic":
        return wrap("*", "italic text");
      case "link":
        return link();
      case "table":
        return insertBlock(TABLE_TEMPLATE, 2, "Column 1".length);
      case "image":
        return fileRef.current?.click();
      default:
        return prefixLines(tool);
    }
  }

  const tools: { id: Tool; label: React.ReactNode; title: string }[] = [
    { id: "bold", label: <b>B</b>, title: "Bold (Ctrl+B)" },
    { id: "italic", label: <i>I</i>, title: "Italic (Ctrl+I)" },
    { id: "h2", label: "H2", title: "Section heading" },
    { id: "h3", label: "H3", title: "Sub-heading" },
    { id: "ul", label: "• List", title: "Bullet list" },
    { id: "ol", label: "1. List", title: "Numbered list" },
    { id: "link", label: "Link", title: "Link (Ctrl+K)" },
    { id: "quote", label: "❝ Quote", title: "Highlighted quote" },
    { id: "table", label: "Table", title: "Insert a table" },
    {
      id: "image",
      label: uploading ? "Uploading…" : "Image",
      title: "Upload an image into the article",
    },
  ];

  return (
    <div className="md-editor">
      <div className="md-toolbar" role="toolbar" aria-label="Formatting">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            title={tool.title}
            aria-label={tool.title}
            disabled={uploading && tool.id === "image"}
            // Keep the text selection in the textarea while clicking.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runTool(tool.id)}
          >
            {tool.label}
          </button>
        ))}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleImage}
        />
      </div>
      <textarea
        id="body"
        ref={ref}
        className="body-input"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
