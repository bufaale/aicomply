import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AnnexIvDraft } from "@/lib/eu-ai-act/annex-iv-generator";

const colors = {
  primary: "#1a1a2e",
  accent: "#d97706",
  gray: "#6b7280",
  border: "#e5e7eb",
  lightGray: "#f3f4f6",
  redSoft: "#fee2e2",
  redDark: "#991b1b",
};

const s = StyleSheet.create({
  page: { padding: 44, fontFamily: "Helvetica", fontSize: 10, color: colors.primary, lineHeight: 1.45 },
  coverEyebrow: { fontSize: 9, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 10 },
  coverTitle: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 10 },
  coverSubtitle: { fontSize: 12, color: colors.gray, marginBottom: 32 },
  metaBox: { backgroundColor: colors.lightGray, borderRadius: 6, padding: 14, marginBottom: 10 },
  metaLabel: { fontSize: 8, color: colors.gray, textTransform: "uppercase" as const, marginBottom: 3, letterSpacing: 0.5 },
  metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  sectionEyebrow: { fontSize: 8, color: colors.accent, textTransform: "uppercase" as const, letterSpacing: 1, marginTop: 22, marginBottom: 4 },
  sectionTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  block: { marginBottom: 12 },
  blockLabel: { fontSize: 9, color: colors.gray, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 3 },
  blockHeading: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  blockText: { fontSize: 9.5, color: "#374151", lineHeight: 1.5 },
  disclaimer: { fontSize: 9, color: colors.redDark, fontStyle: "italic" as const, marginTop: 14, padding: 12, backgroundColor: colors.redSoft, borderRadius: 4 },
  footer: {
    position: "absolute" as const, bottom: 30, left: 44, right: 44,
    fontSize: 7.5, color: colors.gray, flexDirection: "row", justifyContent: "space-between",
    borderTop: `1 solid ${colors.border}`, paddingTop: 6,
  },
});

export interface AnnexIvReportMeta {
  providerName: string;
  systemName: string;
  contactEmail: string;
  assessmentDate: string;
  status: string;
}

function Block({ label, heading, ref, text }: { label: string; heading: string; ref: string; text: string }) {
  return (
    <View style={s.block} wrap={false}>
      <Text style={s.blockLabel}>{label} · {ref}</Text>
      <Text style={s.blockHeading}>{heading}</Text>
      <Text style={s.blockText}>{text || "—"}</Text>
    </View>
  );
}

