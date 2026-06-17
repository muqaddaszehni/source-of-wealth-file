import {
  client,
  events,
  checks,
  redFlags,
  holdings,
  disclaimerLine,
  type Priority,
} from '../data/client'
import { fmtM, fmtFull } from '../lib/format'
import StatusPill from './StatusPill'
import { CrestIcon, PrinterIcon, ArrowRight } from './Icons'

const prioLabel: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function SummaryView({ onClose }: { onClose: () => void }) {
  const passed = checks.filter((c) => c.status === 'pass').length
  const flagged = checks.length - passed
  const total = holdings.reduce((s, h) => s + h.valueM, 0)

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      {/* toolbar — never printed */}
      <div className="no-print mx-auto mb-5 flex max-w-[820px] items-center justify-between">
        <button
          onClick={onClose}
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-label text-navy transition-colors hover:text-brass"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to full dossier
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 border border-navy bg-navy px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-label text-bone transition-colors hover:bg-navy-soft"
        >
          <PrinterIcon className="h-3.5 w-3.5" />
          Print / Save as PDF
        </button>
      </div>

      {/* the one-page sheet */}
      <article className="print-sheet sheet mx-auto max-w-[820px] border border-hairline">
        {/* header */}
        <div className="flex items-start justify-between border-b border-hairline px-9 pt-8 pb-5">
          <div className="flex items-center gap-3">
            <CrestIcon className="h-7 w-7 text-brass" />
            <div>
              <div className="font-serif text-[18px] leading-none text-navy">Maison Brevard</div>
              <div className="eyebrow-muted mt-1 text-[8.5px]">
                Private Bank · Genève — Hong Kong
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="eyebrow text-[9px]">Private &amp; Confidential</div>
            <div className="mt-1 font-sans text-[10px] tracking-wide2 text-slatey">
              {client.fileRef}
            </div>
          </div>
        </div>

        <div className="px-9 py-7">
          <div className="eyebrow">Source-of-Wealth — Executive Summary</div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-[40px] leading-none text-navy">
                Mr. Chen Wai-Lun
              </h1>
              <p className="mt-2 font-sans text-[11.5px] tracking-wide2 text-slatey">
                {client.residence} · Relationship since {client.relationshipSince} ·{' '}
                {client.riskClassification}
              </p>
            </div>
            <div className="text-right">
              <div className="eyebrow-muted text-[8.5px]">Total documented wealth</div>
              <div className="font-serif text-[34px] leading-none text-navy figure">
                {fmtM(client.totalWealthM)}
              </div>
              <div className="mt-1 font-sans text-[10px] tracking-wide2 text-slatey figure">
                {fmtFull(client.totalWealthM)}
              </div>
            </div>
          </div>

          {/* key metrics strip */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-hairline border-y border-hairline">
            <div className="px-4 py-3">
              <div className="eyebrow-muted text-[8.5px]">Completeness</div>
              <div className="mt-1 font-serif text-[24px] leading-none text-brass figure">
                {client.completeness}%
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="eyebrow-muted text-[8.5px]">Cross-checks passing</div>
              <div className="mt-1 font-serif text-[24px] leading-none text-sage figure">
                {passed}/{checks.length}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="eyebrow-muted text-[8.5px]">Open red flags</div>
              <div className="mt-1 font-serif text-[24px] leading-none text-ochre figure">
                {redFlags.length}
              </div>
            </div>
          </div>

          {/* sources table */}
          <div className="mt-7 print-break-avoid">
            <div className="eyebrow-muted text-[9px]">Sources of wealth</div>
            <table className="mt-3 w-full border-collapse">
              <thead>
                <tr className="border-b border-hairline text-left">
                  <th className="py-2 pr-3 font-sans text-[9px] font-medium uppercase tracking-label text-slatey">
                    Period
                  </th>
                  <th className="py-2 pr-3 font-sans text-[9px] font-medium uppercase tracking-label text-slatey">
                    Source
                  </th>
                  <th className="py-2 pr-3 text-right font-sans text-[9px] font-medium uppercase tracking-label text-slatey">
                    Value
                  </th>
                  <th className="py-2 text-right font-sans text-[9px] font-medium uppercase tracking-label text-slatey">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-hairline/70 align-top">
                    <td className="py-2.5 pr-3 font-serif text-[13px] italic text-brass whitespace-nowrap">
                      {e.period}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-[12px] text-charcoal">
                      {e.title}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-sans text-[12px] text-navy figure whitespace-nowrap">
                      {e.valueM !== null ? fmtM(e.valueM) : '—'}
                    </td>
                    <td className="py-2.5 text-right">
                      <StatusPill status={e.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* two columns: allocation + flags */}
          <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 print-break-avoid">
            <div>
              <div className="eyebrow-muted text-[9px]">Current allocation</div>
              <ul className="mt-3 space-y-2">
                {holdings.map((h) => (
                  <li key={h.label} className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0"
                      style={{ background: h.color, borderRadius: 1 }}
                    />
                    <span className="flex-1 font-sans text-[11.5px] text-charcoal/85">
                      {h.label}
                    </span>
                    <span className="font-sans text-[11px] tracking-wide2 text-navy figure">
                      {((h.valueM / total) * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="eyebrow-muted text-[9px]">Priority gaps &amp; red flags</div>
              <ul className="mt-3 space-y-2.5">
                {redFlags.map((f) => (
                  <li key={f.title} className="flex gap-2.5">
                    <span className="mt-[2px] font-sans text-[8.5px] font-medium uppercase tracking-label text-ochre whitespace-nowrap">
                      {prioLabel[f.priority]}
                    </span>
                    <span className="font-sans text-[11.5px] leading-snug text-charcoal/85">
                      {f.title}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-sans text-[10.5px] leading-relaxed text-slatey">
                {flagged} of {checks.length} cross-checks require corroboration or further
                documentation.
              </p>
            </div>
          </div>

          {/* sign-off */}
          <div className="mt-8 grid grid-cols-2 gap-8 border-t border-hairline pt-5 print-break-avoid">
            <div>
              <div className="h-8 border-b border-hairline" />
              <div className="mt-1.5 eyebrow-muted text-[8.5px]">Prepared by — relationship manager</div>
              <div className="mt-1 font-sans text-[11px] text-charcoal">
                {client.relationshipManager}
              </div>
            </div>
            <div>
              <div className="h-8 border-b border-hairline" />
              <div className="mt-1.5 eyebrow-muted text-[8.5px]">Reviewed by — compliance</div>
              <div className="mt-1 font-sans text-[11px] text-slatey italic">Pending review</div>
            </div>
          </div>

          <p className="mt-6 border-t border-hairline pt-4 font-sans text-[10px] leading-relaxed text-slatey">
            <span className="font-semibold text-navy">{disclaimerLine}</span> This summary is
            decision-support for internal compliance use only and does not constitute approval.
            Prepared {client.preparedOn}. — Illustrative demo, fictional data.
          </p>
        </div>
      </article>
    </div>
  )
}
