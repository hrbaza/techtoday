import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  title: {
    default: `${SITE_NAME} — Technology explained clearly`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Technology explained clearly`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: `${SITE_NAME} — technology explained clearly`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Technology explained clearly`,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag Multitag ad script (zone 272780) */}
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="272780"
          data-cfasync="false"
          async
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
