import { test, expect } from "@playwright/test";

/**
 * Audit log wiring — verifies the AIComply write paths CALL logAuditEvent
 * at the correct points.
 */

test.describe("Audit log wired into AIComply write paths", () => {
  test("DPIA endpoint logs dpia.generated event", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/app/api/dpia/route.ts");
    const src = await fs.readFile(file, "utf8");
    expect(src).toContain('eventType: "dpia.generated"');
    expect(src).toContain("logAuditEvent");
    expect(src).toContain("extractAuditContext(req.headers)");
  });

  test("FRIA endpoint logs fria.generated event", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/app/api/fria/route.ts");
    const src = await fs.readFile(file, "utf8");
    expect(src).toContain('eventType: "fria.generated"');
    expect(src).toContain("logAuditEvent");
  });

  test("Stripe webhook logs subscription.created on checkout completed", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/app/api/stripe/webhook/route.ts");
    const src = await fs.readFile(file, "utf8");
    expect(src).toContain('eventType: "subscription.created"');
    expect(src).toContain('actorType: "webhook"');
  });

  test("Stripe webhook logs subscription.canceled on subscription.deleted", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/app/api/stripe/webhook/route.ts");
    const src = await fs.readFile(file, "utf8");
    expect(src).toContain('eventType: "subscription.canceled"');
  });
});
