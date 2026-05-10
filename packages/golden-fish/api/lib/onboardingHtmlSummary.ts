/**
 * Builds the HTML summary that gets attached as a Note to the new Lead in
 * Pipedrive (per pipedrive_integration_spec.md §4.3). Optimised for fast
 * scanning by a manager opening the lead — table layout for paired
 * label/value rows, clear separators between user answers and metadata,
 * any "Other" clarifications visually nested under their parent question.
 */

import type { OnboardingPayload } from "../types/onboardingTypes.js"

function escapeHtml(s: string | null | undefined): string {
  if (!s) return ""
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function fmtDate(iso: string): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC")
  } catch {
    return iso
  }
}

interface Row {
  label: string
  value: string | null | undefined
  /** Optional clarification shown italic-indented under the row. */
  detail?: string | null
}

function renderRow({ label, value, detail }: Row): string {
  if (!value) return ""
  const detailLine = detail
    ? `<div style="margin-top: 2px; font-style: italic; color: #6B7889; font-size: 13px;">↳ ${escapeHtml(detail)}</div>`
    : ""
  return `<tr>
  <td style="padding: 6px 12px 6px 0; vertical-align: top; color: #6B7889; font-size: 13px; white-space: nowrap; width: 1%;">${escapeHtml(label)}</td>
  <td style="padding: 6px 0; vertical-align: top; color: #1A2540; font-size: 14px;">${escapeHtml(value)}${detailLine}</td>
</tr>`
}

export function buildOnboardingNote(payload: OnboardingPayload): string {
  const { step1, step2, step3, step4, step5, step6, step7, step8, step9, contact, notes, meta } = payload

  const isOtherApplicant = step1.value === 4
  const isOtherActivity = step4.category === 8

  const utmParts = [meta.utm_source, meta.utm_medium, meta.utm_campaign].filter(Boolean).join(" / ")
  const utmLine = utmParts ? `UTM: ${utmParts}` : "UTM: direct"

  const rows: Row[] = [
    { label: "Applicant", value: step1.label, detail: isOtherApplicant ? step1.other_text : null },
    { label: "Goal", value: step2.label },
    { label: "Licence", value: step3.label },
    { label: "Activity", value: step4.category_label, detail: isOtherActivity ? step4.description : null },
    { label: "Structure", value: step5.label },
    { label: "Residency", value: step6.label },
    { label: "Bank a/c", value: step7.label },
    { label: "In UAE", value: step8.label },
    { label: "Timeline", value: step9.label },
  ]

  const tableRows = rows.map(renderRow).filter((s) => s.length > 0).join("\n")

  const commentBlock =
    notes && notes.trim().length > 0
      ? `<p style="margin: 16px 0 0; font-size: 13px; color: #6B7889;"><b>Client comment</b></p>
<p style="margin: 4px 0 0; padding: 10px 12px; background: #F8F4EC; border-left: 3px solid #B8862E; font-size: 14px; color: #1A2540; white-space: pre-wrap;">${escapeHtml(notes.trim())}</p>`
      : ""

  return `<h3 style="margin: 0 0 12px; font-size: 16px; color: #1A2540;">Onboarding form summary</h3>
<table cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; max-width: 540px;">
${tableRows}
</table>
${commentBlock}
<hr style="margin: 20px 0 12px; border: 0; border-top: 1px solid rgba(26, 37, 64, 0.12);">
<p style="margin: 0; font-size: 13px; color: #1A2540;">
  <b>Contact:</b> ${escapeHtml(contact.name)} · ${escapeHtml(contact.email)} · ${escapeHtml(contact.phone_e164)}
</p>
<p style="margin: 8px 0 0; font-size: 12px; color: #6B7889; font-style: italic;">
  Submitted ${fmtDate(meta.submitted_at)}${meta.source_url ? ` from ${escapeHtml(meta.source_url)}` : ""} · ${escapeHtml(utmLine)}
</p>`
}
