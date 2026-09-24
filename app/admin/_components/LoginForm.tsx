"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login admin-card">
      <h1>Admin login</h1>
      <p className="admin-hint">TechToday article manager</p>
      {!configured && (
        <div className="admin-notice warn" style={{ marginTop: 16 }}>
          Login is switched off until an <code>ADMIN_PASSWORD</code> environment
          variable is set in Vercel.
        </div>
      )}
      <form className="admin-form" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        <div className="admin-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <div className="admin-notice error">{error}</div>}
        <button className="admin-btn primary" type="submit" disabled={busy || !configured}>
          {busy ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
