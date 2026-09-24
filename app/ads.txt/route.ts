import { ADSENSE_CLIENT } from "@/content/site";

export const dynamic = "force-static";

// Serves /ads.txt for Google AdSense. The publisher ID comes from
// NEXT_PUBLIC_ADSENSE_CLIENT ("ca-pub-…"); ads.txt uses it without "ca-".
export function GET() {
  if (!ADSENSE_CLIENT) {
    return new Response("Not found", { status: 404 });
  }
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");
  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
