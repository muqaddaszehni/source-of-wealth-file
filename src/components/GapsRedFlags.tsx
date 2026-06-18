import { type Priority } from '../data/client'
import { useActiveDossier } from '../state/DossierContext'

const prio: Record<Priority, { label: string; text: string; border: string; bg: string }> = {
  high: { label: 'High priority', text: 'text-ochre', border: 'border-ochre/50', bg: 'bg-ochre' },
  medium: { label: 'Medium', text: 'text-brass-deep', border: 'border-brass/50', bg: 'bg-brass' },
  low: { label: 'Low', text: 'text-slatey', border: 'border-slatey/45', bg: 'bg-slatey' },
}

export default function GapsRedFlags() {
  const { redFlags } = useActiveDossier()
  return (
    <div className="grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-3">
      {redFlags.map((f, i) => {
        const p = prio[f.priority]
        return (
          <article
            key={f.title}
            className="flex flex-col bg-paper p-6 reveal"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-label ${p.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${p.bg}`} />
                {p.label}
              </span>
              <span className="font-serif text-[28px] italic leading-none text-hairline">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="mt-4 font-serif text-[21px] leading-tight text-navy">{f.title}</h3>
            <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-charcoal/80">
              {f.detail}
            </p>

            <div className="mt-auto pt-5">
              <div className="eyebrow-muted text-[8.5px]">Recommended action</div>
              <p className="mt-1.5 border-l-2 border-hairline pl-3 font-sans text-[12px] leading-relaxed text-charcoal/75">
                {f.action}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
