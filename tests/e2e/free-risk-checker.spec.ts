import { test, expect } from "@playwright/test";
import { classify, QUESTIONS } from "@/lib/free-checker/classifier";

test.describe("/free/risk-checker — landing", () => {
  test("renders heading + 10 questions + disabled submit", async ({ page }) => {
    await page.goto("/free/risk-checker");
    await expect(page.getByRole("heading", { name: /Free EU AI Act Risk Checker/i })).toBeVisible();
    const fieldsets = page.locator('[data-testid="risk-checker-form"] fieldset');
    await expect(fieldsets).toHaveCount(QUESTIONS.length);
    await expect(page.locator('[data-testid="risk-submit"]')).toBeDisabled();
  });

  test("answer all questions enables submit", async ({ page }) => {
    await page.goto("/free/risk-checker");
    for (const q of QUESTIONS) {
      await page.locator(`[data-testid="answer-${q.id}-no"]`).click();
    }
    await expect(page.locator('[data-testid="risk-submit"]')).toBeEnabled();
  });

  test("metadata canonical points to /free/risk-checker", async ({ page }) => {
    await page.goto("/free/risk-checker");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/free/risk-checker");
  });
});

test.describe("/api/free/risk-checker — endpoint contract", () => {
  test("400 on missing body", async ({ request }) => {
    const res = await request.post("/api/free/risk-checker");
    expect(res.status()).toBe(400);
  });

  test("400 on invalid answer enum", async ({ request }) => {
    const res = await request.post("/api/free/risk-checker", {
      data: { answers: [{ question_id: "q1", answer: "maybe" }] },
    });
    expect(res.status()).toBe(400);
  });

  test("GET returns the questions catalog", async ({ request }) => {
    const res = await request.get("/api/free/risk-checker");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.questions)).toBe(true);
    expect(json.questions.length).toBe(QUESTIONS.length);
  });
});

test.describe("Unit: classify", () => {
  function answersAllNo() {
    return QUESTIONS.map((q) => ({ question_id: q.id, answer: "no" as const }));
  }

  test("all 'no' yields minimal tier", () => {
    const r = classify(answersAllNo());
    expect(r.tier).toBe("minimal");
    expect(r.triggered_questions).toEqual([]);
  });

  test("yes to subliminal manipulation -> prohibited (highest precedence)", () => {
    const ans = answersAllNo();
    ans[0].answer = "yes"; // q1_subliminal
    ans[8].answer = "yes"; // q9_chatbot — limited tier
    const r = classify(ans);
    expect(r.tier).toBe("prohibited");
    expect(r.triggered_questions).toContain("q1_subliminal");
  });

  test("yes to high-risk question + limited question -> high_risk wins", () => {
    const ans = answersAllNo();
    ans[4].answer = "yes"; // q5_critical_infra
    ans[8].answer = "yes"; // q9_chatbot
    const r = classify(ans);
    expect(r.tier).toBe("high_risk");
  });

  test("only chatbot/transparency yes -> limited tier", () => {
    const ans = answersAllNo();
    ans[8].answer = "yes"; // q9_chatbot
    const r = classify(ans);
    expect(r.tier).toBe("limited");
  });

  test("required_obligations are non-empty for every tier", () => {
    for (const trigger of [0, 4, 8] as const) {
      const ans = answersAllNo();
      ans[trigger].answer = "yes";
      const r = classify(ans);
      expect(r.required_obligations.length).toBeGreaterThan(0);
    }
    expect(classify(answersAllNo()).required_obligations.length).toBeGreaterThan(0);
  });

  test("rationale length matches triggered question count when no triggers", () => {
    const r = classify(answersAllNo());
    // No triggers -> 1 fallback rationale entry
    expect(r.rationale.length).toBe(1);
    expect(r.rationale[0]).toMatch(/minimal-risk/i);
  });
});
