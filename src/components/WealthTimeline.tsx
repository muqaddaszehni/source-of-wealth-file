import { type WealthEvent, type SupportingDoc } from '../data/client'
import { useActiveDossier } from '../state/DossierContext'
import StatusPill from './StatusPill'
import { DocIcon } from './Icons'

function docTone(doc: SupportingDoc) {
  const missing = /missing|refresh/i.test(doc.kind)
  return missing
    ? 'text-slatey/80 border-slatey/30 bg-slatey/[0.05]'
    : 'text-charcoal/80 border-hairline bg-bone/40'
}

function EventRow({ event, index }: { event: WealthEvent; index: number }) {
  const dotColor =
    event.status === 'verified'
      ? 'bg-sage'
      : event.status === 'needs-verification'
      ? 'bg-ochre'
      : 'bg-slatey'

  return (
    <article
      className="relative pl-8 reveal md:pl-10"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* rail + node */}
      <span className="absolute left-0 top-1 flex h-3 w-3 items-center justify-center">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} ring-4 ring-paper`} />
      </span>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <span className="eyebrow-muted">{event.category}</span>
          <h3 className="mt-1 font-serif text-[24px] leading-tight text-navy">
            {event.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="font-serif text-[15px] italic text-brass">{event.period}</div>
          {event.valueM !== null && (
            <div className="mt-0.5 font-sans text-[12px] tracking-wide2 text-charcoal figure">
              {event.valueLabel}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 max-w-2xl font-sans text-[13px] leading-[1.75] text-charcoal/85">
        {event.narrative}
      </p>

      {/* documentation row */}
      <div className="mt-4 border-t border-dashed border-hairline pt-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={event.status} />
          <span className="eyebrow-muted text-[9px]">Supporting documentation</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {event.docs.map((doc) => (
            <li
              key={doc.name}
              className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1 font-sans text-[11px] leading-none ${docTone(
                doc,
              )}`}
            >
              <DocIcon className="h-3 w-3 opacity-60" />
              <span>{doc.name}</span>
            </li>
          ))}
        </ul>
        {event.note && (
          <p className="mt-3 max-w-2xl border-l border-ochre/40 pl-3 font-sans text-[11.5px] italic leading-relaxed text-charcoal/65">
            {event.note}
          </p>
        )}
      </div>
    </article>
  )
}

export default function WealthTimeline() {
  const { events } = useActiveDossier()
  return (
    <div className="relative">
      {/* continuous rail */}
      <span className="absolute left-[5.5px] top-2 bottom-2 w-px bg-hairline md:left-[5.5px]" />
      <div className="flex flex-col gap-10">
        {events.map((event, i) => (
          <EventRow key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  )
}
