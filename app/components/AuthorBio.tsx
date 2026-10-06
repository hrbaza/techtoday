import Link from "next/link";
import {
  AUTHOR_BIO,
  AUTHOR_NAME,
  AUTHOR_PATH,
  AUTHOR_ROLE,
} from "@/content/site";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AuthorBio({ linked = true }: { linked?: boolean }) {
  return (
    <div className="author-bio">
      <div className="author-avatar" aria-hidden="true">
        {initials(AUTHOR_NAME)}
      </div>
      <div>
        <p className="author-name">
          {linked ? <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link> : AUTHOR_NAME}
        </p>
        <p className="author-role">{AUTHOR_ROLE}</p>
        <p className="author-text">{AUTHOR_BIO}</p>
      </div>
    </div>
  );
}
