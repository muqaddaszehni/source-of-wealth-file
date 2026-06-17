import { client, disclaimerLine } from '../data/client'

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-hairline px-7 py-8 md:px-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <div className="eyebrow text-[9px]">Disclaimer</div>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-charcoal/65">
            <span className="font-medium text-navy">{disclaimerLine}</span> Prepared by{' '}
            {client.relationshipManager} for internal compliance use. Findings are indicative and
            subject to the bank’s full due-diligence process and four-eyes review.
          </p>
        </div>
        <div className="sm:text-right">
          <div className="font-serif text-[15px] text-navy">Maison Brevard</div>
          <div className="mt-1 font-sans text-[10.5px] tracking-wide2 text-slatey">
            Private Bank · Genève — Hong Kong
          </div>
          <div className="mt-1 font-sans text-[10.5px] tracking-wide2 text-slatey">
            {client.fileRef} · {client.preparedOn}
          </div>
        </div>
      </div>
      <div className="mt-7 border-t border-hairline pt-4 text-center">
        <span className="font-sans text-[10.5px] italic tracking-wide2 text-slatey/80">
          Illustrative demo — fictional data
        </span>
      </div>
    </footer>
  )
}
