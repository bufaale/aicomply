/**
 * Cross-walk between EU AI Act Annex IV technical documentation sections
 * and existing compliance frameworks the customer may already have.
 *
 * Tells a regulated-tier customer: "If you're already SOC2 / ISO 27001
 * certified, these sections of your Annex IV pack are pre-satisfied —
 * you only have to author the AI-specific gaps."
 *
 * Coverage rating per section:
 *   - "high"   → existing controls satisfy 70%+ of the AI Act requirement
 *   - "medium" → existing controls cover the structural/process bits but
 *                  the AI-specific content still needs authoring
 *   - "none"   → AI Act-specific, no equivalent in SOC2 / ISO 27001
 *
 * Mappings reflect SOC2 Trust Services Criteria 2017 and ISO/IEC 27001:2022
 * Annex A (4 themes, 93 controls). For ISO 42001 and NIST AI RMF — both
 * already in the Regulated tier feature set — see the harmonised-standards
 * cross-walk in the Annex IV generator itself.
 *
 * Sources:
 *   - EU AI Act Regulation (EU) 2024/1689 — Art. 11 + Annex IV
 *   - SOC2 Trust Services Criteria 2017
 *   - ISO/IEC 27001:2022 Annex A controls
 */
export type Coverage = "high" | "medium" | "none";

export interface CrossWalkEntry {
  field: string;
  label: string;
  coverage: { soc2: Coverage; iso27001: Coverage };
  /**
   * Specific control IDs from each framework that map to this Annex IV
   * section. Used in the UI to give the user a citable starting point.
   */
  references: { soc2?: string[]; iso27001?: string[] };
  /** Short note explaining what's covered and what still needs authoring. */
  note: string;
}

