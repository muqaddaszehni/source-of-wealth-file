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
import Footer from './components/Footer'
import { ArrowRight } from './components/Icons'

export default function App() {
  const [view, setView] = useState<'dossier' | 'summary'>('dossier')

  if (view === 'summary') {
    return <SummaryView onClose={() => setView('dossier')} />
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

        {/* top action */}
        <div className="flex justify-end px-7 pt-6 md:px-12">
          <button
            onClick={generate}
            className="group inline-flex items-center gap-2 border border-hairline bg-bone/50 px-4 py-2 font-sans text-[10.5px] font-medium uppercase tracking-label text-navy transition-colors hover:border-brass hover:text-brass-deep"
          >
            Generate one-page summary
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="space-y-16 px-7 pb-12 pt-8 md:px-12 md:pt-10">
          <DisclaimerCallout />

          {/* I — Wealth origin + verification rail */}
          <section className="reveal">
            <SectionHeader
              numeral="I"
              eyebrow="Where the wealth came from"
              title="Wealth Origin & Documentation"
              aside="Six declared sources · chronological"
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
