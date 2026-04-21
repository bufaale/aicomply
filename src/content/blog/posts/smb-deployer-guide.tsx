export default function SmbDeployerGuide() {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-violet-700">
      <p className="lead">
        Most EU AI Act commentary is written for Fortune 500 counsel with
        seven-figure compliance budgets. Almost nothing is written for a
        10-100 person SaaS with EU customers. That&apos;s the gap this post
        fills. Here is the defensible minimum programme you can execute with
        a single part-time compliance owner, priced honestly.
      </p>

      <h2>Start from the two questions that determine everything</h2>
      <ol>
        <li>
          <strong>Does your product use AI?</strong> If yes, you are a
          deployer. If you also built or meaningfully customised (fine-tuned)
          the model, you are also a provider.
        </li>
        <li>
          <strong>Do you serve EU users or is the output used in the
          EU?</strong> Article 3 of the Regulation extends the obligations
          extraterritorially to providers and deployers &quot;insofar as the
          output produced by the AI system is used in the Union.&quot; A US
          B2B SaaS with one EU customer is in scope.
        </li>
      </ol>

      <h2>The minimum SMB programme — €400/month and a half-day a week</h2>

      <h3>Month 0 — Inventory + risk classification (1 full day)</h3>
      <p>
        List every AI system your team uses or ships. Include:
      </p>
      <ul>
        <li>
          SaaS subscriptions with AI (Notion AI, Slack Copilot, GitHub
          Copilot, Google Workspace AI, etc.)
        </li>
        <li>
          Direct API usage in your own product (OpenAI, Anthropic, Google,
          Mistral, your own hosted model)
        </li>
        <li>
          Informal / shadow usage (employees pasting data into ChatGPT, data
          scientists fine-tuning side projects)
        </li>
      </ul>
      <p>
        Classify each into Art. 5 (unacceptable — stop immediately), Art. 6
        + Annex III (high-risk), Art. 50 (limited-risk), or minimal-risk.
        AIComply&apos;s Claude classifier does this in a few minutes per
        system. Most general-purpose B2B SaaS use lands in limited-risk or
        minimal-risk.
      </p>

      <h3>Month 0 — Article 4 AI literacy rollout (half day)</h3>
      <p>
        Art. 4 has been live since February 2, 2025. Every staff member who
        uses AI systems must have appropriate literacy. The obligation is
        risk-proportional — a startup with 20 people and one AI-assisted
        product does not need the training programme of a bank.
      </p>
      <p>
        Practical approach: ship a one-hour onboarding video covering AI
        fundamentals, known failure modes, your org&apos;s acceptable use
        policy, and your obligations under the Act. Record completion in
        your literacy register. AIComply&apos;s Free tier includes the
        register; the Pro tier adds template training content.
      </p>

      <h3>Month 1 — Transparency notices for Art. 50 systems (2 hours)</h3>
      <p>
        If your product has a chatbot, a transcription feature, or generates
        synthetic content, disclose to users that they are interacting with
        or receiving content from an AI system. Simplest implementation:
      </p>
      <ul>
        <li>
          First-interaction banner in the chatbot: &quot;You are chatting
          with an AI assistant. It may produce inaccurate information.&quot;
        </li>
        <li>
          Watermark or metadata flag on GenAI content: a machine-readable
          indicator consistent with Art. 50 draft technical guidance.
        </li>
        <li>
          Help-centre article explaining which features use AI and which are
          human-reviewed.
        </li>
      </ul>

      <h3>Month 1-2 — DPIA for data-heavy processing (1-2 days of DPO time)</h3>
      <p>
        Any AI feature that processes customer personal data at
        &quot;large scale&quot; (an undefined term, but most B2B SaaS with
        more than a few hundred customers hits it) will typically require a
        GDPR Art. 35 DPIA. AIComply&apos;s <a href="/dpia-generator">DPIA
        generator</a> drafts the five Art. 35(7) sections from a short
        description; your DPO (or external counsel on retainer) reviews and
        signs.
      </p>

      <h3>Month 2 — FRIA if applicable (0.5-1 day)</h3>
      <p>
        FRIAs are deployer-side obligations for high-risk systems in
        specific contexts (public authorities, public services, credit
        scoring, insurance pricing). Most SMB SaaS does NOT need a FRIA.
        If you do — for instance, you sell credit-scoring software to
        banks — AIComply&apos;s <a href="/fria-generator">FRIA
        generator</a> handles the five Art. 27(1) sections.
      </p>

      <h3>Ongoing — evidence vault + review cadence (1 hour/month)</h3>
      <p>
        Keep the inventory, classifications, literacy records, transparency
        notices, DPIAs, and (if applicable) FRIAs in a single audit-ready
        location. Review every quarter. Update when new AI features ship or
        new models are introduced.
      </p>

      <h2>What this actually costs</h2>
      <table>
        <thead>
          <tr>
            <th>Line item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AIComply Pro subscription (20 systems, FRIA + DPIA generator)</td>
            <td>$49/month</td>
          </tr>
          <tr>
            <td>External DPO retainer (for review + sign-off)</td>
            <td>€150-€400/month (part-time)</td>
          </tr>
          <tr>
            <td>Internal compliance owner time</td>
            <td>~4 hours/month at your loaded rate</td>
          </tr>
          <tr>
            <td>One-off: legal review of transparency notices + DPIA template</td>
            <td>€1,500-€3,000 one-time</td>
          </tr>
        </tbody>
      </table>
      <p>
        Total: roughly €300-€500 per month operationally + a one-time
        legal setup. Far below the €50,000+/year that Vanta, OneTrust, and
        big-4 compliance consultancies quote.
      </p>

      <h2>Comparison: SMB stack vs enterprise stack</h2>
      <p>
        See our <a href="/blog/vanta-onetrust-comparison">full 2026
        comparison</a>. In summary:
      </p>
      <ul>
        <li>
          <strong>Vanta EU AI Act module:</strong> requires a Vanta GRC
          platform contract at €50K+ per year. Targets companies already
          using Vanta for SOC 2 / ISO 27001.
        </li>
        <li>
          <strong>OneTrust AI Governance:</strong> deep feature set but a
          six-figure annual spend. Designed for compliance officers in
          large enterprises with multiple global frameworks in scope.
        </li>
        <li>
          <strong>Credo AI:</strong> $30K-$150K/year. ML-dev lifecycle focus
          — excellent if you are also building models; heavy for a pure
          deployer.
        </li>
        <li>
          <strong>Modulos:</strong> €15K+/year. Ships ISO 42001 certification
          path. Good if you are aiming for formal certification.
        </li>
        <li>
          <strong>AIComply:</strong> $49-$299/month. SMB-first ergonomics.
          FRIA, DPIA, Annex IV pack, GPAI tracking, public trust page.
        </li>
      </ul>

      <h2>Three traps we routinely see</h2>
      <ul>
        <li>
          <strong>Waiting for the Commission FRIA template.</strong> It is
          late. The obligation is not. Start with a structured FRIA now and
          re-cast when the template ships — the underlying facts will be
          the same.
        </li>
        <li>
          <strong>Assuming GDPR compliance covers you.</strong> It does not.
          GDPR is about personal data. The AI Act is about AI systems. A
          system can be low-GDPR-risk and still high-AI-Act-risk (e.g. an
          automated hiring tool that never stores CVs).
        </li>
        <li>
          <strong>Over-classifying as high-risk.</strong> Annex III is
          specific: employment, credit scoring, education grading, critical
          infrastructure, law enforcement, justice, essential services,
          biometric identification, migration. A B2B analytics tool that
          helps a marketing team is not Annex III because it processes
          numbers.
        </li>
      </ul>

      <h2>Getting started</h2>
      <p>
        <a href="/signup">Start free</a> — AIComply&apos;s Free tier tracks
        one AI system with auto-classification + literacy register. Upgrade
        to Pro for 20 systems and the FRIA/DPIA generators when you are
        ready to scale the programme.
      </p>
    </article>
  );
}
