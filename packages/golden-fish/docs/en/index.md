---
layout: home
title: Start Your Business in the UAE
description: "Expert UAE company formation services with transparent prepayment, step-by-step guidance, and full legal support. Banking, visas, and corporate structuring under one official contract."
showSponsors: false

hero:
  name: "Start Your Business in the UAE"
  tagline: "Stress-Free and Legally Guaranteed. Transparent pricing, step-by-step guidance, and official prepayment contract."
  actions:
    - theme: brand
      text: Calculate Business Setup Cost →
      link: "#contact-form"
    - theme: alt
      text: Schedule A Call →
      link: /resources/contacts
---

<style>
/* ======== Layout primitives ======== */
.gf-section {
  padding: clamp(32px, 4vw, 56px) 0;
  margin: 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
/* Kill any auto-inserted empty paragraphs between sections */
.VPHome p:empty { display: none; margin: 0; }
.gf-section-elevated { background: var(--vp-c-bg-elv); }
.gf-section-goldie { background: linear-gradient(135deg, rgba(201, 169, 97, 0.08) 0%, rgba(201, 169, 97, 0.02) 100%); border-top: 1px solid rgba(201, 169, 97, 0.15); border-bottom: 1px solid rgba(201, 169, 97, 0.15); }
.gf-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.gf-container-narrow { max-width: 800px; margin: 0 auto; padding: 0 24px; }

/* ======== Typography ======== */
.gf-eyebrow {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--vp-hl-color);
  background: rgba(201, 169, 97, 0.08);
  border: 1px solid rgba(201, 169, 97, 0.25);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}
.gf-h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 500; line-height: 1.2; letter-spacing: -0.01em; margin: 0 0 16px; color: var(--vp-c-main-3); }
.gf-h2-center { text-align: center; }
.gf-sub { font-size: 18px; line-height: 1.6; color: var(--vp-c-main-2); max-width: 720px; margin: 0 0 40px; }
.gf-sub-center { text-align: center; margin-left: auto; margin-right: auto; }

/* ======== Stats ======== */
.gf-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.gf-stat-card { padding: 32px 24px; background: var(--vp-c-bg-elv); border-radius: 16px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.04); }
.gf-stat-num { font-size: clamp(32px, 4vw, 44px); font-weight: 500; color: var(--vp-hl-color); line-height: 1.1; margin-bottom: 8px; letter-spacing: -0.02em; }
.gf-stat-label { font-size: 14px; color: var(--vp-c-main-2); letter-spacing: 0.01em; }

/* ======== Services grid ======== */
.gf-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto auto; gap: 16px; }
.gf-services-grid > .gf-svc-featured { grid-column: 1 / 3; grid-row: 1; }
.gf-services-grid > .gf-svc-secondary-spotlight { grid-column: 3; grid-row: 1; }
.gf-svc-card { padding: 28px; background: var(--vp-c-bg-elv); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.04); transition: border-color 0.2s, transform 0.2s; display: flex; flex-direction: column; }
.gf-svc-card:hover { border-color: rgba(201, 169, 97, 0.3); transform: translateY(-2px); }
.gf-svc-featured { padding: 40px; border-color: var(--vp-hl-color); display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
.gf-svc-featured .gf-img-placeholder { aspect-ratio: 4/3; }
.gf-svc-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(201, 169, 97, 0.12); color: var(--vp-hl-color); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
.gf-svc-featured .gf-svc-icon { width: 56px; height: 56px; font-size: 28px; }
.gf-svc-flag { display: inline-block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; background: var(--vp-hl-color); color: var(--vp-c-bg); font-weight: 500; margin-bottom: 12px; }
.gf-svc-title { font-size: 22px; font-weight: 500; margin: 0 0 8px; color: var(--vp-c-main-3); }
.gf-svc-featured .gf-svc-title { font-size: 28px; }
.gf-svc-secondary .gf-svc-title { font-size: 18px; }
.gf-svc-desc { font-size: 15px; color: var(--vp-c-main-2); line-height: 1.6; margin: 0 0 16px; }
.gf-svc-bullets { font-size: 14px; color: var(--vp-c-main-2); line-height: 1.8; margin: 0 0 20px; padding: 0; list-style: none; }
.gf-svc-bullets li::before { content: "→ "; color: var(--vp-hl-color); margin-right: 4px; }
.gf-svc-cta { font-size: 14px; font-weight: 500; color: var(--vp-hl-color); margin-top: auto; }
.gf-svc-cta:hover { text-decoration: underline; }

/* ======== Prepayment promise ======== */
.gf-prepay-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: start; }
.gf-prepay-list { background: var(--vp-c-bg); border-radius: 16px; padding: 28px; border: 1px solid rgba(201, 169, 97, 0.2); }
.gf-prepay-list-eyebrow { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--vp-hl-color); font-weight: 500; margin-bottom: 16px; }
.gf-prepay-list ul { list-style: none; padding: 0; margin: 0; }
.gf-prepay-list li { padding: 8px 0; color: var(--vp-c-main-2); font-size: 15px; line-height: 1.5; display: flex; gap: 10px; }
.gf-prepay-list li::before { content: "✓"; color: var(--vp-hl-color); font-weight: 500; flex-shrink: 0; }
.gf-cta-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border: 1px solid var(--vp-hl-color); border-radius: 8px; color: var(--vp-hl-color); font-weight: 500; font-size: 15px; transition: all 0.2s; margin-top: 8px; }
.gf-cta-link:hover { background: rgba(201, 169, 97, 0.1); }

