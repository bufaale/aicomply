export default function GpaiSignatories() {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-violet-700">
      <p className="lead">
        On July 10, 2025 the European Commission published the final{" "}
        <strong>General-Purpose AI Code of Practice</strong> — a voluntary
        instrument providers of GPAI models can sign to demonstrate
        compliance with Article 53 of the EU AI Act until harmonised
        standards are published. The signatory list matters to deployers,
        not just providers. Here is why.
      </p>

      <h2>Who has signed (and who has not)</h2>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Status</th>
            <th>Notable coverage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Anthropic</td>
            <td>Signed</td>
            <td>Claude Opus / Sonnet / Haiku families.</td>
          </tr>
          <tr>
            <td>OpenAI</td>
            <td>Signed</td>
            <td>GPT-4/5 families, o-series reasoning models.</td>
          </tr>
          <tr>
            <td>Google / DeepMind</td>
            <td>Signed (partial)</td>
            <td>Transparency and copyright chapters; systemic-risk chapter reportedly still under negotiation.</td>
          </tr>
          <tr>
            <td>Microsoft</td>
            <td>Signed</td>
            <td>AI systems provider signatory; covers Copilot integrations.</td>
          </tr>
          <tr>
            <td>Mistral AI</td>
            <td>Signed</td>
            <td>French provider; often cited as EU-data-residency-friendly.</td>
          </tr>
          <tr>
            <td>Cohere</td>
            <td>Signed</td>
            <td>Command R family.</td>
          </tr>
          <tr>
            <td>Meta</td>
            <td><strong>Declined</strong></td>
            <td>Publicly announced July 2025 refusal to sign the Code. Llama family remains unsigned.</td>
          </tr>
          <tr>
            <td>xAI</td>
            <td>Unsigned</td>
            <td>No public signing statement as of Q1 2026.</td>
          </tr>
          <tr>
            <td>DeepSeek, Alibaba Qwen</td>
            <td>Unsigned</td>
            <td>No public signing statements.</td>
          </tr>
        </tbody>
      </table>

      <h2>What signing actually commits a provider to</h2>
      <p>
        The Code of Practice has three chapters:
      </p>
      <ol>
        <li>
          <strong>Transparency.</strong> Provide model summaries, training
          data disclosure, downstream deployer documentation sufficient for
          compliance.
        </li>
        <li>
          <strong>Copyright.</strong> Respect opt-out signals from
          rightsholders, publish a policy, establish a complaints mechanism,
          make reasonable efforts to identify whether training data contains
          works that have been opted out.
        </li>
        <li>
          <strong>Systemic risk (for &quot;GPAI with systemic
          risk&quot;).</strong> Continuous risk assessment, reporting of
          serious incidents, red-teaming practices, cybersecurity safeguards.
        </li>
      </ol>
      <p>
        A signature commits the provider to all three chapters for the life
        of the Code. Non-signatories must still comply with Art. 53 — but
        they have to do it without the legal safe-harbour benefit of the
        Code.
      </p>

      <h2>Why this matters to deployers</h2>

      <h3>1. You inherit provider obligations when you fine-tune</h3>
      <p>
        Article 3(68)(b) of the AI Act extends the &quot;provider&quot;
        definition to a party that fine-tunes a GPAI model in a way that
        makes substantial changes. If you fine-tune Llama, GPT-4, or Claude
        for your product, you may become a provider of the resulting
        system. Your obligations then include Art. 53 — and the Code of
        Practice offers the clearest path to demonstrate compliance.
      </p>

      <h3>2. Your Annex IV documentation references upstream signatory status</h3>
      <p>
        Annex IV §2(a)-(d) requires you to document the methods and
        provenance of your system, including pre-trained model origin.
        Noting that your base model is from a Code signatory is an
        affirmative compliance signal. Documenting a non-signatory base
        model means you need more supplementary evidence.
      </p>

      <h3>3. Enterprise procurement increasingly asks</h3>
      <p>
        EU public-sector and regulated-industry buyers in 2026 have started
        asking deployer-vendors for the upstream model&apos;s Code of
        Practice status in RFP responses. If your answer is &quot;unsigned
        / unknown&quot;, you have some explaining to do. If your answer is
        &quot;Meta declined to sign, and here is how we compensate with our
        own Art. 53 evidence&quot;, you are in a stronger position.
      </p>

      <h2>Practical action items for deployers</h2>
      <ol>
        <li>
          <strong>Inventory your upstream providers.</strong> For every AI
          system in your inventory, record which GPAI model or provider it
          uses.
        </li>
        <li>
          <strong>Check signatory status.</strong> AIComply&apos;s GPAI
          tracker (auto-populated on the AI system detail page) does this
          for well-known providers. For niche providers, check the public
          Code website at code-of-practice.ai.
        </li>
        <li>
          <strong>Document compensation measures for non-signatories.</strong>
          If you are using Llama or another unsigned upstream, keep an
          evidence file of how you satisfy Art. 53 obligations (transparency
          documentation, copyright policy, etc.).
        </li>
        <li>
          <strong>Re-evaluate at every base-model upgrade.</strong> Signatory
          status can change. When you pin a new model version, re-check.
        </li>
      </ol>

      <h2>The Meta question</h2>
      <p>
        Meta&apos;s July 2025 public refusal to sign the Code drew coverage
        on TechCrunch, Reuters, and Politico. Meta&apos;s stated position
        was that the Code overreaches what Article 53 requires. This is a
        defensible legal posture but creates operational friction for
        deployers: Llama is the most popular open-weight base model in
        enterprise fine-tuning. Deployers who build on Llama have to
        supply their own Art. 53 evidence rather than inheriting the Code
        safe harbour.
      </p>
      <p>
        Pragmatic mitigations:
      </p>
      <ul>
        <li>
          For public-facing, consumer-trust-sensitive applications, prefer a
          signed-upstream model.
        </li>
        <li>
          For internal-only, single-tenant use cases where compliance
          inheritance is less load-bearing, Llama remains competitive.
        </li>
        <li>
          Document your choice. Regulators want to see that the choice was
          informed, not accidental.
        </li>
      </ul>

      <h2>How AIComply handles this</h2>
      <p>
        The GPAI tracker on every AI system detail page in AIComply matches
        the configured <code>vendor</code> and <code>base_model</code>{" "}
        against a maintained registry of Code of Practice signatories. It
        shows signed / declined / unsigned status plus deployer-side
        compensation guidance inline. The Regulated tier extends this into
        the Annex IV pack with automatic documentation of upstream
        provenance.
      </p>

      <h2>References</h2>
      <ul>
        <li>EU AI Act General-Purpose AI Code of Practice (final), 10 July 2025</li>
        <li>Regulation (EU) 2024/1689, Art. 3(68), Art. 53</li>
        <li>European Commission press release, 10 July 2025</li>
      </ul>
    </article>
  );
}
