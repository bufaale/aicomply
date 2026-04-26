import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { classify, QUESTIONS } from "@/lib/free-checker/classifier";

export const maxDuration = 15;

const bodySchema = z.object({
  answers: z
    .array(
      z.object({
        question_id: z.string().min(1).max(100),
        answer: z.enum(["yes", "no"]),
      }),
    )
    .min(1)
    .max(QUESTIONS.length),
  email: z.string().email().max(200).optional(),
});

/**
 * Public endpoint for /free/risk-checker. Pure logic, no I/O. Returns the
 * classification + required obligations.
 *
 * Optional `email` would enqueue a follow-up nurture sequence; gated to
 * dry-run elsewhere to avoid accidental sends.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const result = classify(parsed.data.answers);
  return NextResponse.json({
    result,
    email_captured: Boolean(parsed.data.email),
    upgrade_cta:
      "Generate a defensible DPIA + FRIA + Annex IV documentation at https://aicomply.piposlab.com/signup",
  });
}

export async function GET() {
  return NextResponse.json({ questions: QUESTIONS });
}