/* ======== Why us ======== */
.gf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gf-benefit-card { padding: 32px; background: var(--vp-c-bg-elv); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.04); }
.gf-benefit-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(201, 169, 97, 0.12); color: var(--vp-hl-color); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
.gf-benefit-title { font-size: 18px; font-weight: 500; margin: 0 0 10px; color: var(--vp-c-main-3); }
.gf-benefit-desc { font-size: 15px; color: var(--vp-c-main-2); line-height: 1.6; margin: 0; }

/* ======== Cases ======== */
.gf-cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gf-case-card { background: var(--vp-c-bg-elv); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.04); display: flex; flex-direction: column; }
.gf-case-img { aspect-ratio: 16/9; }
.gf-case-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.gf-case-tag { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-hl-color); font-weight: 500; margin-bottom: 10px; }
.gf-case-title { font-size: 18px; font-weight: 500; color: var(--vp-c-main-3); margin: 0 0 8px; }
.gf-case-stats { font-size: 13px; color: var(--vp-c-main-1); margin-bottom: 12px; }
.gf-case-quote { font-size: 14px; color: var(--vp-c-main-2); line-height: 1.6; font-style: italic; margin: 12px 0 0; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.gf-case-author { font-size: 12px; color: var(--vp-c-main-1); margin-top: 6px; font-style: normal; }

/* ======== Goldie ======== */
.gf-goldie-shell { display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px; align-items: center; }
.gf-goldie-avatar { aspect-ratio: 1; max-width: 240px; margin: 0 auto; border-radius: 24px; background: linear-gradient(135deg, rgba(201, 169, 97, 0.15) 0%, rgba(201, 169, 97, 0.05) 100%); border: 1px dashed rgba(201, 169, 97, 0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--vp-hl-color); gap: 12px; }
.gf-goldie-avatar-icon { font-size: 80px; }
.gf-goldie-avatar small { font-size: 11px; letter-spacing: 0.06em; opacity: 0.7; text-align: center; padding: 0 16px; }
.gf-chip-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0 24px; }
.gf-chip { font-size: 13px; padding: 6px 14px; border-radius: 999px; background: var(--vp-c-bg-elv); border: 1px solid rgba(255, 255, 255, 0.06); color: var(--vp-c-main-2); }
.gf-button-row { display: flex; gap: 12px; flex-wrap: wrap; }
.gf-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 15px; transition: all 0.2s; }
.gf-btn-gold { background: var(--vp-hl-color); color: var(--vp-c-bg); }
.gf-btn-gold:hover { opacity: 0.9; }
.gf-btn-outline { border: 1px solid var(--vp-c-main-1); color: var(--vp-c-main-3); }
.gf-btn-outline:hover { border-color: var(--vp-c-main-3); }

