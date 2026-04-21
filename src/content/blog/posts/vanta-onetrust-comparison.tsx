export default function VantaComparison() {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-violet-700">
      <p className="lead">
        EU AI Act compliance is a crowded category. Here is an honest,
        feature-for-feature 2026 comparison of the platforms most SMB buyers
        shortlist: Vanta, OneTrust, Credo AI, Modulos, and AIComply. If you
        are above 500 employees and running multi-framework GRC already,
        some of these beat us on breadth. Below 500, we win on ergonomics
        and price by an order of magnitude.
      </p>

      <h2>Pricing at a glance (Q1 2026 research)</h2>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Entry annual cost</th>
            <th>EU AI Act module availability</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AIComply</td>
            <td>$0 (Free) / $588 (Pro)</td>
            <td>Core product</td>
          </tr>
          <tr>
            <td>Modulos</td>
            <td>€15,000</td>
            <td>Core product + ISO 42001 certification path</td>
          </tr>
          <tr>
            <td>Credo AI</td>
            <td>$30,000</td>
            <td>Core product (ML-dev-lifecycle focused)</td>
          </tr>
          <tr>
            <td>Vanta EU AI Act module</td>
            <td>€50,000+</td>
            <td>Module added to GRC platform contract</td>
          </tr>
          <tr>
            <td>OneTrust AI Governance</td>
            <td>€80,000-€200,000+</td>
            <td>Module within enterprise platform</td>
          </tr>
        </tbody>
      </table>

      <h2>Feature matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>AIComply</th>
            <th>Vanta</th>
            <th>OneTrust</th>
            <th>Credo</th>
            <th>Modulos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AI system inventory + classification</td>
            <td>✔ free tier</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td>Article 4 literacy register</td>
            <td>✔ Pro</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Art. 27 FRIA generator</td>
            <td>✔ Pro (Claude-drafted)</td>
            <td>module add-on</td>
            <td>✔ manual</td>
            <td>✔ manual</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Art. 35 DPIA generator</td>
            <td>✔ Pro (Claude-drafted)</td>
            <td>✔ template</td>
            <td>✔ workflow</td>
            <td>✔ template</td>
            <td>✔ integrated</td>
          </tr>
          <tr>
            <td>Annex IV technical documentation pack</td>
            <td>✔ Regulated tier</td>
            <td>—</td>
            <td>✔</td>
            <td>✔ partial</td>
            <td>✔</td>
          </tr>
          <tr>
            <td>GPAI Code of Practice signatory tracking</td>
            <td>✔</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Public trust page</td>
            <td>✔ free tier</td>
            <td>✔ enterprise</td>
            <td>✔ enterprise</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>ISO 42001 certification path</td>
            <td>—</td>
            <td>—</td>
            <td>✔</td>
            <td>—</td>
            <td>✔ certified platform</td>
          </tr>
          <tr>
            <td>Multi-framework (SOC 2, ISO 27001, HIPAA)</td>
            <td>—</td>
            <td>✔ core</td>
            <td>✔ core</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>SSO / SCIM / enterprise IAM</td>
            <td>roadmap</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
        </tbody>
      </table>

      <h2>Where each platform wins</h2>

      <h3>AIComply wins when</h3>
      <ul>
        <li>
          You are a 10-500 person SaaS with EU users and no dedicated
          compliance team.
        </li>
        <li>
          You want a FRIA or DPIA draft in 15 minutes, not 15 meetings.
        </li>
        <li>
          You need GPAI upstream tracking (we are the only platform that
          surfaces this inline).
        </li>
        <li>
          You want a public trust page without paying enterprise pricing.
        </li>
        <li>
          Flat-rate pricing is load-bearing for your budget — no renewal
          shocks.
        </li>
      </ul>

      <h3>Vanta wins when</h3>
      <ul>
        <li>
          You are already on Vanta for SOC 2 / ISO 27001 and want a single
          GRC system.
        </li>
        <li>
          Your audience is buyers who specifically recognise the Vanta
          badge.
        </li>
      </ul>

      <h3>OneTrust wins when</h3>
      <ul>
        <li>
          You are 1,000+ employees with multiple global frameworks in scope
          (GDPR, CCPA, AI Act, LGPD, POPIA).
        </li>
        <li>
          You have a dedicated privacy / compliance team that can run the
          platform at full depth.
        </li>
      </ul>

      <h3>Credo AI wins when</h3>
      <ul>
        <li>
          You are primarily building AI, not deploying it — their focus is
          ML-dev-lifecycle governance.
        </li>
        <li>
          You need policy-as-code for model risk controls.
        </li>
      </ul>

      <h3>Modulos wins when</h3>
      <ul>
        <li>
          You are pursuing ISO/IEC 42001 certification — they are the only
          platform with certified status.
        </li>
        <li>
          You need a provider-side technical documentation workflow with
          formal traceability to harmonised standards.
        </li>
      </ul>

      <h2>The renewal-hike problem</h2>
      <p>
        A recurring G2 and Reddit theme in 2024-2026: Vanta and Drata
        renewal prices jump 40-100% after the first year. Examples we have
        seen documented:
      </p>
      <ul>
        <li>Vanta: $18,000 year-one → $28,000 year-two (SOC 2 + ISO 27001 bundle).</li>
        <li>Drata: $7,500 year-one → $20,000 year-two when a framework is added mid-term.</li>
      </ul>
      <p>
        AIComply prices flat. The Pro plan is $49/month whether you are in
        year one or year five. If you find this claim false in the future,
        tell us and we will correct the post.
      </p>

      <h2>How buyers should shortlist</h2>
      <ol>
        <li>
          <strong>Count your employees + EU-exposed AI systems.</strong> If
          you have fewer than 500 employees and fewer than 20 AI systems,
          start with AIComply Pro ($49/month) and see how far it takes you.
          If you outgrow it, migrating to Vanta or OneTrust later is a
          standard exercise.
        </li>
        <li>
          <strong>Check whether you need ISO/IEC 42001.</strong> If yes,
          Modulos is the only platform with certified status today — put
          them on the shortlist.
        </li>
        <li>
          <strong>Check whether you also need SOC 2 / ISO 27001.</strong> If
          yes, Vanta&apos;s bundling argument becomes stronger. If you only
          need AI Act, the bundling has negative value (you pay for
          everything else).
        </li>
        <li>
          <strong>Confirm the renewal pricing in writing.</strong> Ask every
          enterprise vendor for their first-year-to-second-year pricing
          delta. It is a reasonable question.
        </li>
      </ol>

      <h2>Try AIComply before paying enterprise prices</h2>
      <p>
        <a href="/signup">Start free</a> — one AI system tracked, full
        classification, literacy register. See the DPIA generator, FRIA
        generator, GPAI tracker, and trust page before committing. If
        AIComply does not fit, you will still have a clearer picture of
        what enterprise platforms need to cover.
      </p>
    </article>
  );
}
