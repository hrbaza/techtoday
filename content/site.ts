// Central site configuration. Change SITE_URL to your final custom domain
// (or set NEXT_PUBLIC_SITE_URL in the environment / Vercel project settings).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://techtoday.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "TechToday";
export const SITE_TAGLINE = "Simple explanations of the technology shaping our world.";
export const SITE_DESCRIPTION =
  "TechToday explains AI, robotics, cloud, security and the technology shaping our world in clear, useful language — one story at a time.";

// Contact address shown on the Contact / legal pages.
export const CONTACT_EMAIL = "hamzaarashid00@gmail.com";

// Optional: paste the code from Google Search Console's "HTML tag" verification
// method here, or set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel. Leave
// empty to skip (e.g. if you verify by DNS instead).
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";
