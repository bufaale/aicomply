export default function FriaVsDpia() {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-violet-700">
      <p className="lead">
        Two EU risk assessments frequently get conflated: the{" "}
        <strong>Fundamental Rights Impact Assessment (FRIA)</strong> under
        Article 27 of the EU AI Act, and the{" "}
        <strong>Data Protection Impact Assessment (DPIA)</strong> under
        Article 35 of the GDPR. They share structural DNA — describe the
        processing, assess risks, document mitigations — but they answer
        different questions and trigger on different conditions. If you
        deploy a high-risk AI system that processes personal data, you
        probably need both.
      </p>

      <h2>The one-minute decision tree</h2>
      <ul>
        <li>
          <strong>Does your system process personal data?</strong> If yes,
          GDPR applies. If the processing is likely high-risk to data
          subjects, Art. 35 requires a DPIA.
        </li>
        <li>
          <strong>Is your system an AI system listed in Annex III of the AI
          Act?</strong> If yes AND you are a public authority / public body
          / private entity providing a public service / credit scoring /
          insurance pricing, Art. 27 requires a FRIA before first use.
        </li>
        <li>
          <strong>If both conditions are true, you need both
          documents.</strong> They are not substitutes. Regulators and
          auditors will look for both.
        </li>
      </ul>

      <h2>What each document is for</h2>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>FRIA (Art. 27 AI Act)</th>
            <th>DPIA (Art. 35 GDPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Legal base</td>
            <td>Regulation (EU) 2024/1689</td>
            <td>Regulation (EU) 2016/679</td>
          </tr>
          <tr>
            <td>Who must do it</td>
            <td>Deployers of high-risk AI systems in specific categories</td>
            <td>Controllers (and, via DPAs, processors) for high-risk processing</td>
          </tr>
          <tr>
            <td>Trigger</td>
            <td>First use of a high-risk AI system in one of the listed contexts</td>
            <td>Any high-risk processing (large-scale profiling, special category data, public monitoring, supervisory-authority positive list)</td>
          </tr>
          <tr>
            <td>Required content</td>
            <td>Processes, duration, frequency, affected groups, risks to rights, human oversight (Art. 14), mitigation, governance + complaint mechanism (Art. 26)</td>
            <td>Systematic description, necessity + proportionality, risks to data subjects, mitigation measures, DPO consultation, supervisory authority consultation if residual risk is high</td>
          </tr>
          <tr>
            <td>Notification</td>
            <td>Art. 27(3) requires notification to the national market surveillance authority upon completion</td>
            <td>Art. 36 requires prior consultation with the supervisory authority if residual risk remains high</td>
          </tr>
          <tr>
            <td>Template authority</td>
            <td>Commission template under Art. 27(5) — <em>still unpublished as of April 2026</em></td>
            <td>CNIL, ICO, AEPD, Garante each publish methodologies</td>
          </tr>
          <tr>
            <td>Maximum fine (Art. 99 AI Act / Art. 83 GDPR)</td>
            <td>Up to €15M or 3% of global turnover for non-compliance with Art. 27</td>
            <td>Up to €10M or 2% of global turnover for missing Art. 35 / Art. 36</td>
          </tr>
        </tbody>
      </table>

      <h2>Where the documents overlap (and where they do not)</h2>
      <p>
        Both frameworks ask you to:
      </p>
      <ul>
        <li>Systematically describe the processing.</li>
        <li>Identify affected groups and specific risks.</li>
        <li>Document technical and organisational mitigations.</li>
        <li>Record governance, complaint, and escalation procedures.</li>
      </ul>
      <p>
        However, they focus on different rights frames:
      </p>
      <ul>
        <li>
          <strong>FRIA</strong> is framed around the EU Charter of
          Fundamental Rights as a whole. That includes privacy (Art. 7) and
          data protection (Art. 8) but also non-discrimination (Art. 21),
          dignity (Art. 1), rights of the child (Art. 24), rights of the
          elderly (Art. 25), integration of persons with disabilities (Art.
          26), the right to good administration (Art. 41), and the right to
          an effective remedy (Art. 47).
        </li>
        <li>
          <strong>DPIA</strong> is narrower — specifically about the rights
          and freedoms of natural persons as they relate to personal data
          processing.
        </li>
      </ul>
      <p>
        Which means: a FRIA can have sections that a DPIA does not touch
        (e.g. discrimination in automated decision-making, inclusion of
        persons with disabilities in the interface). And a DPIA can have
        sections a FRIA does not touch (international transfers, specific
        consent mechanisms, Art. 22 automated-decision-making safeguards).
      </p>

      <h2>The combined workflow</h2>
      <p>
        A pragmatic pattern for a single system that needs both:
      </p>
      <ol>
        <li>
          <strong>Run the DPIA first.</strong> It has a richer, older
          methodology ecosystem (CNIL, ICO, AEPD) that is well-trodden.
          Completing the DPIA surfaces most of the facts you will re-use in
          the FRIA.
        </li>
        <li>
          <strong>Derive the FRIA from the DPIA.</strong> Pull the systematic
          description, the affected-groups section, and the technical
          mitigations across. Add the FRIA-specific sections: human oversight
          (Art. 14 AI Act), AI-Act-framed governance, the Art. 26 complaint
          mechanism.
        </li>
        <li>
          <strong>Notify the two authorities separately.</strong> GDPR
          supervisory authority for the DPIA (if Art. 36 applies). National
          market surveillance authority for the FRIA under Art. 27(3).
        </li>
        <li>
          <strong>Version-control both in one artefact.</strong> Many
          deployers keep a combined PDF with section labels that map to both
          frameworks, and an appendix that indexes which paragraphs satisfy
          which legal reference.
        </li>
      </ol>

      <h2>Why the Commission template is late — and why that is an opportunity</h2>
      <p>
        Article 27(5) directs the Commission to develop a FRIA template. As
        of April 2026 that template has not been published. This is a real
        problem for deployers: the obligation enters into force on August 2,
        2026, and the baseline reference document is not yet available.
      </p>
      <p>
        Practical advice: use a structured template now (AIComply&apos;s
        FRIA generator is one option; CNIL&apos;s PIA methodology adapted
        with Charter-article section headers is another). When the
        Commission template ships, re-cast your existing FRIAs to the new
        structure — the underlying facts will be identical. A delay in the
        template is not a delay in the obligation.
      </p>

      <h2>How AIComply handles both</h2>
      <p>
        The AIComply Pro and Business tiers include the{" "}
        <a href="/fria-generator">FRIA generator</a> and the{" "}
        <a href="/dpia-generator">DPIA generator</a>. Both are Claude-assisted
        drafters: you enter a short description of the processing / AI
        system, and the tool produces a starting document that your DPO
        completes and signs. Each document exports as an auditor-ready PDF
        with inline article references. <a href="/signup">Free tier</a>{" "}
        includes one of each.
      </p>

      <h2>References</h2>
      <ul>
        <li>Regulation (EU) 2024/1689 — EU AI Act, Articles 26, 27</li>
        <li>Regulation (EU) 2016/679 — GDPR, Articles 35, 36, 83</li>
        <li>CNIL PIA methodology (latest, 2024)</li>
        <li>European AI Office, Q1 2026 implementation updates</li>
      </ul>
    </article>
  );
}
