import { disclaimerLine } from '../data/client'

export default function DisclaimerCallout() {
  return (
    <div className="flex items-start gap-4 border-l-2 border-brass bg-brass/[0.06] px-5 py-4">
      <span className="mt-[3px] font-serif text-[20px] italic leading-none text-brass">§</span>
      <div>
        <div className="eyebrow text-[9px]">Important — scope of this file</div>
        <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-charcoal/85">
          <span className="font-semibold text-navy">{disclaimerLine}</span>{' '}
          This dossier collates and pressure-tests declared sources of wealth to support the
          relationship manager and compliance function. It is not an audit, a legal opinion, or an
          approval, and must be read alongside the bank’s standard due-diligence procedures.
        </p>
      </div>
    </div>
  )
}
