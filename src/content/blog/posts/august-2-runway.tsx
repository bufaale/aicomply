export default function Aug2Runway() {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-violet-700">
      <p className="lead">
        The EU AI Act&apos;s headline enforcement date is{" "}
        <strong>August 2, 2026</strong>. On that day the bulk of deployer
        obligations for high-risk systems (Annex III), transparency
        obligations for limited-risk systems (Art. 50), and the general-purpose
        AI provider regime enter into force. If you serve EU users AND your
        product involves AI, this is your live-fire date.
      </p>

      <h2>The phased enforcement timeline</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>What enters into force</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 Aug 2024</td>
            <td>Regulation enters into force (the countdown starts)</td>
          </tr>
          <tr>
            <td>2 Feb 2025</td>
            <td>Prohibited practices (Art. 5); AI literacy obligation (Art. 4). <em>Live now.</em></td>
          </tr>
          <tr>
            <td>2 Aug 2025</td>
            <td>Governance provisions; general-purpose AI (GPAI) obligations for providers. <em>Live now.</em></td>
          </tr>
          <tr>
            <td><strong>2 Aug 2026</strong></td>
            <td><strong>The big day.</strong> High-risk systems under Annex III; deployer obligations; transparency obligations under Art. 50; most penalties. FRIA requirement enters force for applicable deployers.</td>
          </tr>
          <tr>
            <td>2 Aug 2027</td>
            <td>High-risk systems embedded in regulated products (Annex II, e.g. machinery, medical devices) catch up to Annex III timing.</td>
          </tr>
        </tbody>
      </table>

      <h2>The minimum programme for August 2, 2026</h2>
      <p>
        We keep getting asked: &quot;what&apos;s the minimum?&quot; Here is
        the honest answer for a 10-100 person SaaS with EU users.
      </p>

      <h3>1. AI system inventory (all tiers)</h3>
      <p>
        You need a list. Every AI system your team uses — OpenAI API, Claude
        API, Copilot, GitHub Copilot, any embedded vendor LLM feature, your
        own custom models. Including informal shadow usage (employees
        pasting customer data into ChatGPT) is necessary. No inventory, no
        compliance.
      </p>
      <p>
        <strong>Tool:</strong> AIComply&apos;s inventory is the free-tier
        feature. Pro holds up to 20 systems.
      </p>

      <h3>2. Risk classification per system (Art. 5/6/50)</h3>
      <p>
        Each system is classified into one of four tiers:
      </p>
      <ul>
        <li>
          <strong>Unacceptable</strong> (Art. 5): banned. Social scoring by
          public authorities, real-time remote biometric identification in
          public for law enforcement (with narrow exceptions), emotion
          recognition in workplaces and schools, certain uses of biometric
          categorisation. If you deploy one, you stop.
        </li>
        <li>
          <strong>High-risk</strong> (Art. 6 + Annex III): employment
          decisions, credit scoring, access to essential services (including
          healthcare), education/exam grading, law enforcement, migration,
          administration of justice, critical infrastructure, biometric
          identification. Deployer obligations under Articles 26-27.
        </li>
        <li>
          <strong>Limited-risk</strong> (Art. 50): transparency obligations
          for chatbots interacting with humans, GenAI producing synthetic
          content, deepfakes, emotion recognition and biometric
          categorisation that do not fall under Art. 5.
        </li>
        <li>
          <strong>Minimal-risk</strong>: no AI-Act-specific obligations
          beyond Art. 4 literacy. Spam filters, code completion, product
          recommendations with no material rights impact, enterprise search.
          Most B2B SaaS AI features land here.
        </li>
      </ul>

      <h3>3. Article 4 AI literacy training (all tiers)</h3>
      <p>
        Art. 4 has been enforceable since February 2, 2025. Every person in
        your organisation who uses an AI system or is affected by its
        outputs must have a level of AI literacy appropriate to the context.
        You need evidence — a register of who received what training when.
      </p>
      <p>
        <strong>Tool:</strong> AIComply&apos;s Article 4 literacy register
        is the free-tier feature for solo founders, Pro for teams.
      </p>

      <h3>4. Transparency notices for limited-risk systems (Art. 50)</h3>
      <p>
        If your product has a chatbot, a transcription feature, a
        synthetic-content generator, or emotion recognition, you must:
      </p>
      <ul>
        <li>Disclose to the user that they are interacting with an AI.</li>
        <li>For GenAI content, mark outputs as machine-generated in a
          machine-readable way.</li>
        <li>For deepfakes, disclose artificial origin except for evident
          artistic / satirical uses.</li>
      </ul>

      <h3>5. FRIA for applicable high-risk deployers (Art. 27)</h3>
      <p>
        A Fundamental Rights Impact Assessment must be completed BEFORE
        first use by: public authorities, bodies governed by public law,
        private entities providing public services, and private entities
        using a high-risk system for credit scoring or life/health insurance
        pricing. See the{" "}
        <a href="/blog/fria-vs-dpia">FRIA vs DPIA explainer</a> for when you
        also need the GDPR Art. 35 DPIA alongside.
      </p>
      <p>
        <strong>Tool:</strong> AIComply&apos;s{" "}
        <a href="/fria-generator">FRIA generator</a> drafts all five Art.
        27(1) sections. Free tier includes one FRIA.
      </p>

      <h3>6. Annex IV technical documentation (for providers)</h3>
      <p>
        If you build or fine-tune an AI system that ends up high-risk, you
        are a provider under Art. 3(3) (or Art. 3(68)(b) via fine-tuning).
        Annex IV lists nine sections of technical documentation you must
        maintain. Most SMB deployers do not need this. SMB providers
        definitely do.
      </p>
      <p>
        <strong>Tool:</strong> AIComply&apos;s Regulated tier ships the Annex
        IV pack generator.
      </p>

      <h2>Penalties at Article 99</h2>
      <ul>
        <li>
          Up to <strong>€35M or 7% of global turnover</strong> for violating
          Art. 5 (prohibited practices).
        </li>
        <li>
          Up to <strong>€15M or 3% of global turnover</strong> for
          non-compliance with most other obligations (high-risk deployer,
          transparency, FRIA).
        </li>
        <li>
          Up to <strong>€7.5M or 1% of global turnover</strong> for supplying
          incorrect information to authorities.
        </li>
      </ul>
      <p>
        These stack on top of GDPR. They are not alternatives.
      </p>

      <h2>Common misunderstandings</h2>
      <ul>
        <li>
          <strong>&quot;We only use ChatGPT and Copilot, we&apos;re
          fine.&quot;</strong> You are a deployer of two limited-risk AI
          systems. You owe transparency notices and Article 4 training
          records.
        </li>
        <li>
          <strong>&quot;We&apos;re a US company.&quot;</strong> Art. 3 of
          the Regulation applies to providers and deployers &quot;insofar as
          the output produced by the AI system is used in the Union.&quot;
          One EU customer puts you in scope.
        </li>
        <li>
          <strong>&quot;We have GDPR, so we&apos;re covered.&quot;</strong>
          GDPR is about personal data. The AI Act is about AI systems. They
          intersect but neither is a substitute.
        </li>
      </ul>

      <h2>Getting started</h2>
      <p>
        AIComply&apos;s Free tier tracks one AI system end-to-end: inventory,
        classification, literacy records, transparency obligations. Upgrade
        to Pro ($49/month) for 20 systems and FRIA / DPIA generators. Upgrade
        to Business ($149/month) for the trust page, evidence vault, and API.
        Regulated ($399/month) ships the Annex IV documentation pack for
        providers.
      </p>
      <p>
        <a href="/signup">Start free</a> — no credit card, classify your
        first system in five minutes.
      </p>
    </article>
  );
}