export function AnnexIvReport({ meta, draft }: { meta: AnnexIvReportMeta; draft: AnnexIvDraft }) {
  const footer = "AIComply — Annex IV (EU AI Act Art. 11)";
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.coverEyebrow}>Technical Documentation</Text>
        <Text style={s.coverTitle}>Annex IV — EU AI Act Art. 11</Text>
        <Text style={s.coverSubtitle}>
          Regulation (EU) 2024/1689 · Provider obligation for high-risk AI systems
        </Text>

        <View style={s.metaBox}><Text style={s.metaLabel}>Provider</Text><Text style={s.metaValue}>{meta.providerName}</Text></View>
        <View style={s.metaBox}><Text style={s.metaLabel}>System</Text><Text style={s.metaValue}>{meta.systemName}</Text></View>
        <View style={s.metaBox}><Text style={s.metaLabel}>Contact</Text><Text style={s.metaValue}>{meta.contactEmail}</Text></View>
        <View style={s.metaBox}><Text style={s.metaLabel}>Document date</Text><Text style={s.metaValue}>{meta.assessmentDate}</Text></View>
        <View style={s.metaBox}><Text style={s.metaLabel}>Status</Text><Text style={s.metaValue}>{meta.status}</Text></View>

        <View style={s.disclaimer}>
          <Text>
            Annex IV documentation must be kept current throughout the AI system lifecycle (Art. 11(2))
            and made available to national competent authorities and notified bodies on request. Quality
            managers, technical writers, and legal counsel MUST review this draft before submission.
            AIComply does not warrant conformity. Some sections may contain "[Input required]"
            placeholders that must be filled in from your engineering records.
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text>{footer}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.sectionEyebrow}>§ 1</Text>
        <Text style={s.sectionTitle}>General description of the AI system</Text>
        <Block label="1.1 Intended purpose" heading="Annex IV §1(a)" ref="Annex IV §1(a)" text={draft.system_intended_purpose} />
        <Block label="1.2 Provider identity" heading="Annex IV §1(a)" ref="Art. 11 · Annex IV §1(a)" text={draft.system_developer_identity} />
        <Block label="1.3 Version and date" heading="Annex IV §1(b)" ref="Annex IV §1(b)" text={draft.system_version_and_date} />
        <Block label="1.4 Hardware interaction" heading="Annex IV §1(c)" ref="Annex IV §1(c)" text={draft.system_interaction_with_hardware} />
        <Block label="1.5 Software versions" heading="Annex IV §1(d)" ref="Annex IV §1(d)" text={draft.system_software_versions} />
        <Block label="1.6 Deployment forms" heading="Annex IV §1(e)" ref="Annex IV §1(e)" text={draft.system_deployment_forms} />
        <Block label="1.7 Hardware description" heading="Annex IV §1(f)" ref="Annex IV §1(f)" text={draft.system_hardware_description} />
        <View style={s.footer} fixed><Text>{footer}</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.sectionEyebrow}>§ 2</Text>
        <Text style={s.sectionTitle}>Design and development</Text>
        <Block label="2.1 Methods" heading="Annex IV §2(a)" ref="§2(a)" text={draft.design_methods_and_steps} />
        <Block label="2.2 Design specs" heading="Annex IV §2(b)" ref="§2(b)" text={draft.design_specifications} />
        <Block label="2.3 Architecture" heading="Annex IV §2(c)" ref="§2(c)" text={draft.system_architecture} />
        <Block label="2.4 Data requirements" heading="Annex IV §2(d) · Art. 10" ref="§2(d) · Art. 10" text={draft.data_requirements} />
        <Block label="2.5 Human oversight" heading="Annex IV §2(e) · Art. 14" ref="§2(e) · Art. 14" text={draft.human_oversight_assessment} />
        <Block label="2.6 Accuracy & performance" heading="Annex IV §2(f) · Art. 15" ref="§2(f) · Art. 15" text={draft.accuracy_and_performance_metrics} />
        <View style={s.footer} fixed><Text>{footer}</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.sectionEyebrow}>§ 3</Text>
        <Text style={s.sectionTitle}>Monitoring, functioning, control</Text>
        <Block label="3.1 Capabilities / limitations" heading="Annex IV §3(a)" ref="§3(a)" text={draft.capabilities_and_limitations} />
        <Block label="3.2 Accuracy per subgroup" heading="Annex IV §3(b)" ref="§3(b)" text={draft.degrees_of_accuracy} />
        <Block label="3.3 Unintended outcomes" heading="Annex IV §3(c)" ref="§3(c)" text={draft.foreseeable_unintended_outcomes} />
        <Block label="3.4 Input-data spec" heading="Annex IV §3(d)" ref="§3(d)" text={draft.specifications_input_data} />

        <Text style={s.sectionEyebrow}>§ 4</Text>
        <Text style={s.sectionTitle}>Risk management system</Text>
        <Block label="4.1 RMS description" heading="Annex IV §4 · Art. 9" ref="§4 · Art. 9" text={draft.risk_management_description} />

        <Text style={s.sectionEyebrow}>§ 5</Text>
        <Text style={s.sectionTitle}>Lifecycle changes</Text>
        <Block label="5.1 Change management" heading="Annex IV §5" ref="§5" text={draft.lifecycle_changes} />
        <View style={s.footer} fixed><Text>{footer}</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.sectionEyebrow}>§ 6</Text>
        <Text style={s.sectionTitle}>Harmonised standards</Text>
        <Block label="6.1 Standards applied" heading="Annex IV §6" ref="§6" text={draft.harmonised_standards_applied} />

        <Text style={s.sectionEyebrow}>§ 7</Text>
        <Text style={s.sectionTitle}>Conformity assessment</Text>
        <Block label="7.1 Assessment procedure" heading="Annex IV §7(a) · Art. 43" ref="§7(a) · Art. 43" text={draft.conformity_assessment_procedure} />
        <Block label="7.2 Changes since assessment" heading="Annex IV §7(b)" ref="§7(b)" text={draft.conformity_assessment_changes} />

        <Text style={s.sectionEyebrow}>§ 8</Text>
        <Text style={s.sectionTitle}>Post-market monitoring</Text>
        <Block label="8.1 Monitoring plan" heading="Annex IV §8 · Art. 72" ref="§8 · Art. 72" text={draft.post_market_monitoring_plan} />

        <Text style={s.sectionEyebrow}>§ 9</Text>
        <Text style={s.sectionTitle}>Additional information</Text>
        <Block label="9.1 Supplementary" heading="Annex IV §9" ref="§9" text={draft.additional_information} />

        <View style={s.disclaimer}>
          <Text>
            This document must remain version-controlled. Every material change (Art. 11(2) +
            Art. 43(4)) should produce a new revision approved by the provider&apos;s quality manager
            before deployment to production.
          </Text>
        </View>
        <View style={s.footer} fixed><Text>{footer}</Text><Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} /></View>
      </Page>
    </Document>
  );
}
