"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addLiteracyRecord } from "./actions";

const TOPICS = [
  "AI Act overview & risk tiers",
  "High-risk AI system operation",
  "Article 4 literacy fundamentals",
  "Article 5 prohibited uses",
  "Article 50 transparency obligations",
  "DPIA / FRIA assessment",
  "Annex IV technical documentation",
  "Incident reporting procedure",
  "Other",
];

export function LiteracyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await addLiteracyRecord(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
        const form = document.getElementById("literacy-form") as HTMLFormElement | null;
        form?.reset();
      }
    });
  }

  return (
    <form
      id="literacy-form"
      action={handleSubmit}
      className="rounded-lg border p-5 bg-card space-y-4"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Add training record</h2>
        <span className="text-xs text-muted-foreground">
          All fields except role / department / evidence / notes are required.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="person_name" className="text-sm font-medium">
            Person name
          </label>
          <input
            id="person_name"
            name="person_name"
            type="text"
            required
            maxLength={200}
            placeholder="Jane Smith"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-medium">
            Role <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="role"
            name="role"
            type="text"
            maxLength={120}
            placeholder="Customer Support Agent"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="department" className="text-sm font-medium">
            Department <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="department"
            name="department"
            type="text"
            maxLength={120}
            placeholder="Operations"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="training_topic" className="text-sm font-medium">
            Training topic
          </label>
          <select
            id="training_topic"
            name="training_topic"
            required
            defaultValue=""
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          >
            <option value="" disabled>
              Pick a topic…
            </option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="training_date" className="text-sm font-medium">
            Training date
          </label>
          <input
            id="training_date"
            name="training_date"
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="evidence_url" className="text-sm font-medium">
            Evidence URL <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="evidence_url"
            name="evidence_url"
            type="url"
            maxLength={500}
            placeholder="https://…/training-certificate.pdf"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          maxLength={1000}
          placeholder="Internal session, recorded by HR, signed acknowledgement on file…"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {error ? <span className="text-destructive">{error}</span> : null}
          {success ? (
            <span className="text-emerald-600">Record saved.</span>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save record"}
        </button>
      </div>
    </form>
  );
}
