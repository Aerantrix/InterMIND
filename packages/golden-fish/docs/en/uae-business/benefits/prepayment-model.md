---
title: "Transparent Prepayment Model — No Hidden Fees"
description: "Golden Fish operates on a transparent prepayment model: a fixed-price quote with a detailed breakdown of every cost, agreed in writing before work begins. No hidden charges, no surprises."
---

<script setup>
function ppAnimBars() {
  if (typeof document === 'undefined') return
  const bars = document.querySelectorAll('.pp-schematic .pp-bar-ta[data-w]')
  bars.forEach((bar, i) => {
    bar.style.width = '0%'
    setTimeout(() => { bar.style.width = bar.dataset.w + '%' }, 250 + i * 220)
  })
}

function ppToggleCmp(e) {
  if (typeof document === 'undefined') return
  const g = document.getElementById('pp-grid')
  const b = e.currentTarget
  g.classList.toggle('pp-solo')
  if (g.classList.contains('pp-solo')) {
    b.textContent = 'Show comparison with typical agency'
  } else {
    b.textContent = 'Hide comparison'
    ppAnimBars()
  }
}
</script>

<style>
.pp-schematic { margin: 2rem 0; }
.pp-schematic .pp-ctrl { display: flex; justify-content: flex-end; margin: 0 0 16px; }
.pp-schematic .pp-ctrl button { background: transparent; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.pp-schematic .pp-ctrl button:hover { border-color: var(--vp-c-text-3); color: var(--vp-c-text-1); }
.pp-schematic .pp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.pp-schematic .pp-grid.pp-solo { grid-template-columns: 1fr; max-width: 540px; }
.pp-schematic .pp-grid.pp-solo .pp-col-typical { display: none; }
.pp-schematic .pp-col-head { font-size: 11px; letter-spacing: 0.08em; padding: 8px 0; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 12px; font-weight: 500; color: var(--vp-c-text-3); }
.pp-schematic .pp-col-gf .pp-col-head { color: var(--vp-c-success-1); border-bottom-color: var(--vp-c-success-soft); }
.pp-schematic .pp-col-typical .pp-col-head { color: var(--vp-c-warning-1); border-bottom-color: var(--vp-c-warning-soft); }
.pp-schematic .pp-step { display: grid; grid-template-columns: 32px 1fr; gap: 12px; padding: 6px 0 14px; position: relative; }
.pp-schematic .pp-step:not(:last-of-type)::after { content: ''; position: absolute; left: 15px; top: 38px; bottom: -2px; width: 1px; background: var(--vp-c-divider); }
.pp-schematic .pp-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--vp-c-bg-soft); display: flex; align-items: center; justify-content: center; color: var(--vp-c-text-2); border: 1px solid var(--vp-c-divider); flex-shrink: 0; margin-top: 2px; }
.pp-schematic .pp-icon svg { width: 14px; height: 14px; }
.pp-schematic .pp-step.pp-locked .pp-icon { background: var(--vp-c-success-soft); color: var(--vp-c-success-1); border-color: var(--vp-c-success-1); }
.pp-schematic .pp-step.pp-bad .pp-icon { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); border-color: var(--vp-c-warning-1); }
.pp-schematic .pp-step h4 { margin: 0 0 3px; font-size: 14px; font-weight: 500; color: var(--vp-c-text-1); }
.pp-schematic .pp-step.pp-locked h4 { color: var(--vp-c-success-1); }
.pp-schematic .pp-step p { font-size: 13px; color: var(--vp-c-text-2); margin: 0 0 8px; line-height: 1.5; }
.pp-schematic .pp-bar-wrap { width: 100%; height: 6px; background: var(--vp-c-bg-soft); border-radius: 3px; overflow: hidden; }
.pp-schematic .pp-bar { display: block; height: 100%; border-radius: 3px; transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.pp-schematic .pp-bar-gf { background: var(--vp-c-success-1); }
.pp-schematic .pp-bar-ta { background: var(--vp-c-warning-1); width: 0; }
.pp-schematic .pp-final { padding: 12px 14px; border-radius: 8px; margin-top: 14px; }
.pp-schematic .pp-final-label { font-size: 11px; letter-spacing: 0.08em; font-weight: 500; margin-bottom: 8px; }
.pp-schematic .pp-final-gf { background: var(--vp-c-success-soft); border: 1px solid var(--vp-c-success-1); color: var(--vp-c-success-1); }
.pp-schematic .pp-final-ta { background: var(--vp-c-warning-soft); border: 1px solid var(--vp-c-warning-1); color: var(--vp-c-warning-1); }
.pp-schematic .pp-final-note { font-size: 13px; margin-top: 8px; line-height: 1.4; }
.pp-schematic .pp-final-note small { display: block; opacity: 0.75; font-size: 11px; margin-top: 3px; font-weight: 400; }
@media (max-width: 640px) { .pp-schematic .pp-grid { grid-template-columns: 1fr; } }
</style>

# Transparent Prepayment Model — No Hidden Fees

At Golden Fish, we believe in full transparency and fairness from the very beginning. That's why our services are built around a clear prepayment model — with **no hidden charges, no fine print, and no surprises**.

You pay only for the agreed scope of services. Before any work begins, we provide a detailed, itemised breakdown of every cost. The price you approve today is the bill you settle at the end — locked in writing.

> [!INFO] What this means for you
> One detailed quote. One signed agreement. One final invoice that matches the quote — to the dirham.

## How Our Prepayment Model Works

<div class="pp-schematic">

<div class="pp-ctrl"><button @click="ppToggleCmp">Show comparison with typical agency</button></div>

<div class="pp-grid pp-solo" id="pp-grid">
  <div class="pp-col pp-col-gf">
    <div class="pp-col-head">GOLDEN FISH</div>
    <div class="pp-step">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l1.3-3.9a9 8 0 1 1 3.4 2.9l-4.7 1z"/></svg></div>
      <div><h4>Free consultation</h4><p>Discovery session to identify your needs.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div></div>
    </div>
    <div class="pp-step">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 17h6"/><path d="M9 13h6"/></svg></div>
      <div><h4>Itemised quote</h4><p>Fixed-price breakdown within 24–48 hours.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div></div>
    </div>
    <div class="pp-step pp-locked">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-6z"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0"/><path d="M8 11v-4a4 4 0 1 1 8 0v4"/></svg></div>
      <div><h4>Written agreement</h4><p>Price locked in formal contract.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div></div>
    </div>
    <div class="pp-step">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/></svg></div>
      <div><h4>Operational execution</h4><p>We manage the entire workload.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div></div>
    </div>
    <div class="pp-step">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M6 4v4"/><path d="M6 12v8"/><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M12 4v10"/><path d="M12 18v2"/><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M18 4v1"/><path d="M18 9v11"/></svg></div>
      <div><h4>Managed scope</h4><p>Changes only with your written consent.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div></div>
    </div>
    <div class="pp-final pp-final-gf">
      <div class="pp-final-label">FINAL AMOUNT</div>
      <div class="pp-bar-wrap"><div class="pp-bar pp-bar-gf" style="width:50%"></div></div>
      <div class="pp-final-note">Exactly as quoted<small>Locked in your written agreement</small></div>
    </div>
  </div>
  <div class="pp-col pp-col-typical">
    <div class="pp-col-head">TYPICAL AGENCY</div>
    <div class="pp-step pp-bad">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l1.3-3.9a9 8 0 1 1 3.4 2.9l-4.7 1z"/></svg></div>
      <div><h4>Initial estimate</h4><p>"From..." — a vague starting point.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="38"></div></div></div>
    </div>
    <div class="pp-step pp-bad">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></div>
      <div><h4>+ Document fees</h4><p>Translation, notarisation, processing.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="44"></div></div></div>
    </div>
    <div class="pp-step pp-bad">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></div>
      <div><h4>+ Apostille</h4><p>"We forgot to mention attestation."</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="62"></div></div></div>
    </div>
    <div class="pp-step pp-bad">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></div>
      <div><h4>+ Bank extras</h4><p>"The bank wants additional documents."</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="80"></div></div></div>
    </div>
    <div class="pp-step pp-bad">
      <div class="pp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></div>
      <div><h4>+ Reconciliation</h4><p>Final adjustment to the invoice.</p><div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="95"></div></div></div>
    </div>
    <div class="pp-final pp-final-ta">
      <div class="pp-final-label">FINAL AMOUNT</div>
      <div class="pp-bar-wrap"><div class="pp-bar pp-bar-ta" data-w="95"></div></div>
      <div class="pp-final-note">Typically 50–80% above the initial estimate<small>Based on industry observations</small></div>
    </div>
  </div>
</div>

</div>

Our process is designed to give you full visibility and control at every step:

1. **Free initial consultation.** You tell us what you need — company setup, banking, residency, or a combination. We listen, ask the right questions, and identify any complications upfront.

2. **Detailed itemised quote.** Within 24–48 hours, our team prepares a fixed-price quote with a full breakdown: government fees, professional services, third-party costs, timelines. Nothing hidden, nothing aggregated into vague line items.

3. **Written agreement.** Once you approve the quote, we lock the price in a written contract. From this point forward, the total amount you pay does not change — unless you yourself ask for additional services.

4. **Work begins.** We handle every step: documentation, government filings, bank applications, visas, compliance. You stay informed, but we carry the operational load.

5. **Scope changes — only with your written approval.** If your case develops in a way that genuinely requires additional services (a new visa, a second bank application, an extra entity), we explain the situation, provide a separate quote for the additional work, and only proceed once you give written consent. Never automatic. Never assumed.

## What You Get

- **Transparent pricing structure** — every cost itemised, every line explained
- **Full understanding of what you're paying for** — no «miscellaneous» or «administrative» catch-alls
- **No hidden or unexpected fees** — the quote is the contract is the invoice
- **Written contractual protection** — your price is locked, in writing, before work begins
- **Peace of mind and trust from day one** — you know exactly where you stand at every stage

## Frequently Asked Questions

:::details What if my case requires additional services later?

We will always inform you beforehand. If, during the process, your case genuinely requires services beyond the original scope (for example, a second bank application, an additional visa, or an unforeseen government requirement), we explain the situation in writing and provide a separate fixed-price quote for the additional work. We only proceed once you give written approval. There are no automatic add-ons, ever.

:::

:::details Is my prepayment refundable?

Yes — within reasonable limits set out in your contract. If we have not yet incurred third-party costs (government fees, bank application fees, etc.) and you decide to cancel, we refund the remaining balance for work not yet performed. The exact refund terms are clearly stated in your written agreement before you pay anything.

:::

:::details What's the difference between government fees and your service fees?

Government fees (paid to free zones, DED, FTA, immigration, banks, etc.) are non-refundable once submitted — this is set by the relevant authority, not by us. Our service fees are for the professional work we do on your behalf. Your itemised quote always separates these clearly so you know exactly what goes where.

:::

:::details How do I know I won't be overcharged?

Three reasons:

1. **The quote is itemised.** You see every line item before you pay anything — government fees, our fees, third-party costs. You can compare each line with publicly available information.
2. **The price is locked in writing.** Once you approve the quote, the total cannot increase without your separate written consent.
3. **We're a registered UAE provider.** Every engagement is delivered under a legal contract, governed by UAE law. We have skin in the game — our reputation depends on every quote being accurate.

:::

## Ready to Get a Detailed Quote?

Tell us what you need. Within 24–48 hours, you'll receive a fixed-price proposal with a full breakdown — and a clear, written guarantee that the price won't change.

[Get my detailed quote →](/resources/contacts) &nbsp; · &nbsp; [Talk to an expert](/chat)
