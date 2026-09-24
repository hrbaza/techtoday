import type { StoreMode } from "@/lib/admin/store";

export default function StoreNotice({ mode }: { mode: StoreMode }) {
  if (mode === "unconfigured") {
    return (
      <div className="admin-notice error">
        <strong>Saving is switched off.</strong> Add a <code>GITHUB_TOKEN</code>{" "}
        environment variable in Vercel (a GitHub token with Contents read &amp;
        write access to the techtoday repo), then redeploy.
      </div>
    );
  }
  if (mode === "local") {
    return (
      <div className="admin-notice warn">
        <strong>Local mode:</strong> changes are written to this computer&rsquo;s
        files only. They go live after you commit and push them.
      </div>
    );
  }
  return (
    <div className="admin-notice info">
      Saving publishes to GitHub, and the live site updates about a minute later.
    </div>
  );
}
