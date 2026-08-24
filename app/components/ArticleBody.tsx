import type { Block } from "@/content/articles";

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
                {block.text}
              </div>
            );
          case "list":
            return (
              <ul className="article-list" key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "p":
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </>
  );
}
