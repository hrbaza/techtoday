import { readImage } from "@/lib/posts";

// Serves cover images uploaded through the admin panel and stored in MongoDB.
// Image ids never change content, so browsers and Vercel's CDN can cache them
// forever.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await readImage(id);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
