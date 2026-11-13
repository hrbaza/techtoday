import Link from "next/link";
import {
  AUTHOR_BIO,
  AUTHOR_LINKS,
  AUTHOR_NAME,
  AUTHOR_PATH,
  AUTHOR_ROLE,
} from "@/content/site";
import Avatar from "./Avatar";

export default function AuthorBio({ linked = true }: { linked?: boolean }) {
  return (
    <div className="author-bio">
      <Avatar className="author-avatar" />
      <div>
        <p className="author-name">
          {linked ? <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link> : AUTHOR_NAME}
        </p>
        <p className="author-role">{AUTHOR_ROLE}</p>
        <p className="author-text">{AUTHOR_BIO}</p>
        {AUTHOR_LINKS.length > 0 && (
          <p className="author-links">
            {AUTHOR_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer me">
                {link.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
