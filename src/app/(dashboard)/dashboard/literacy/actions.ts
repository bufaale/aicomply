"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const literacySchema = z.object({
  person_name: z.string().trim().min(1).max(200),
  role: z.string().trim().max(120).optional().nullable(),
  department: z.string().trim().max(120).optional().nullable(),
  training_topic: z.string().trim().min(1).max(200),
  training_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
    .refine((d) => new Date(d) <= new Date(), {
      message: "Training date cannot be in the future",
    }),
  evidence_url: z
    .string()
    .trim()
    .max(500)
    .url("Evidence URL must be a valid URL")
    .optional()
    .nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

function emptyToNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export async function addLiteracyRecord(
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const parsed = literacySchema.safeParse({
    person_name: emptyToNull(formData.get("person_name")) ?? "",
    role: emptyToNull(formData.get("role")),
    department: emptyToNull(formData.get("department")),
    training_topic: emptyToNull(formData.get("training_topic")) ?? "",
    training_date: emptyToNull(formData.get("training_date")) ?? "",
    evidence_url: emptyToNull(formData.get("evidence_url")),
    notes: emptyToNull(formData.get("notes")),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Invalid input" };
  }

  const { error } = await supabase.from("ai_literacy_records").insert({
    user_id: user.id,
    person_name: parsed.data.person_name,
    role: parsed.data.role,
    department: parsed.data.department,
    training_topic: parsed.data.training_topic,
    training_date: parsed.data.training_date,
    evidence_url: parsed.data.evidence_url,
    notes: parsed.data.notes,
  });

  if (error) {
    return { error: `Save failed: ${error.message}` };
  }

  return {};
}