export const ANNEX_IV_CROSS_WALK: CrossWalkEntry[] = [
  {
    field: "system_intended_purpose",
    label: "System intended purpose",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC1.1"], iso27001: ["A.5.1", "A.5.2"] },
    note: "ISMS scope statements give you the documentation skeleton, but the AI-specific intended-use must be authored against the EU AI Act's high-risk Annex III categories.",
  },
  {
    field: "system_developer_identity",
    label: "Developer / provider identity",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC1.1", "CC1.4"], iso27001: ["A.5.2", "A.5.3"] },
    note: "Organisational identity, accountability, and segregation of duties are core SOC2/ISO 27001 deliverables. Reuse the org chart and authorised-rep statements.",
  },
  {
    field: "system_version_and_date",
    label: "System version and release date",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC8.1"], iso27001: ["A.8.32"] },
    note: "Change-management records (release notes, deployment dates, version tags) carry over directly from your existing change-management evidence.",
  },
  {
    field: "system_interaction_with_hardware",
    label: "Interaction with hardware / external systems",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC6.1", "CC6.6"], iso27001: ["A.8.20", "A.8.21"] },
    note: "Network-architecture diagrams and integration documentation reuse — but AI-specific interfaces (sensors, robotics, connected data sources) still need explicit mapping.",
  },
  {
    field: "system_software_versions",
    label: "Software versions and dependencies",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC8.1"], iso27001: ["A.8.8", "A.8.32"] },
    note: "SBOM / dependency lists from your secure-development pipeline cover this section verbatim. Just attach the existing artefact.",
  },
  {
    field: "system_deployment_forms",
    label: "Deployment configurations (cloud, on-prem, edge)",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC6.1", "CC6.6"], iso27001: ["A.5.23", "A.8.31"] },
    note: "Cloud-services control (A.5.23) and access-management evidence directly satisfy this section. Add only the AI-specific deployment surfaces.",
  },
  {
    field: "system_hardware_description",
    label: "Hardware description",
    coverage: { soc2: "medium", iso27001: "high" },
    references: { soc2: ["CC6.4"], iso27001: ["A.7.1", "A.7.2", "A.7.10"] },
    note: "Physical-security and equipment registers cover the host hardware. GPU-accelerator inventories may need to be added if not already in your asset register.",
  },
  {
    field: "design_methods_and_steps",
    label: "Design methods and development process",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC8.1"], iso27001: ["A.8.25", "A.8.28"] },
    note: "Secure-development lifecycle and secure-coding controls give you the process skeleton. Model-training methodology and dataset selection are AI-specific additions.",
  },
  {
    field: "design_specifications",
    label: "Design specifications",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC5.1", "CC5.2"], iso27001: ["A.5.8", "A.8.27"] },
    note: "Project-management and architecture-design controls cover the documentation format. Trade-off rationale (accuracy vs explainability vs latency) needs explicit authoring.",
  },
  {
    field: "system_architecture",
    label: "System architecture",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC6.1", "CC8.1"], iso27001: ["A.8.27", "A.8.28"] },
    note: "Architecture diagrams, data-flow maps, and component inventories from your ISMS reuse directly. Add the AI-model components and inference paths.",
  },
  {
    field: "data_requirements",
    label: "Training, validation, and test data",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["P3.1", "CC9.1"], iso27001: ["A.5.12", "A.5.34", "A.8.10"] },
    note: "Information-classification (A.5.12) and PII-handling (A.5.34) controls provide the data-governance frame. Provenance, representativeness, and bias-checks are AI Act-specific.",
  },
  {
    field: "human_oversight_assessment",
    label: "Human oversight measures",
    coverage: { soc2: "none", iso27001: "none" },
    references: {},
    note: "AI Act Article 14 — no equivalent in SOC2 or ISO 27001. Must be authored fresh covering oversight design, override mechanisms, and operator competence.",
  },
  {
    field: "accuracy_and_performance_metrics",
    label: "Accuracy / robustness / cybersecurity metrics",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC4.1", "CC7.2"], iso27001: ["A.8.16", "A.8.7"] },
    note: "Monitoring and incident-detection evidence covers cybersecurity metrics. Accuracy/robustness metrics on the AI model itself (precision, recall, F1, drift) need fresh measurement.",
  },
  {
    field: "capabilities_and_limitations",
    label: "Capabilities and limitations",
    coverage: { soc2: "none", iso27001: "none" },
    references: {},
    note: "AI Act Article 13 transparency requirement — must be authored fresh based on validation testing.",
  },
  {
    field: "degrees_of_accuracy",
    label: "Degrees of accuracy for specific persons or groups",
    coverage: { soc2: "none", iso27001: "none" },
    references: {},
    note: "AI Act Article 10 + 13 fairness obligation — no SOC2/ISO 27001 equivalent. FRIA-type analysis required.",
  },
  {
    field: "foreseeable_unintended_outcomes",
    label: "Foreseeable unintended outcomes and risks",
    coverage: { soc2: "none", iso27001: "none" },
    references: {},
    note: "AI Act Article 9 risk-management requirement specific to AI harm scenarios. Must be authored fresh — partially overlaps with FRIA territory.",
  },
  {
    field: "specifications_input_data",
    label: "Specifications for input data",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC5.2"], iso27001: ["A.5.12", "A.8.4"] },
    note: "Information-classification and source-code control provide schema-validation patterns. Acceptable input ranges and edge-case handling are AI-specific.",
  },
  {
    field: "risk_management_description",
    label: "Risk-management system",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC3.1", "CC3.2", "CC3.4"], iso27001: ["A.5.7", "A.8.2", "A.8.8"] },
    note: "Existing risk-assessment methodology, register, and treatment plans reuse directly. Just extend the risk register with AI-specific risk types (drift, adversarial, hallucination, bias).",
  },
  {
    field: "lifecycle_changes",
    label: "Lifecycle changes (post-deployment)",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC8.1"], iso27001: ["A.8.32"] },
    note: "Change-management evidence carries over directly. Substantial-modification triggers per AI Act Art. 43(4) need to be defined explicitly.",
  },
  {
    field: "harmonised_standards_applied",
    label: "Harmonised standards applied",
    coverage: { soc2: "none", iso27001: "high" },
    references: { iso27001: ["A.5.36"] },
    note: "ISO 27001 A.5.36 directly requires tracking compliance with policies, rules, and standards — extend your existing register with the AI Act harmonised standards (prEN 18286, ISO 42001). SOC2 has no equivalent control for tracking external technical-standards conformance.",
  },
  {
    field: "conformity_assessment_procedure",
    label: "Conformity assessment procedure used",
    coverage: { soc2: "none", iso27001: "medium" },
    references: { iso27001: ["A.5.36"] },
    note: "ISO 27001 audit-record patterns provide the documentation format. The conformity-assessment route choice (Annex VI self-cert vs Annex VII notified body) is AI Act-specific.",
  },
  {
    field: "conformity_assessment_changes",
    label: "Changes triggering re-assessment",
    coverage: { soc2: "none", iso27001: "none" },
    references: {},
    note: "AI Act Art. 43(4) substantial-modification definition — no SOC2/ISO 27001 analogue. Must be authored fresh.",
  },
  {
    field: "post_market_monitoring_plan",
    label: "Post-market monitoring plan",
    coverage: { soc2: "high", iso27001: "high" },
    references: { soc2: ["CC4.1", "CC4.2", "CC7.3"], iso27001: ["A.5.24", "A.5.25", "A.8.16"] },
    note: "Continuous-monitoring and incident-management programmes carry over directly. Add the AI Act Art. 72 specific reporting cadence and serious-incident thresholds.",
  },
  {
    field: "additional_information",
    label: "Additional information",
    coverage: { soc2: "medium", iso27001: "medium" },
    references: { soc2: ["CC2.1"], iso27001: ["A.5.10"] },
    note: "Documentation-management evidence reuses for any supplementary annexes (vendor agreements, GPAI signatory letters, training data licences).",
  },
];

/**
 * Aggregate coverage stats for the marketing claim:
 *   "If you have SOC2, AIComply pre-satisfies X of 24 sections"
 *   "If you have ISO 27001, AIComply pre-satisfies Y of 24 sections"
 *   "If you have both, Z of 24 sections start pre-populated"
 *
 * "Pre-satisfied" counts both `high` and `medium` coverage — high is direct
 * reuse, medium gives the structural skeleton.
 */
export function getCrossWalkStats() {
  const total = ANNEX_IV_CROSS_WALK.length;
  const soc2Count = ANNEX_IV_CROSS_WALK.filter(
    (e) => e.coverage.soc2 === "high" || e.coverage.soc2 === "medium",
  ).length;
  const iso27001Count = ANNEX_IV_CROSS_WALK.filter(
    (e) => e.coverage.iso27001 === "high" || e.coverage.iso27001 === "medium",
  ).length;
  const eitherCount = ANNEX_IV_CROSS_WALK.filter(
    (e) =>
      e.coverage.soc2 === "high" ||
      e.coverage.soc2 === "medium" ||
      e.coverage.iso27001 === "high" ||
      e.coverage.iso27001 === "medium",
  ).length;
  return {
    total,
    soc2Count,
    soc2Pct: Math.round((soc2Count / total) * 100),
    iso27001Count,
    iso27001Pct: Math.round((iso27001Count / total) * 100),
    eitherCount,
    eitherPct: Math.round((eitherCount / total) * 100),
  };
}
