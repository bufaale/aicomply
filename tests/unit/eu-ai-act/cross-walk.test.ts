/**
 * Unit: cross-walk data integrity + getCrossWalkStats math.
 *
 * The cross-walk drives the marketing landing's "71% pre-satisfied"
 * claim. If the underlying data shifts (a row is added / coverage is
 * downgraded) the marketing copy must follow. These tests pin the
 * current state so an accidental edit triggers a visible failure
 * before it ships.
 */
import { describe, it, expect } from "vitest";
import {
  ANNEX_IV_CROSS_WALK,
  getCrossWalkStats,
  type Coverage,
} from "@/lib/eu-ai-act/cross-walk";

describe("ANNEX_IV_CROSS_WALK data integrity", () => {
  it("contains all 24 Annex IV section fields", () => {
    expect(ANNEX_IV_CROSS_WALK).toHaveLength(24);
  });

  it("every entry has unique field id", () => {
    const ids = ANNEX_IV_CROSS_WALK.map((e) => e.field);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has a non-empty label and note", () => {
    for (const entry of ANNEX_IV_CROSS_WALK) {
      expect(entry.label.length).toBeGreaterThan(3);
      expect(entry.note.length).toBeGreaterThan(20);
    }
  });

  it("every coverage value is one of high|medium|none", () => {
    const valid: Coverage[] = ["high", "medium", "none"];
    for (const entry of ANNEX_IV_CROSS_WALK) {
      expect(valid).toContain(entry.coverage.soc2);
      expect(valid).toContain(entry.coverage.iso27001);
    }
  });

  it("entries with high|medium SOC2 coverage cite at least one CC* control", () => {
    for (const entry of ANNEX_IV_CROSS_WALK) {
      if (entry.coverage.soc2 === "high" || entry.coverage.soc2 === "medium") {
        expect(
          entry.references.soc2,
          `${entry.field} claims SOC2 coverage but has no CC reference`,
        ).toBeDefined();
        expect(entry.references.soc2!.length).toBeGreaterThan(0);
        // Each CC ref should match the SOC2 control naming pattern
        for (const ref of entry.references.soc2!) {
          expect(ref).toMatch(/^(CC|A|C|PI|P)\d/);
        }
      }
    }
  });

  it("entries with high|medium ISO 27001 coverage cite at least one A.* control", () => {
    for (const entry of ANNEX_IV_CROSS_WALK) {
      if (
        entry.coverage.iso27001 === "high" ||
        entry.coverage.iso27001 === "medium"
      ) {
        expect(
          entry.references.iso27001,
          `${entry.field} claims ISO 27001 coverage but has no A.* reference`,
        ).toBeDefined();
        expect(entry.references.iso27001!.length).toBeGreaterThan(0);
        for (const ref of entry.references.iso27001!) {
          expect(ref).toMatch(/^A\.\d/);
        }
      }
    }
  });
});

describe("getCrossWalkStats", () => {
  it("returns the expected aggregate stats matching landing copy", () => {
    const stats = getCrossWalkStats();
    expect(stats.total).toBe(24);
    // Marketing copy on the landing hero TrustItem reads "79%
    // pre-satisfied" — this matches the either-count (the most
    // generous accurate claim: if you have EITHER SOC2 or ISO 27001,
    // 19 of 24 sections are pre-satisfied).
    //
    // SOC2-none entries (7): human_oversight_assessment,
    // capabilities_and_limitations, degrees_of_accuracy,
    // foreseeable_unintended_outcomes, conformity_assessment_procedure,
    // conformity_assessment_changes, harmonised_standards_applied.
    //
    // ISO 27001-none entries (5): same as SOC2 minus
    // conformity_assessment_procedure (iso27001=medium) and
    // harmonised_standards_applied (iso27001=high). So 19 covered.
    //
    // either-count = 19 because every entry that has SOC2 coverage
    // also has ISO 27001 coverage; ISO 27001 strictly dominates.
    expect(stats.soc2Count).toBe(17);
    expect(stats.soc2Pct).toBe(71);
    expect(stats.iso27001Count).toBe(19);
    expect(stats.iso27001Pct).toBe(79);
    expect(stats.eitherCount).toBe(19);
    expect(stats.eitherPct).toBe(79);
  });

  it("either-count is at least max(soc2, iso27001)", () => {
    const stats = getCrossWalkStats();
    expect(stats.eitherCount).toBeGreaterThanOrEqual(stats.soc2Count);
    expect(stats.eitherCount).toBeGreaterThanOrEqual(stats.iso27001Count);
  });

  it("either-count never exceeds total", () => {
    const stats = getCrossWalkStats();
    expect(stats.eitherCount).toBeLessThanOrEqual(stats.total);
  });

  it("percentages sum + bounds: each is 0..100", () => {
    const stats = getCrossWalkStats();
    for (const p of [stats.soc2Pct, stats.iso27001Pct, stats.eitherPct]) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
  });
});
