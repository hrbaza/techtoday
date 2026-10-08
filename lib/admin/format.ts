export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function savedMessage(saved: string, mode?: string): string {
  if (saved === "draft") return "Saved as a draft. It is not visible on the site.";
  return mode === "mongo" ? "Published! It is live on the site now." : "Published!";
}