/* ======== FAQ ======== */
.gf-faq { max-width: 800px; margin: 0 auto; }
.gf-faq .vp-doc details,
.gf-section .vp-doc details { background: var(--vp-c-bg-elv); border-radius: 12px; padding: 16px 20px; margin: 8px 0; border: 1px solid rgba(255, 255, 255, 0.04); }

/* ======== Final CTA ======== */
.gf-final-cta { text-align: center; max-width: 720px; margin: 0 auto; }
.gf-final-trust { font-size: 13px; color: var(--vp-c-main-1); margin-top: 24px; }

/* ======== Link / button underline reset ======== */
.gf-btn,
.gf-btn:hover,
.gf-cta-link,
.gf-cta-link:hover,
.gf-svc-cta {
  text-decoration: none;
}
.gf-svc-cta:hover {
  text-decoration: underline;
}

/* ======== FAQ custom markers ======== */
.gf-faq details {
  background: var(--vp-c-bg-elv);
  border-radius: 12px;
  padding: 0;
  margin: 8px 0;
  border: 1px solid rgba(255, 255, 255, 0.04);
  overflow: hidden;
}
.gf-faq details > summary {
  cursor: pointer;
  list-style: none;
  font-weight: 500;
  color: var(--vp-c-main-3);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: background 0.15s;
}
.gf-faq details > summary:hover {
  background: rgba(255, 255, 255, 0.02);
}
.gf-faq details > summary::-webkit-details-marker {
  display: none;
}
.gf-faq details > summary::marker {
  content: '';
}
.gf-faq details > summary::before {
  content: "+";
  display: inline-block;
  width: 18px;
  font-size: 22px;
  font-weight: 300;
  color: var(--vp-hl-color);
  flex-shrink: 0;
  line-height: 1;
}
.gf-faq details[open] > summary::before {
  content: "−";
}
.gf-faq details > *:not(summary) {
  padding: 0 20px 18px 52px;
  color: var(--vp-c-main-2);
  font-size: 15px;
  line-height: 1.6;
}
.gf-faq details > *:not(summary) a {
  color: var(--vp-hl-color);
}

