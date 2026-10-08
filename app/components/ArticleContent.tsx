import { renderMarkdown, renderMarkdownSplit } from "@/lib/markdown";

// An article's body with its optional middle image placed halfway through.
// The HTML comes from renderMarkdown, which sanitizes it with an allowlist.
export default function ArticleContent({
  markdown,
  midImage,
  midImageAlt,
}: {
  markdown: string;
  midImage?: string;
  midImageAlt?: string;
}) {
  if (!midImage) {
    return (
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
      />
    );
  }

  const [before, after] = renderMarkdownSplit(markdown);
  return (
    <>
      <div className="article-prose" dangerouslySetInnerHTML={{ __html: before }} />
      <img
        className="article-image article-image-mid"
        src={midImage}
        alt={midImageAlt ?? ""}
        width={1600}
        height={900}
        loading="lazy"
      />
      <div className="article-prose" dangerouslySetInnerHTML={{ __html: after }} />
    </>
  );
}
