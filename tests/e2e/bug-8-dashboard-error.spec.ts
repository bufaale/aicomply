import { test, expect } from "@playwright/test";

/**
 * Bug #8 regression test (AIComply).
 *
 * AIComply's main dashboard is a Server Component, so it uses Next.js's
 * built-in error boundary (error.tsx) for fetch failures rather than the
 * client-side DashboardError pattern used in CallSpark + AccessiScan.
 *
 * However, AIComply ALSO needs the DashboardError component for future
 * client-side widgets. This spec verifies the component is shipped and
 * ready to wire in.
 */

test.describe("Bug #8 — DashboardError component shipped to AIComply", () => {
  test("DashboardError component file exists with required props", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(process.cwd(), "src/components/dashboard/dashboard-error.tsx");
    const src = await fs.readFile(file, "utf8");
    expect(src).toContain("DashboardError");
    expect(src).toContain("onRetry");
    expect(src).toContain('data-testid="dashboard-error"');
    expect(src).toContain('data-testid="dashboard-error-retry"');
  });
});
