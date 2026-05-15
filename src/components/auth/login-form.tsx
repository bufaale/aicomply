"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/aicomply/atoms";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleGoogle = async () => {
    setOauthLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) {
        setError(error.message);
        setOauthLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth failed");
      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      <div
        className="aic-eyebrow-line aic-eyebrow-line--light"
        style={{ marginBottom: 10 }}
      >
        SIGN IN · WORKSPACE
      </div>
      <h1
        style={{
          font: "500 32px/1.15 var(--aic-font-serif)",
          letterSpacing: "-.02em",
          margin: "0 0 8px",
        }}
      >
        Welcome back.
      </h1>
      <p
        style={{
          font: "14px/1.55 var(--aic-font-sans)",
          color: "var(--aic-fg-l-3)",
          margin: "0 0 26px",
        }}
      >
        New here?{" "}
        <Link
          href="/signup"
          style={{
            color: "var(--aic-gold-deep)",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Create a workspace.
        </Link>
      </p>

      <button
        type="button"
        className="aic-btn aic-btn--ghost-light aic-btn--block"
        onClick={handleGoogle}
        disabled={oauthLoading}
        style={{ gap: 10 }}
      >
        <Icon name="google" size={18} />
        {oauthLoading ? "Connecting…" : "Continue with Google"}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "22px 0",
          font: "var(--aic-mono-sm)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--aic-fg-l-4)",
        }}
      >
        <span style={{ flex: 1, height: 1, background: "var(--aic-paper-line-soft)" }} />
        or
        <span style={{ flex: 1, height: 1, background: "var(--aic-paper-line-soft)" }} />
      </div>

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
        <div style={{ marginBottom: 14 }}>
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
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 6,
            }}
          >
            <label htmlFor="password" className="aic-label-mono" style={{ margin: 0 }}>
              PASSWORD
            </label>
            <Link
              href="/forgot-password"
              style={{
                font: "var(--aic-mono-sm)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--aic-gold-deep)",
                textDecoration: "none",
              }}
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            className="aic-input"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="aic-btn aic-btn--primary aic-btn--block aic-btn--lg"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in →"}
        </button>
      </form>

      <p
        style={{
          marginTop: 24,
          font: "12px/1.55 var(--aic-font-sans)",
          color: "var(--aic-fg-l-4)",
        }}
      >
        Data encrypted TLS 1.2+ in transit, AES-256 at rest.{" "}
        <a
          href="/trust"
          style={{ color: "var(--aic-gold-deep)", textDecoration: "underline" }}
        >
          Security posture →
        </a>
      </p>
    </>
  );
}
