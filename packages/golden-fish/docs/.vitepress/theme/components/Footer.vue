<script setup lang="ts">
import { withBase } from "vitepress"

// Opens the Usercentrics CMP "second layer" — same behaviour as the
// original `<a onClick="UC_UI.showSecondLayer()">` markup.
function openPrivacySettings(e: Event) {
  e.preventDefault()
  const uc = (window as unknown as { UC_UI?: { showSecondLayer?: () => void } }).UC_UI
  uc?.showSecondLayer?.()
}
</script>

<template>
  <footer class="gf-footer">
    <div class="gf-footer-inner">
      <div class="gf-footer-grid">
        <!-- Brand column -->
        <div class="gf-footer-brand">
          <a :href="withBase('/')" class="gf-footer-logo">
            <img :src="withBase('/img/Logo.avif')" alt="Golden Fish" class="gf-footer-logo-img" />
            <span>Golden Fish</span>
          </a>
          <p class="gf-footer-tagline">
            Start Your Business in the UAE — stress-free and legally guaranteed. Transparent prepayment, step-by-step guidance, and official contract.
          </p>
        </div>

        <!-- Services column -->
        <div class="gf-footer-col">
          <div class="gf-footer-heading">Services</div>
          <ul class="gf-footer-list">
            <li><a :href="withBase('/uae-business/offer/company-registration/')">Company Setup</a></li>
            <li><a :href="withBase('/uae-business/offer/banking/')">Banking</a></li>
            <li><a :href="withBase('/uae-business/offer/residency-visas/')">Residency &amp; Visas</a></li>
            <li><a :href="withBase('/uae-business/offer/legal-support/')">Legal &amp; Structuring</a></li>
            <!-- <li><a :href="withBase('/uae-business/offer/intellectual-property/')">Intellectual Property</a></li> -->
            <li><a :href="withBase('/uae-business/company-registration/Protect-Your-Business')">Tax &amp; Compliance</a></li>
          </ul>
        </div>

        <!-- Company column -->
        <div class="gf-footer-col">
          <div class="gf-footer-heading">Company</div>
          <ul class="gf-footer-list">
            <li><a :href="withBase('/uae-business/benefits/prepayment-model')">Prepayment Model</a></li>
            <li><a :href="withBase('/chat')">Ask Goldie</a></li>
            <li><a :href="withBase('/resources/contacts')">Contact Us</a></li>
          </ul>
        </div>

        <!-- Contact column -->
        <div class="gf-footer-col">
          <div class="gf-footer-heading">Get in touch</div>
          <ul class="gf-footer-contact">
            <li>
              <Icon icon="tabler:map-pin" />
              <span>Office 405-070, Port Saeed<br>Dubai, UAE</span>
            </li>
            <li>
              <Icon icon="tabler:mail" />
              <a href="mailto:info@goldenfish.ae">info@goldenfish.ae</a>
            </li>
            <li>
              <Icon icon="tabler:phone" />
              <a href="tel:+971585748806">+971 058 574 88 06</a>
            </li>
            <li>
              <Icon icon="tabler:brand-whatsapp" />
              <a href="https://wa.me/message/KDLD4FZVW7EUC1" target="_blank" rel="noopener">WhatsApp</a>
            </li>
            <li>
              <Icon icon="tabler:brand-linkedin" />
              <a href="https://www.linkedin.com/company/golden-fish-csp-llc/" target="_blank" rel="noopener">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Legal strip -->
      <div class="gf-footer-bottom">
        <div class="gf-footer-copyright">© Golden Fish Corporate Services Provider LLC, 2025</div>
        <ul class="gf-footer-legal">
          <li><a href="#" @click="openPrivacySettings">Privacy Settings</a></li>
          <li><a :href="withBase('/resources/TERMS-CONDITIONS')">Terms &amp; Conditions</a></li>
          <li><a :href="withBase('/resources/Privacy-Policy')">Privacy Policy</a></li>
          <li><a :href="withBase('/resources/Legal-Regulations-for-AI-Services')">AI Services Legal</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
