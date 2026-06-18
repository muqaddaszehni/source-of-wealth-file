import { useActiveDossier } from '../state/DossierContext'
import { CrestIcon } from './Icons'

export default function Masthead() {
  const client = useActiveDossier().profile
  return (
    <div className="bg-navy px-7 py-5 text-bone md:px-12 md:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CrestIcon className="h-7 w-7 text-brass" />
          <div className="leading-tight">
            <div className="font-serif text-[19px] tracking-wide text-bone">
              Maison Brevard
            </div>
            <div className="eyebrow text-brass/90 text-[9px]">
              Private Bank · Genève — Hong Kong
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="eyebrow text-brass/90 text-[9px]">Private &amp; Confidential</div>
          <div className="mt-1 font-sans text-[10.5px] tracking-wide2 text-bone/70">
            Ref. {client.fileRef}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-y-1 border-t border-white/10 pt-3 font-sans text-[10.5px] tracking-wide2 text-bone/60">
        <span className="uppercase tracking-label text-bone/45 text-[9.5px]">
          Source-of-Wealth File
        </span>
        <span>Compliance · Know-Your-Client Dossier</span>
      </div>
    </div>
  )
}
