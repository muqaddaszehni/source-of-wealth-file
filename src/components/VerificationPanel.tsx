import { checks } from '../data/client'
import { CheckIcon, FlagIcon } from './Icons'

export default function VerificationPanel() {
  const passed = checks.filter((c) => c.status === 'pass').length
  const flagged = checks.length - passed

  return (
    <aside className="border border-hairline bg-paper">
      <div className="border-b border-hairline bg-navy px-5 py-4 text-bone">
        <div className="eyebrow text-brass/90 text-[9px]">Verification &amp; cross-checks</div>
        <div className="mt-2 flex items-baseline gap-3 font-sans text-[11px] tracking-wide2 text-bone/70">
          <span className="figure">
            <span className="text-bone">{passed}</span> passing
          </span>
          <span className="text-bone/30">·</span>
          <span className="figure">{flagged} flagged</span>
        </div>
      </div>

      <ul className="divide-y divide-hairline">
        {checks.map((c) => {
          const pass = c.status === 'pass'
          return (
            <li key={c.label} className="flex gap-3 px-5 py-3.5">
              <span
                className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  pass
                    ? 'border-sage/40 bg-sage/[0.1] text-sage'
                    : 'border-ochre/45 bg-ochre/[0.1] text-ochre'
                }`}
              >
                {pass ? <CheckIcon className="h-3 w-3" /> : <FlagIcon className="h-3 w-3" />}
              </span>
              <div className="min-w-0">
                <div className="font-sans text-[12.5px] font-medium leading-snug text-navy">
                  {c.label}
                </div>
                <div className="mt-1 font-sans text-[11.5px] leading-relaxed text-charcoal/70">
                  {c.detail}
                </div>
                <div className="mt-1.5 eyebrow-muted text-[8.5px] normal-case tracking-wide2">
                  <span className="uppercase tracking-label text-slatey">Source</span>{' '}
                  <span className="text-slatey/90">— {c.source}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
