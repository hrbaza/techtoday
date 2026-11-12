import { SITE_URL } from "@/content/site";

// Widths the site serves images at. /media/<id>?w= only accepts these, so the
// resizer can't be asked for arbitrary sizes, and every variant is cached.
export const IMAGE_WIDTHS = [320, 480, 768, 1080, 1600] as const;

const MEDIA_PREFIX = "/media/";

// Builds the URL for one width of an image, or null when the host can't
// resize it (local files, unknown external hosts).
function sized(src: string, width: number): string | null {
  if (src.startsWith(MEDIA_PREFIX)) return `${src.split("?")[0]}?w=${width}`;
  try {
    const url = new URL(src);
    // Seed articles use Unsplash, which resizes through its own `w` parameter.
    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("w", String(width));
      return url.toString();
    }
  } catch {
    // A site-relative path that isn't /media/: served as it is.
  }
  return null;
}

// src/srcSet/sizes for an <img>, so phones download a small file instead of
// the full 1600px original. `sizes` describes how wide the image is drawn.
export function responsiveImage(
  src: string,
  sizes: string,
): { src: string; srcSet?: string; sizes?: string } {
  const variants = IMAGE_WIDTHS.map((width) => {
    const url = sized(src, width);
    return url ? `${url} ${width}w` : null;
  });
  if (variants.some((variant) => variant === null)) return { src };
  return { src: sized(src, 1080) ?? src, srcSet: variants.join(", "), sizes };
}

// Absolute URL for structured data and social tags, which must not be relative.
export function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith("/") ? `${SITE_URL}${pathOrUrl}` : pathOrUrl;
}
