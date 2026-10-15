import { AUTHOR_NAME } from "@/content/site";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// The author's initials on the brand gradient — used in bylines and bio boxes.
export default function Avatar({ className = "avatar" }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {initials(AUTHOR_NAME)}
    </span>
  );
}
