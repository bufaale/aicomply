"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const stamp = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      <div
        className="aic-eyebrow-line aic-eyebrow-line--light"
        style={{ marginBottom: 10 }}
      >
        RESET PASSWORD
      </div>
      <h1
        style={{
          font: "500 32px/1.15 var(--aic-font-serif)",
          letterSpacing: "-.02em",
          margin: "0 0 8px",
        }}
      >
        Forgot your password?
      </h1>
      <p
        style={{
          font: "14px/1.55 var(--aic-font-sans)",
          color: "var(--aic-fg-l-3)",
          margin: "0 0 26px",
        }}
      >
        We&apos;ll send a reset link. Links expire in 30 minutes.
      </p>

      {success ? (
        <div
          role="status"
          style={{
            padding: 18,
            border: "1px solid var(--aic-pass-deep)",
            background: "rgba(20,184,166,.06)",
            color: "var(--aic-pass-deep)",
          }}
        >
          <div
            className="aic-eyebrow-line"
            style={{ color: "var(--aic-pass-deep)", marginBottom: 6 }}
          >
            ● SENT · {stamp}
          </div>
          <div
            style={{
              font: "14px/1.5 var(--aic-font-sans)",
              color: "var(--aic-fg-l-2)",
            }}
          >
            Check your inbox for the reset link.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 12px",
                marginBottom: 14,
                border: "1px solid var(--aic-fail-deep)",
                background: "rgba(248,113,113,0.08)",
                color: "var(--aic-fail-deep)",
                font: "13px/1.4 var(--aic-font-sans)",
              }}
            >
              {error}
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" className="aic-label-mono">
              EMAIL
            </label>
            <input
              id="email"
              className="aic-input"
              type="email"
              placeholder="jamie@acme.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="aic-btn aic-btn--primary aic-btn--block aic-btn--lg"
            disabled={loading}
          >
            {loading ? "Sending reset link…" : "Send reset link →"}
          </button>
        </form>
      )}

      <Link
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 24,
          color: "var(--aic-fg-l-2)",
          textDecoration: "none",
          font: "14px var(--aic-font-sans)",
          fontWeight: 600,
        }}
      >
        ← Back to sign in
      </Link>
    </>
  );
}
