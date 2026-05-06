/**
 * Risk-checker — drive the 10-question state machine through ALL FOUR
 * tier outcomes (Prohibited / High-risk / Limited / Minimal).
 *
 * The classifier in src/app/v2/risk-checker/page.tsx prioritises
 * Prohibited > High-risk > Limited > Minimal. To force each verdict
 * we choose Yes on the question whose `weight.yes` matches the target
 * tier and No on every other question.
 *
 * Question matrix (from RC_QUESTIONS):
 *   Q1 (Art. 5(1)(a–b))   → Yes triggers prohibited
 *   Q2 (Art. 5(1)(c))     → Yes triggers prohibited
 *   Q3 (Art. 5(1)(h))     → Yes triggers prohibited
 *   Q4 (Annex I/Art.6(1)) → Yes triggers high
 *   Q5 (Annex III §4 §3)  → Yes triggers high
 *   Q6 (Annex III §5)     → Yes triggers high
 *   Q7 (Art. 50(1))       → Yes triggers limited
 *   Q8 (Art. 50(2,4))     → Yes triggers limited
 *   Q9 (Art. 50(3))       → Yes triggers limited
 *   Q10 (Art. 2(1))       → no weight (territorial scope, doesn't shift tier)
 *
 * No login or DB needed — the risk-checker is stateless on /v2/risk-checker
 * (and aliased at /free/risk-checker via re-export).
 */
import { test, expect } from "@playwright/test";

const ROUTE = "/free/risk-checker"; // Production canonical route after v2 swap

interface TierExpectation {
  yesAtIndex: number | null; // 0-based index, or null for all-No (Minimal)
  expectedTitle: RegExp;
  expectedCitation: RegExp;
  penaltyText: RegExp;
}

const TIER_PATHS: Array<{ name: string; expect: TierExpectation }> = [
  {
    name: "all-No → Minimal verdict",
    expect: {
      yesAtIndex: null,
      expectedTitle: /^Minimal/i,
      expectedCitation: /RECITAL 165/i,
      penaltyText: /No mandatory penalty/i,
    },
  },
  {
    name: "Q9=Yes (emotion recognition) → Limited verdict",
    expect: {
      yesAtIndex: 8, // Q9 is index 8
      expectedTitle: /^Limited risk/i,
      expectedCitation: /ART\. 50/i,
      penaltyText: /transparency breaches/i,
    },
  },
  {
    name: "Q5=Yes (job applicant ranking) → High-risk verdict",
    expect: {
      yesAtIndex: 4, // Q5 is index 4
      expectedTitle: /^High-risk/i,
      expectedCitation: /ART\. 6 · ANNEX III/i,
      penaltyText: /3% of global annual turnover/i,
    },
  },
  {
    name: "Q1=Yes (manipulating vulnerable groups) → Prohibited verdict",
    expect: {
      yesAtIndex: 0, // Q1 is index 0
      expectedTitle: /^Prohibited/i,
      expectedCitation: /ART\. 5/i,
      penaltyText: /€35M or 7%/i,
    },
  },
];

async function answerQuestion(
  page: import("@playwright/test").Page,
  answer: "yes" | "no",
) {
  const btn = page
    .getByRole("button", { name: answer === "yes" ? /^Yes$/ : /^No$/ })
    .first();
  await btn.waitFor({ state: "visible", timeout: 5000 });
  await btn.click();
  // The state machine auto-advances after a 220ms timeout. Wait the full
  // animation + paint cycle before clicking the next button.
  await page.waitForTimeout(280);
}

test.describe("Risk-checker — 10-question state machine, 4 tier outcomes", () => {
  for (const tier of TIER_PATHS) {
    test(tier.name, async ({ page }) => {
      test.setTimeout(60_000);
      await page.goto(ROUTE);
      await expect(
        page.getByRole("heading", { level: 1, name: /10 questions/i }),
      ).toBeVisible();

      // Walk all 10 questions, answering Yes on the target index, No elsewhere
      for (let i = 0; i < 10; i++) {
        const ans: "yes" | "no" = i === tier.expect.yesAtIndex ? "yes" : "no";
        await answerQuestion(page, ans);
      }

      // Verdict heading + citation eyebrow + penalty text
      await expect(
        page.getByRole("heading", { level: 2, name: tier.expect.expectedTitle }).first(),
      ).toBeVisible({ timeout: 10_000 });
      await expect(
        page.getByText(tier.expect.expectedCitation).first(),
      ).toBeVisible();
      await expect(
        page.getByText(tier.expect.penaltyText).first(),
      ).toBeVisible();
    });
  }

  test("verdict CTA links to /signup with risk-checker context", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto(ROUTE);
    // Race through with all-No
    for (let i = 0; i < 10; i++) {
      await answerQuestion(page, "no");
    }
    const saveCta = page.getByRole("link", { name: /Save verdict/i });
    await expect(saveCta).toHaveAttribute("href", "/signup");
  });

  test("Re-run check resets the question flow back to Q1", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(ROUTE);
    for (let i = 0; i < 10; i++) {
      await answerQuestion(page, "no");
    }
    await page.getByRole("button", { name: /Re-run check/i }).click();
    await expect(page.getByText(/QUESTION 01 \/ 10/i).first()).toBeVisible();
  });

  test("Previous button is disabled on Q1 + functional on Q2+", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto(ROUTE);
    const prev = page.getByRole("button", { name: /Previous/i }).first();
    await expect(prev).toBeDisabled();
    await answerQuestion(page, "no");
    await expect(prev).toBeEnabled();
    await prev.click();
    await expect(page.getByText(/QUESTION 01 \/ 10/i).first()).toBeVisible();
  });
});
