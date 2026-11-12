import sharp from "sharp";
import { IMAGE_WIDTHS } from "@/lib/images";
import { readImage } from "@/lib/posts";

// Serves cover images uploaded through the admin panel and stored in MongoDB.
// With ?w=<width> (one of IMAGE_WIDTHS) it returns a resized WebP, so phones
// get a small file; without it, the original. Image ids never change content,
// so browsers and Vercel's CDN can cache every variant forever.
const CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const widthParam = new URL(request.url).searchParams.get("w");
  const width = widthParam === null ? null : Number(widthParam);
  if (width !== null && !(IMAGE_WIDTHS as readonly number[]).includes(width)) {
    return new Response("Unsupported width", { status: 400 });
  }

  const image = await readImage(id);
  if (!image) return new Response("Not found", { status: 404 });

  if (width !== null) {
    try {
      const resized = await sharp(image.data)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 74 })
        .toBuffer();
      return new Response(new Uint8Array(resized), {
        headers: { "Content-Type": "image/webp", "Cache-Control": CACHE },
      });
    } catch (error) {
      // An image sharp can't read is still served in its original form.
      console.error("[media] resize failed", id, error);
    }
  }

  return new Response(new Uint8Array(image.data), {
    headers: { "Content-Type": image.contentType, "Cache-Control": CACHE },
  });
}
