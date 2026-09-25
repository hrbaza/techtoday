import { midImageIndex, type Block } from "@/content/articles/types";
import ArticleBody from "./ArticleBody";

// An article's body with its optional middle image placed halfway through.
export default function ArticleContent({
  body,
  midImage,
  midImageAlt,
}: {
  body: Block[];
  midImage?: string;
  midImageAlt?: string;
}) {
  if (!midImage) return <ArticleBody blocks={body} />;

  const split = midImageIndex(body);
  return (
    <>
      <ArticleBody blocks={body.slice(0, split)} />
      <img
        className="article-image article-image-mid"
        src={midImage}
        alt={midImageAlt ?? ""}
        width={1600}
        height={900}
        loading="lazy"
      />
      <ArticleBody blocks={body.slice(split)} />
    </>
  );
}