/* ======== Image placeholder ======== */
.gf-img-placeholder { aspect-ratio: 16/9; background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--vp-c-main-1); gap: 6px; padding: 16px; text-align: center; }
.gf-img-placeholder-label { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
.gf-img-placeholder-hint { font-size: 11px; opacity: 0.7; }

/* ======== Responsive ======== */
@media (max-width: 960px) {
  .gf-stats { grid-template-columns: repeat(2, 1fr); }
  .gf-services-grid { grid-template-columns: 1fr; }
  .gf-services-grid > .gf-svc-featured,
  .gf-services-grid > .gf-svc-secondary-spotlight { grid-column: 1; grid-row: auto; }
  .gf-svc-featured { grid-template-columns: 1fr; gap: 24px; }
  .gf-grid-3, .gf-cases-grid { grid-template-columns: 1fr; }
  .gf-prepay-grid { grid-template-columns: 1fr; gap: 32px; }
  .gf-goldie-shell { grid-template-columns: 1fr; gap: 24px; text-align: center; }
}
</style>

<!-- ============================================================ -->
<!-- BLOCK 2: STATS                                                -->
<!-- ============================================================ -->

<div class="gf-section">
  <div class="gf-container">
    <div class="gf-stats">
      <div class="gf-stat-card">
        <div class="gf-stat-num">200+</div>
        <div class="gf-stat-label">Clients served</div>
      </div>
      <div class="gf-stat-card">
        <div class="gf-stat-num">15+</div>
        <div class="gf-stat-label">Free zones covered</div>
      </div>
      <div class="gf-stat-card">
        <div class="gf-stat-num">96%</div>
        <div class="gf-stat-label">Bank approval rate</div>
      </div>
      <div class="gf-stat-card">
        <div class="gf-stat-num">5+ yrs</div>
        <div class="gf-stat-label">In UAE market</div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 3: SERVICES                                             -->
<!-- ============================================================ -->

<div class="gf-section gf-section-elevated">
  <div class="gf-container">
    <div class="gf-eyebrow">OUR SERVICES</div>
    <h2 class="gf-h2">Everything you need under one roof</h2>
    <p class="gf-sub">Setup is our headline service. Banking, residency, and legal sit alongside — all under the same prepayment promise.</p>
    <div class="gf-services-grid">
      <div class="gf-svc-card gf-svc-featured">
        <div>
          <span class="gf-svc-flag">Featured</span>
          <div class="gf-svc-icon"><Icon icon="tabler:building-skyscraper" /></div>
          <h3 class="gf-svc-title">Company Setup</h3>
          <p class="gf-svc-desc">Free zone, mainland, offshore — fully managed. Detailed quote upfront, price locked in writing, 4–6 weeks to launch.</p>
          <ul class="gf-svc-bullets">
            <li>100% foreign ownership · 9% corporate tax</li>
            <li>All major free zones covered</li>
            <li>Bank introduction included</li>
          </ul>
          <a href="/uae-business/offer/company-registration/" class="gf-svc-cta">Explore Company Setup →</a>
        </div>
        <div class="gf-img-placeholder">
          <span class="gf-img-placeholder-label">Image placeholder</span>
          <span class="gf-img-placeholder-hint">Suggested: photo of UAE company office or a license document</span>
        </div>
      </div>
      <div class="gf-svc-card gf-svc-secondary gf-svc-secondary-spotlight">
        <div class="gf-svc-icon"><Icon icon="tabler:building-bank" /></div>
        <h3 class="gf-svc-title">Banking</h3>
        <p class="gf-svc-desc">UAE corporate accounts opened with major banks. Guaranteed approval methodology.</p>
        <ul class="gf-svc-bullets">
          <li>96% approval rate</li>
          <li>All major UAE banks</li>
          <li>Multi-currency setup</li>
        </ul>
        <a href="/uae-business/offer/banking/" class="gf-svc-cta">Explore Banking →</a>
      </div>
      <div class="gf-svc-card gf-svc-secondary">
        <div class="gf-svc-icon"><Icon icon="tabler:id-badge-2" /></div>
        <h3 class="gf-svc-title">Residency & Visas</h3>
        <p class="gf-svc-desc">Long-term residence tied to your company. Owners, partners, employees, and family members.</p>
        <a href="/uae-business/offer/golden-visa/" class="gf-svc-cta">Residency →</a>
      </div>
      <div class="gf-svc-card gf-svc-secondary">
        <div class="gf-svc-icon"><Icon icon="tabler:gavel" /></div>
        <h3 class="gf-svc-title">Legal & Structuring</h3>
        <p class="gf-svc-desc">Corporate structuring, shareholder agreements, M&A, restructuring, dispute resolution. In-house licensed team.</p>
        <a href="/uae-business/offer/legal-support/" class="gf-svc-cta">Legal →</a>
      </div>
      <div class="gf-svc-card gf-svc-secondary">
        <div class="gf-svc-icon"><Icon icon="tabler:calculator" /></div>
        <h3 class="gf-svc-title">Tax & Compliance</h3>
        <p class="gf-svc-desc">Corporate tax, VAT, ESR, UBO, accounting & payroll. Keep your UAE entity in good standing.</p>
        <a href="/uae-business/company-registration/Protect-Your-Business" class="gf-svc-cta">Compliance →</a>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 4: PREPAYMENT PROMISE                                   -->
<!-- ============================================================ -->

<div class="gf-section">
  <div class="gf-container">
    <div class="gf-eyebrow">TRANSPARENT PREPAYMENT MODEL</div>
    <h2 class="gf-h2">No hidden fees. The quote you see is the bill you pay.</h2>
    <div class="gf-prepay-grid">
      <div>
        <p class="gf-sub" style="margin-bottom: 24px;">We assess your case and provide a fixed-price quote in advance, with a detailed breakdown of every cost. If your case requires additional services later, we inform you beforehand and only proceed with your written approval. No surprises, no fine print, no scope creep.</p>
        <a href="/uae-business/benefits/prepayment-model" class="gf-cta-link">Read the full model<Icon icon="tabler:arrow-right" /></a>
      </div>
      <div class="gf-prepay-list">
        <div class="gf-prepay-list-eyebrow">What you get</div>
        <ul>
          <li>Transparent pricing structure</li>
          <li>Full understanding of every cost</li>
          <li>No hidden or unexpected fees</li>
          <li>Written agreement, locked in</li>
          <li>Peace of mind from day one</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 5: WHY GOLDEN FISH                                      -->
<!-- ============================================================ -->

<div class="gf-section gf-section-elevated">
  <div class="gf-container">
    <div class="gf-eyebrow">WHY US</div>
    <h2 class="gf-h2">Built for trust</h2>
    <p class="gf-sub">Three things that make working with Golden Fish different from a typical setup agency.</p>
    <div class="gf-grid-3">
      <div class="gf-benefit-card">
        <div class="gf-benefit-icon"><Icon icon="tabler:certificate" /></div>
        <h3 class="gf-benefit-title">Registered UAE provider</h3>
        <p class="gf-benefit-desc">Every engagement under a legal contract. No agents, no outsourcing, no middlemen.</p>
      </div>
      <div class="gf-benefit-card">
        <div class="gf-benefit-icon"><Icon icon="tabler:users-group" /></div>
        <h3 class="gf-benefit-title">In-house licensed team</h3>
        <p class="gf-benefit-desc">Specialists in legal, banking, and visas. One team from inquiry to ongoing support.</p>
      </div>
      <div class="gf-benefit-card">
        <div class="gf-benefit-icon"><Icon icon="tabler:lock-check" /></div>
        <h3 class="gf-benefit-title">Transparent prepayment</h3>
        <p class="gf-benefit-desc">Fixed-price quote upfront. Work starts only after you review and approve the commercial offer.</p>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 6: CASES MIX                                            -->
<!-- ============================================================ -->

<div class="gf-section">
  <div class="gf-container">
    <div class="gf-eyebrow">REAL CLIENTS</div>
    <h2 class="gf-h2">Across all our services</h2>
    <p class="gf-sub">Specific outcomes from setup, banking, and residency engagements.</p>
    <div class="gf-cases-grid">
      <div class="gf-case-card">
        <div class="gf-img-placeholder gf-case-img">
          <span class="gf-img-placeholder-label">Image placeholder</span>
          <span class="gf-img-placeholder-hint">Logo or office photo (with NDA — abstract image)</span>
        </div>
        <div class="gf-case-content">
          <div class="gf-case-tag">SETUP CASE</div>
          <h3 class="gf-case-title">SaaS startup, Berlin → Dubai</h3>
          <div class="gf-case-stats">12 employees · IFZA · 4 visas · Bank on first try</div>
          <p class="gf-svc-desc">Full team relocation in 5 weeks. Trade licence, visas, and corporate account opened in parallel.</p>
          <p class="gf-case-quote">"They handled everything I dreaded — paperwork, bank meetings, government filings. I just signed."<br><span class="gf-case-author">— [Name], CEO</span></p>
        </div>
      </div>
      <div class="gf-case-card">
        <div class="gf-img-placeholder gf-case-img">
          <span class="gf-img-placeholder-label">Image placeholder</span>
          <span class="gf-img-placeholder-hint">Abstract image — banking / fintech</span>
        </div>
        <div class="gf-case-content">
          <div class="gf-case-tag">BANKING CASE</div>
          <h3 class="gf-case-title">High-risk crypto consultancy</h3>
          <div class="gf-case-stats">Refused twice elsewhere · Approved on third try · 6 weeks</div>
          <p class="gf-svc-desc">Most agencies refused the case outright. We restructured the application and prepared full due diligence package.</p>
          <p class="gf-case-quote">"Two agencies told us 'impossible'. Golden Fish told us how. Account opened with our preferred bank."<br><span class="gf-case-author">— [Name], Founder</span></p>
        </div>
      </div>
      <div class="gf-case-card">
        <div class="gf-img-placeholder gf-case-img">
          <span class="gf-img-placeholder-label">Image placeholder</span>
          <span class="gf-img-placeholder-hint">Family / residency / lifestyle photo</span>
        </div>
        <div class="gf-case-content">
          <div class="gf-case-tag">RESIDENCY CASE</div>
          <h3 class="gf-case-title">Family of 5 + Golden Visa</h3>
          <div class="gf-case-stats">7 weeks · School & medical · Family visas</div>
          <p class="gf-svc-desc">Investor route, full family relocation including school enrolment support and medical insurance.</p>
          <p class="gf-case-quote">"From investor visa to school placements — they made our move into Dubai feel effortless."<br><span class="gf-case-author">— [Name], Family principal</span></p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 7: ASK GOLDIE                                           -->
<!-- ============================================================ -->

<div class="gf-section gf-section-goldie">
  <div class="gf-container">
    <div class="gf-goldie-shell">
      <div class="gf-goldie-avatar">
        <Icon icon="tabler:fish" class="gf-goldie-avatar-icon" />
        <small>Goldie character placeholder<br>(brand illustration TBD)</small>
      </div>
      <div>
        <div class="gf-eyebrow">FREE · INSTANT · 24/7</div>
        <h2 class="gf-h2">Ask Goldie anything about UAE</h2>
        <p class="gf-sub" style="margin-bottom: 12px;">Goldie is our AI helper — not a human expert. Ask about company setup, free zones, visas, banks, taxes, even "where to live in Dubai with kids". Goldie is fast, knowledgeable, and never sleeps.</p>
        <div class="gf-chip-row">
          <span class="gf-chip">Mainland vs free zone?</span>
          <span class="gf-chip">UAE corporate tax</span>
          <span class="gf-chip">Golden Visa requirements</span>
          <span class="gf-chip">Free zone licence costs</span>
        </div>
        <div class="gf-button-row">
          <a href="/chat" class="gf-btn gf-btn-gold"><Icon icon="tabler:fish" /> Chat with Goldie</a>
          <a href="/resources/contacts" class="gf-btn gf-btn-outline">Talk to a real expert</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 8: FAQ                                                  -->
<!-- ============================================================ -->

<div class="gf-section">
  <div class="gf-container-narrow">
    <h2 class="gf-h2 gf-h2-center">Frequently asked questions</h2>
    <p class="gf-sub gf-sub-center">Hub-level questions about Golden Fish & UAE setup. Service-specific FAQs live on each service page.</p>
    <div class="gf-faq">

:::details How does prepayment work — is my money safe?
You receive a detailed itemised quote before any work begins. Once you approve, the price is locked in a written contract. Work starts after you sign — no automatic add-ons, no scope creep. Refund conditions are clearly stated in your agreement. [Read the full prepayment model →](/uae-business/benefits/prepayment-model)
:::

:::details Do I need to fly to Dubai to start?
No. Most of our setup work — including company registration, document preparation, and initial banking applications — can be completed remotely. You'll typically need to be in Dubai once for biometrics (Emirates ID) and final visa stamping.
:::

:::details What's included in your prices?
Every quote separates government fees (free zone, DED, FTA, immigration) from our professional service fees. You see exactly what goes where, line by line, before you pay anything.
:::

:::details How long does the whole process take?
Free zone setup: 4–6 weeks from licence approval to bank account. Mainland: 5–8 weeks. Visas: typically 2–3 weeks once the company is registered. Specific timelines depend on your case.
:::

:::details Can I get a UAE visa for my family?
Yes. Once you hold a UAE residence visa as a company owner or employee, you can sponsor your spouse, children, and (in some cases) parents. We handle the full sponsorship process.
:::

:::details What if I'm not sure which service I need?
Tell us your situation, and we'll recommend the right path. If your case is simple, we may suggest you proceed directly with self-service through a free zone portal — we don't push services you don't need.
:::

</div>
  </div>
</div>

<!-- ============================================================ -->
<!-- BLOCK 9: FINAL CTA                                            -->
<!-- ============================================================ -->

<div class="gf-section gf-section-elevated" id="contact-form">
  <div class="gf-container-narrow">
    <div class="gf-final-cta">
      <h2 class="gf-h2 gf-h2-center">Ready to start? Tell us what you need.</h2>
      <p class="gf-sub gf-sub-center">Send your case details below — we'll come back with a fixed-price quote within 24 hours.</p>
      <ContactForm buttonText="Get my detailed quote" />
      <p class="gf-final-trust">No spam. No sales pressure. Real quotes from real specialists.</p>
    </div>
  </div>
</div>
