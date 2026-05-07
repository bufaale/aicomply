import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LiteracyForm } from "./literacy-form";

interface LiteracyRecord {
  id: string;
  person_name: string;
  role: string | null;
  department: string | null;
  training_topic: string;
  training_date: string;
  evidence_url: string | null;
  notes: string | null;
  created_at: string;
}

export const metadata = {
  title: "Article 4 literacy register | AIComply",
};

export default async function LiteracyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawRecords } = await supabase
    .from("ai_literacy_records")
    .select("*")
    .eq("user_id", user.id)
    .order("training_date", { ascending: false });

  const records = (rawRecords ?? []) as LiteracyRecord[];

  return (
    <div className="space-y-8 p-6">
      <div>
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">
          EU AI Act · Article 4 · in force 02 Feb 2025
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          AI literacy register
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Record every staff member who operates or uses an AI system and the
          training they have received. Article 4 requires the register since
          February 2, 2025 — auditors expect a per-person, per-topic, dated log.
        </p>
      </div>

      <LiteracyForm />

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Recorded training</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {records.length} record{records.length === 1 ? "" : "s"}
          </span>
        </div>
        {records.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            No literacy records yet. Add the first above.
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Person</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Topic</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className={i > 0 ? "border-t" : ""}>
                    <td className="px-4 py-3 font-medium">{r.person_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {[r.role, r.department].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-4 py-3">{r.training_topic}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {new Date(r.training_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {r.evidence_url ? (
                        <a
                          href={r.evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
