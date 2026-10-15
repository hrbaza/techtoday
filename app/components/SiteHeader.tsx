import Link from "next/link";
import { SITE_NAME } from "@/content/site";
import HeaderNav from "./HeaderNav";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <HeaderNav>
      <Link className="brand" href="/" aria-label={`${SITE_NAME} — home`}>
        <Logo idPrefix="header" />
      </Link>
    </HeaderNav>
  );
}
