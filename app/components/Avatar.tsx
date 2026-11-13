import { AUTHOR_IMAGE, AUTHOR_NAME } from "@/content/site";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// The author's photo when AUTHOR_IMAGE is set, otherwise their initials on the
// brand gradient — used in bylines and bio boxes.
export default function Avatar({ className = "avatar" }: { className?: string }) {
  if (AUTHOR_IMAGE) {
    return (
      <img
        className={`${className} avatar-photo`}
        src={AUTHOR_IMAGE}
        alt=""
        width={58}
        height={58}
      />
    );
  }
  return (
    <span className={className} aria-hidden="true">
      {initials(AUTHOR_NAME)}
    </span>
  );
}
