"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${title}"? It will be removed from the site.`)) {
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      window.alert(data.error || "Delete failed.");
      return;
    }
    router.refresh();
  }

  return (
    <button className="admin-btn danger" type="button" onClick={handleDelete} disabled={busy}>
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
