import { backend, canWrite } from "@/lib/posts";

export default function StoreNotice() {
  if (!canWrite()) {
    return (
      <div className="admin-notice error">
        <strong>Saving is switched off.</strong> Connect MongoDB in Vercel so
        the <code>MONGODB_URI</code> environment variable is set, then redeploy.
      </div>
    );
  }
  if (backend() === "files") {
    return (
      <div className="admin-notice warn">
        <strong>Local mode:</strong> no database is connected, so changes are
        written to this computer&rsquo;s files only.
      </div>
    );
  }
  return null;
}
