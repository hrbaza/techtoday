// Central site configuration. The live domain is techtoday.space; override it
// per-environment by setting NEXT_PUBLIC_SITE_URL in Vercel if it ever changes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://techtoday.space"
).replace(/\/$/, "");

export const SITE_NAME = "TechToday";
export const SITE_TAGLINE = "Simple explanations of the technology shaping our world.";
export const SITE_DESCRIPTION =
  "TechToday explains AI, robotics, cloud, security and the technology shaping our world in clear, useful language — one story at a time.";

// Contact address shown on the Contact / legal pages.
export const CONTACT_EMAIL = "hamzaarashid00@gmail.com";

// The person behind the site, shown in each article's byline and on the About
// page — a real, named author is a trust signal for readers and for AdSense.
export const AUTHOR_NAME = "Hamza Rashid";

// Optional: paste the code from Google Search Console's "HTML tag" verification
// method here, or set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel. Leave
// empty to skip (e.g. if you verify by DNS instead).
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";

// Google AdSense publisher ID, e.g. "ca-pub-1234567890123456". Set
// NEXT_PUBLIC_ADSENSE_CLIENT in Vercel. When set, the AdSense script and the
// google-adsense-account meta tag are added to every page and /ads.txt is
// served; when empty, none of them are.
export const ADSENSE_CLIENT = (
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ""
).trim();
