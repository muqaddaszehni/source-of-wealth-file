import { useState } from 'react'
import Masthead from './components/Masthead'
import DossierHeader from './components/DossierHeader'
import DisclaimerCallout from './components/DisclaimerCallout'
import SectionHeader from './components/SectionHeader'
import WealthTimeline from './components/WealthTimeline'
import VerificationPanel from './components/VerificationPanel'
import WealthFlowDiagram from './components/WealthFlowDiagram'
import WealthCharts from './components/WealthCharts'
import GapsRedFlags from './components/GapsRedFlags'
import SummaryView from './components/SummaryView'
import OnboardingWizard from './components/OnboardingWizard'
import Footer from './components/Footer'
import { ArrowRight } from './components/Icons'
import { useActiveDossier, useRoster } from './state/DossierContext'
import type { Dossier } from './data/client'

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClientSwitcher({
  clients,
  activeId,
  onSelect,
}: {
  clients: Dossier[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <label className="inline-flex items-center gap-2.5">
      <span className="eyebrow-muted text-[9px]">Active client</span>
      <div className="relative">
        <select
          value={activeId}
          onChange={(e) => onSelect(e.target.value)}
          className="appearance-none border border-hairline bg-bone/50 py-2 pl-3 pr-9 font-sans text-[12px] text-navy outline-none transition-colors focus:border-brass"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.profile.name} — {c.profile.completeness}%
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slatey" />
      </div>
    </label>
  )
}

export default function App() {
  const [view, setView] = useState<'dossier' | 'summary' | 'onboard'>('dossier')
  const { clients, activeId, selectClient, addClient } = useRoster()
  const { events } = useActiveDossier()

  if (view === 'summary') {
    return <SummaryView onClose={() => setView('dossier')} />
  }

  if (view === 'onboard') {
    return (
      <OnboardingWizard
        onCancel={() => {
          setView('dossier')
          window.scrollTo({ top: 0 })
        }}
        onComplete={(d) => {
          addClient(d)
          setView('dossier')
          window.scrollTo({ top: 0 })
        }}
      />
    )
  }

  const generate = () => {
    setView('summary')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="relative z-10 min-h-screen px-3 py-5 md:px-8 md:py-10">
      <main className="sheet mx-auto max-w-[1240px] overflow-hidden border border-hairline">
        <Masthead />
        <DossierHeader />

        {/* top action row: client switcher + actions */}
        <div className="flex flex-col gap-3 px-7 pt-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <ClientSwitcher clients={clients} activeId={activeId} onSelect={selectClient} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setView('onboard')}
              className="group inline-flex items-center gap-2 border border-brass bg-brass/[0.08] px-4 py-2 font-sans text-[10.5px] font-medium uppercase tracking-label text-brass-deep transition-colors hover:bg-brass hover:text-navy"
            >
              Onboard new client
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={generate}
              className="group inline-flex items-center gap-2 border border-hairline bg-bone/50 px-4 py-2 font-sans text-[10.5px] font-medium uppercase tracking-label text-navy transition-colors hover:border-brass hover:text-brass-deep"
            >
              Generate one-page summary
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="space-y-16 px-7 pb-12 pt-8 md:px-12 md:pt-10">
          <DisclaimerCallout />

          {/* I — Wealth origin + verification rail */}
          <section className="reveal">
            <SectionHeader
              numeral="I"
              eyebrow="Where the wealth came from"
              title="Wealth Origin & Documentation"
              aside={`${events.length} declared source${events.length === 1 ? '' : 's'} · chronological`}
            />
            <div className="grid gap-10 lg:grid-cols-[1fr_336px]">
              <WealthTimeline />
              <div className="lg:sticky lg:top-6 lg:self-start">
                <VerificationPanel />
              </div>
            </div>
          </section>

          {/* II — Flow diagram */}
          <section className="reveal">
            <SectionHeader
              numeral="II"
              eyebrow="From source to present holdings"
              title="Flow of Wealth"
              aside="Pan & explore the lineage"
            />
            <WealthFlowDiagram />
          </section>

          {/* III — Composition */}
          <section className="reveal">
            <SectionHeader
              numeral="III"
              eyebrow="Accumulation, allocation & completeness"
              title="Composition & Completeness"
            />
            <WealthCharts />
          </section>

          {/* IV — Gaps & red flags */}
          <section className="reveal">
            <SectionHeader
              numeral="IV"
              eyebrow="What is missing or inconsistent"
              title="Gaps & Red Flags"
              aside="In priority order"
            />
            <GapsRedFlags />
          </section>

          {/* CTA band */}
          <section className="flex flex-col items-center justify-between gap-5 border border-hairline bg-navy px-7 py-8 text-bone sm:flex-row md:px-10">
            <div>
              <div className="eyebrow text-brass/90 text-[9px]">Output</div>
              <h3 className="mt-1.5 font-serif text-[26px] leading-tight text-bone">
                Generate the one-page compliance summary
              </h3>
              <p className="mt-1.5 max-w-md font-sans text-[12px] leading-relaxed text-bone/65">
                A printable executive sheet — sources, allocation, cross-checks and red flags —
                ready for the credit file or a four-eyes review.
              </p>
            </div>
            <button
              onClick={generate}
              className="group inline-flex shrink-0 items-center gap-2.5 border border-brass bg-brass px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-label text-navy transition-colors hover:bg-brass-deep hover:text-bone"
            >
              Generate summary
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  )
}
