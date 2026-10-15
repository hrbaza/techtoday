import Link from "next/link";
import {
  AUTHOR_BIO,
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
      </div>
    </div>
  );
}
