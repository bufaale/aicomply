import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function notifyContractEvent(
  ownerEmail: string,
  contractTitle: string,
  eventType: "viewed" | "signed" | "declined" | "commented",
  metadata?: { author_name?: string; comment?: string; signatory_name?: string },
) {
  const subjects: Record<string, string> = {
    viewed: `Your contract "${contractTitle}" was viewed`,
    signed: `Your contract "${contractTitle}" was signed!`,
    declined: `Your contract "${contractTitle}" was declined`,
    commented: `New comment on "${contractTitle}"`,
  };

  let body = `Your contract "${contractTitle}" received a new event: ${eventType}.`;
  if (metadata?.signatory_name && eventType === "signed") {
    body += `\n\nSigned by: ${metadata.signatory_name}`;
  }
  if (metadata?.comment) {
    body += `\n\nComment from ${metadata.author_name}:\n${metadata.comment}`;
  }
  body += `\n\nView your contracts at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/contracts`;

  try {
    await getResend().emails.send({
      from: process.env.EMAIL_FROM || "ClauseForge <noreply@clauseforge.com>",
      to: ownerEmail,
      subject: subjects[eventType],
      text: body,
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}
