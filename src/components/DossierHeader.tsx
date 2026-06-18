import { fmtM, fmtFull } from '../lib/format'
import { useActiveDossier } from '../state/DossierContext'
import CompletenessGauge from './CompletenessGauge'

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="eyebrow-muted text-[9px]">{label}</div>
      <div className="mt-1 font-sans text-[12.5px] leading-snug text-charcoal">{value}</div>
    </div>
  )
}

export default function DossierHeader() {
  const client = useActiveDossier().profile
  return (
    <section className="px-7 pt-9 md:px-12 md:pt-12">
      <div className="flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between">
        {/* Identity */}
        <div className="min-w-0">
          <div className="eyebrow">Client Dossier</div>
          <div className="mt-3 flex items-end gap-4">
            <h1 className="font-serif text-[52px] leading-[0.95] text-navy md:text-[64px]">
              {client.name}
            </h1>
            {client.romanisation && (
              <span className="hidden pb-2 font-serif text-[26px] text-brass md:inline">
                {client.romanisation}
              </span>
            )}
          </div>
          {client.summary && (
            <p className="mt-4 max-w-xl font-sans text-[13px] leading-relaxed text-charcoal/75">
              {client.summary}
            </p>
          )}
        </div>

        {/* Headline figures */}
        <div className="flex shrink-0 items-center gap-8 lg:flex-col lg:items-end lg:gap-6">
          <div className="lg:text-right">
            <div className="eyebrow-muted text-[9px]">Total documented wealth</div>
            <div className="mt-1 font-serif text-[40px] leading-none text-navy figure md:text-[46px]">
              {fmtM(client.totalWealthM)}
            </div>
            <div className="mt-1.5 font-sans text-[11px] tracking-wide2 text-slatey figure">
              {fmtFull(client.totalWealthM)} · as at {client.preparedOn}
            </div>
          </div>
          <CompletenessGauge value={client.completeness} />
        </div>
      </div>

      {/* Metadata strip */}
      <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-hairline py-5 sm:grid-cols-3 lg:grid-cols-6">
        <Meta label="File reference" value={client.fileRef} />
        <Meta label="Booking centre" value={client.bookingCentre} />
        <Meta label="Relationship since" value={client.relationshipSince} />
        <Meta label="Risk classification" value={client.riskClassification} />
        <Meta label="Reporting currency" value={client.reportingCurrency} />
        <Meta label="Relationship manager" value={client.relationshipManager} />
      </div>
    </section>
  )
}
