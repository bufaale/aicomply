"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/aicomply/atoms";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [success, setSuccess] = useState(false);

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

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // Without emailRedirectTo, Supabase redirects to site_url root
        // after email confirmation, which adds ?code=xxx that our root
        // page doesn't handle → user lands on /login?error=auth.
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // With email confirmation disabled, Supabase silently logs in existing users.
    // Detect this by checking whether the account row was created more than 10s ago.
    if (data.user) {
      const createdAt = new Date(data.user.created_at);
      const diffSeconds = (Date.now() - createdAt.getTime()) / 1000;
      if (diffSeconds > 10) {
        await supabase.auth.signOut();
        setError("An account with this email already exists. Please sign in instead.");
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <div
          className="aic-eyebrow-line aic-eyebrow-line--light"
          style={{ marginBottom: 10, color: "var(--aic-pass-deep)" }}
        >
          ● WORKSPACE CREATED
        </div>
        <h1
          style={{
            font: "500 32px/1.15 var(--aic-font-serif)",
            letterSpacing: "-.02em",
            margin: "0 0 8px",
          }}
        >
          Check your inbox.
        </h1>
        <p
          style={{
            font: "14px/1.55 var(--aic-font-sans)",
            color: "var(--aic-fg-l-3)",
            margin: "0 0 26px",
          }}
        >
          We sent a confirmation email to <strong>{email}</strong>. Click the link to
          activate your AI Act register.
        </p>
        <Link
          href="/login"
          className="aic-btn aic-btn--ghost-light aic-btn--block"
        >
          Back to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <div
        className="aic-eyebrow-line aic-eyebrow-line--light"
        style={{ marginBottom: 10 }}
      >
        CREATE WORKSPACE · 14-DAY TRIAL
      </div>
      <h1
        style={{
          font: "500 32px/1.15 var(--aic-font-serif)",
          letterSpacing: "-.02em",
          margin: "0 0 8px",
        }}
      >
        Start your AI Act register.
      </h1>
      <p
        style={{
          font: "14px/1.55 var(--aic-font-sans)",
          color: "var(--aic-fg-l-3)",
          margin: "0 0 22px",
        }}
      >
        Already have one?{" "}
        <Link
          href="/login"
          style={{
            color: "var(--aic-gold-deep)",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Sign in.
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
        {oauthLoading ? "Connecting…" : "Sign up with Google"}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "20px 0",
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
          <label htmlFor="name" className="aic-label-mono">
            FULL NAME
          </label>
          <input
            id="name"
            className="aic-input"
            type="text"
            placeholder="Jamie Kim"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="email" className="aic-label-mono">
            WORK EMAIL
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
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="password" className="aic-label-mono">
            PASSWORD · 6+ CHARS
          </label>
          <input
            id="password"
            className="aic-input"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <label
          htmlFor="tos"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 18,
            font: "13px/1.5 var(--aic-font-sans)",
            color: "var(--aic-fg-l-2)",
            cursor: "pointer",
          }}
        >
          <input
            id="tos"
            type="checkbox"
            checked={acceptedTos}
            onChange={(e) => setAcceptedTos(e.target.checked)}
            style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--aic-gold-deep)" }}
          />
          <span>
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--aic-gold-deep)", textDecoration: "underline" }}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--aic-gold-deep)", textDecoration: "underline" }}
            >
              DPA
            </a>
            .
          </span>
        </label>
        <button
          type="submit"
          className="aic-btn aic-btn--primary aic-btn--block aic-btn--lg"
          disabled={!acceptedTos || loading}
        >
          {loading ? "Creating workspace…" : "Create workspace →"}
        </button>
      </form>
    </>
  );
}
