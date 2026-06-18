import { useMemo, useState, type ReactNode } from 'react'
import type { Dossier, DocStatus } from '../data/client'
import { disclaimerLine } from '../data/client'
import {
  generateDossier,
  SOURCE_CATEGORIES,
  type OnboardingInput,
  type ProfileInput,
  type SourceInput,
  type ScreeningInput,
} from '../lib/generateDossier'
import { fmtM } from '../lib/format'
import { CrestIcon, ArrowRight } from './Icons'

/* ---- shared field primitives ---- */

const inputCls =
  'w-full border border-hairline bg-bone/40 px-3 py-2 font-sans text-[13px] text-charcoal outline-none transition-colors focus:border-brass placeholder:text-slatey/60'

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow-muted text-[9px]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const STATUS_LABEL: Record<DocStatus, string> = {
  verified: 'Verified',
  'needs-verification': 'Needs verification',
  missing: 'Missing records',
}

const RISK_OPTIONS = [
  'Low — simplified due diligence',
  'Medium — standard due diligence',
  'High — enhanced due diligence',
]

/* ---- default example so a demo can click straight through ---- */

const defaultProfile: ProfileInput = {
  name: 'Ms. Priya Anand',
  romanisation: '',
  residence: 'India (resident); United Kingdom domicile',
  bookingCentre: 'Singapore',
  relationshipSince: '2026',
  riskClassification: 'Medium — standard due diligence',
  reportingCurrency: 'USD',
  relationshipManager: 'L. Chevalier · Private Wealth, Asia',
}

const defaultSources: SourceInput[] = [
  {
    category: 'Business formation',
    title: 'Founded Anand Digital Labs',
    period: '2007',
    valueM: 2.5,
    basis: 'Bootstrapped with personal savings and retained earnings.',
    counterparty: 'Anand Digital Labs Pvt Ltd',
    status: 'verified',
    docs: [
      { name: 'Certificate of Incorporation', kind: 'Registry' },
      { name: 'Founding shareholders’ agreement', kind: 'Agreement' },
    ],
  },
  {
    category: 'Liquidity event',
    title: 'Trade sale to strategic acquirer',
    period: '2021',
    valueM: 140.0,
    basis: 'Sale of the company to a global software group.',
    counterparty: 'Helios Software Group',
    status: 'verified',
    docs: [
      { name: 'Share purchase agreement', kind: 'Agreement' },
      { name: 'Completion statement & funds flow', kind: 'Statement' },
      { name: 'Press coverage', kind: 'Media' },
    ],
  },
  {
    category: 'Investment returns',
    title: 'Discretionary portfolio',
    period: '2021 – 2026',
    valueM: 52.0,
    basis: 'Diversified equities, funds and fixed income held with the bank.',
    counterparty: '',
    status: 'needs-verification',
    docs: [
      { name: 'Discretionary mandate & IMA', kind: 'Agreement' },
      { name: 'Custody statements', kind: 'Statement' },
    ],
  },
]

const STEPS = ['Identity', 'Wealth sources', 'Documents & checks', 'Review'] as const
const NUMERALS = ['I', 'II', 'III', 'IV']

export default function OnboardingWizard({
  onCancel,
  onComplete,
}: {
  onCancel: () => void
  onComplete: (d: Dossier) => void
}) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<ProfileInput>(defaultProfile)
  const [sources, setSources] = useState<SourceInput[]>(defaultSources)
  const [screening, setScreening] = useState<ScreeningInput>({
    sanctionsPep: 'pass',
    adverseMedia: 'pass',
  })

  const setP = (k: keyof ProfileInput, v: string) => setProfile((p) => ({ ...p, [k]: v }))
  const setS = (i: number, patch: Partial<SourceInput>) =>
    setSources((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  const addSource = () =>
    setSources((arr) => [
      ...arr,
      {
        category: 'Liquidity event',
        title: '',
        period: '',
        valueM: 0,
        basis: '',
        counterparty: '',
        status: 'needs-verification',
        docs: [],
      },
    ])
  const removeSource = (i: number) => setSources((arr) => arr.filter((_, j) => j !== i))
  const addDoc = (i: number) =>
    setS(i, { docs: [...sources[i].docs, { name: '', kind: 'Document' }] })
  const setDoc = (i: number, j: number, patch: Partial<{ name: string; kind: string }>) =>
    setS(i, { docs: sources[i].docs.map((d, k) => (k === j ? { ...d, ...patch } : d)) })
  const removeDoc = (i: number, j: number) =>
    setS(i, { docs: sources[i].docs.filter((_, k) => k !== j) })

  const validSources = sources.filter((s) => s.title.trim() && s.valueM > 0)
  const canGenerate = profile.name.trim().length > 0 && validSources.length > 0

  const input: OnboardingInput = useMemo(
    () => ({ profile, sources: validSources, screening }),
    [profile, validSources, screening],
  )
  const preview = useMemo(
    () => (canGenerate ? generateDossier(input) : null),
    [input, canGenerate],
  )

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <div className="relative z-10 min-h-screen px-3 py-5 md:px-8 md:py-10">
      <div className="sheet mx-auto max-w-[900px] overflow-hidden border border-hairline">
        {/* header */}
        <div className="flex items-center justify-between bg-navy px-7 py-5 text-bone md:px-10">
          <div className="flex items-center gap-3">
            <CrestIcon className="h-6 w-6 text-brass" />
            <div>
              <div className="eyebrow text-brass/90 text-[9px]">Client Onboarding</div>
              <div className="font-serif text-[20px] leading-tight text-bone">
                Onboard a new client
              </div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="font-sans text-[10.5px] font-medium uppercase tracking-label text-bone/70 transition-colors hover:text-bone"
          >
            Cancel
          </button>
        </div>

        {/* step rail */}
        <div className="grid grid-cols-4 border-b border-hairline">
          {STEPS.map((label, i) => {
            const state = i === step ? 'active' : i < step ? 'done' : 'todo'
            return (
              <button
                key={label}
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2.5 border-r border-hairline px-4 py-3 text-left last:border-r-0 ${
                  i < step ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-serif text-[12px] ${
                    state === 'active'
                      ? 'border-brass bg-brass text-navy'
                      : state === 'done'
                      ? 'border-sage/50 bg-sage/10 text-sage'
                      : 'border-hairline text-slatey'
                  }`}
                >
                  {NUMERALS[i]}
                </span>
                <span
                  className={`font-sans text-[11px] tracking-wide2 ${
                    state === 'todo' ? 'text-slatey' : 'text-navy'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        {/* body */}
        <div className="px-7 py-8 md:px-10">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Client name (with honorific)" className="sm:col-span-2">
                <input
                  className={inputCls}
                  value={profile.name}
                  onChange={(e) => setP('name', e.target.value)}
                  placeholder="e.g. Ms. Priya Anand"
                />
              </Field>
              <Field label="Name in local script (optional)">
                <input
                  className={inputCls}
                  value={profile.romanisation}
                  onChange={(e) => setP('romanisation', e.target.value)}
                  placeholder="e.g. 陳偉倫"
                />
              </Field>
              <Field label="Residence / domicile">
                <input
                  className={inputCls}
                  value={profile.residence}
                  onChange={(e) => setP('residence', e.target.value)}
                />
              </Field>
              <Field label="Booking centre">
                <input
                  className={inputCls}
                  value={profile.bookingCentre}
                  onChange={(e) => setP('bookingCentre', e.target.value)}
                />
              </Field>
              <Field label="Relationship since">
                <input
                  className={inputCls}
                  value={profile.relationshipSince}
                  onChange={(e) => setP('relationshipSince', e.target.value)}
                />
              </Field>
              <Field label="Risk classification">
                <select
                  className={inputCls}
                  value={profile.riskClassification}
                  onChange={(e) => setP('riskClassification', e.target.value)}
                >
                  {RISK_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Relationship manager">
                <input
                  className={inputCls}
                  value={profile.relationshipManager}
                  onChange={(e) => setP('relationshipManager', e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <p className="font-sans text-[12.5px] leading-relaxed text-charcoal/70">
                Declare each source of wealth. The tool auto-writes the narrative, computes the
                allocation and completeness score, and runs cross-checks from what you enter.
              </p>
              {sources.map((s, i) => (
                <div key={i} className="border border-hairline bg-paper p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="eyebrow text-[9px]">Source {i + 1}</span>
                    {sources.length > 1 && (
                      <button
                        onClick={() => removeSource(i)}
                        className="font-sans text-[10px] uppercase tracking-label text-slatey hover:text-ochre"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Category">
                      <select
                        className={inputCls}
                        value={s.category}
                        onChange={(e) => setS(i, { category: e.target.value as SourceInput['category'] })}
                      >
                        {SOURCE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Documentation status">
                      <select
                        className={inputCls}
                        value={s.status}
                        onChange={(e) => setS(i, { status: e.target.value as DocStatus })}
                      >
                        {(Object.keys(STATUS_LABEL) as DocStatus[]).map((k) => (
                          <option key={k} value={k}>
                            {STATUS_LABEL[k]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Title / description" className="sm:col-span-2">
                      <input
                        className={inputCls}
                        value={s.title}
                        onChange={(e) => setS(i, { title: e.target.value })}
                        placeholder="e.g. Sale of majority stake"
                      />
                    </Field>
                    <Field label="Period">
                      <input
                        className={inputCls}
                        value={s.period}
                        onChange={(e) => setS(i, { period: e.target.value })}
                        placeholder="e.g. 2014 or 2015 – 2019"
                      />
                    </Field>
                    <Field label="Value (US$ millions)">
                      <input
                        type="number"
                        className={inputCls}
                        value={s.valueM || ''}
                        onChange={(e) => setS(i, { valueM: Number(e.target.value) || 0 })}
                        placeholder="e.g. 182"
                      />
                    </Field>
                    <Field label="Counterparty / entity (optional)" className="sm:col-span-2">
                      <input
                        className={inputCls}
                        value={s.counterparty}
                        onChange={(e) => setS(i, { counterparty: e.target.value })}
                        placeholder="e.g. Orient Global Freight Holdings"
                      />
                    </Field>
                    <Field label="Basis / how the funds arose" className="sm:col-span-2">
                      <textarea
                        className={`${inputCls} min-h-[64px] resize-y`}
                        value={s.basis}
                        onChange={(e) => setS(i, { basis: e.target.value })}
                        placeholder="A sentence the tool weaves into the source-of-wealth narrative."
                      />
                    </Field>
                  </div>
                </div>
              ))}
              <button
                onClick={addSource}
                className="inline-flex items-center gap-2 border border-hairline bg-bone/40 px-4 py-2 font-sans text-[10.5px] font-medium uppercase tracking-label text-navy transition-colors hover:border-brass hover:text-brass-deep"
              >
                + Add another source
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="font-sans text-[12.5px] leading-relaxed text-charcoal/70">
                Attach supporting documents to each source, and record the screening outcomes.
              </p>
              {sources.map((s, i) => (
                <div key={i} className="border border-hairline bg-paper p-5">
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <span className="font-serif text-[17px] text-navy">
                      {s.title || `Source ${i + 1}`}
                    </span>
                    <span className="eyebrow-muted text-[9px]">{STATUS_LABEL[s.status]}</span>
                  </div>
                  <div className="space-y-2">
                    {s.docs.map((d, j) => (
                      <div key={j} className="flex gap-2">
                        <input
                          className={`${inputCls} flex-1`}
                          value={d.name}
                          onChange={(e) => setDoc(i, j, { name: e.target.value })}
                          placeholder="Document name"
                        />
                        <input
                          className={`${inputCls} w-32`}
                          value={d.kind}
                          onChange={(e) => setDoc(i, j, { kind: e.target.value })}
                          placeholder="Kind"
                        />
                        <button
                          onClick={() => removeDoc(i, j)}
                          className="px-2 font-sans text-[16px] leading-none text-slatey hover:text-ochre"
                          aria-label="Remove document"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addDoc(i)}
                    className="mt-3 font-sans text-[10px] font-medium uppercase tracking-label text-navy hover:text-brass-deep"
                  >
                    + Add document
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 gap-4 border-t border-hairline pt-5 sm:grid-cols-2">
                <ScreenToggle
                  label="Sanctions & PEP screening"
                  value={screening.sanctionsPep}
                  onChange={(v) => setScreening((s) => ({ ...s, sanctionsPep: v }))}
                />
                <ScreenToggle
                  label="Adverse-media screening"
                  value={screening.adverseMedia}
                  onChange={(v) => setScreening((s) => ({ ...s, adverseMedia: v }))}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {preview ? (
                <ReviewPanel dossier={preview} sourceCount={validSources.length} />
              ) : (
                <p className="font-sans text-[13px] text-ochre">
                  Add a client name and at least one source with a value before generating.
                </p>
              )}
            </div>
          )}
        </div>

        {/* footer nav */}
        <div className="flex items-center justify-between gap-4 border-t border-hairline px-7 py-5 md:px-10">
          <button
            onClick={step === 0 ? onCancel : back}
            className="inline-flex items-center gap-2 font-sans text-[10.5px] font-medium uppercase tracking-label text-slatey transition-colors hover:text-navy"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          <span className="font-sans text-[10px] tracking-wide2 text-slatey">
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="group inline-flex items-center gap-2 border border-navy bg-navy px-5 py-2.5 font-sans text-[10.5px] font-medium uppercase tracking-label text-bone transition-colors hover:bg-navy-soft"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              disabled={!preview}
              onClick={() => preview && onComplete(preview)}
              className="group inline-flex items-center gap-2.5 border border-brass bg-brass px-6 py-2.5 font-sans text-[10.5px] font-medium uppercase tracking-label text-navy transition-colors hover:bg-brass-deep hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate dossier
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <p className="border-t border-hairline px-7 py-3 text-center font-sans text-[10px] italic tracking-wide2 text-slatey/80 md:px-10">
          {disclaimerLine} · Illustrative demo — fictional data
        </p>
      </div>
    </div>
  )
}

/* ---- screening toggle ---- */

function ScreenToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: 'pass' | 'flag'
  onChange: (v: 'pass' | 'flag') => void
}) {
  return (
    <div>
      <div className="eyebrow-muted text-[9px]">{label}</div>
      <div className="mt-1.5 inline-flex overflow-hidden rounded-[2px] border border-hairline">
        {(['pass', 'flag'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-1.5 font-sans text-[10.5px] font-medium uppercase tracking-wide2 transition-colors ${
              value === opt
                ? opt === 'pass'
                  ? 'bg-sage/15 text-sage'
                  : 'bg-ochre/15 text-ochre'
                : 'bg-bone/40 text-slatey hover:text-navy'
            }`}
          >
            {opt === 'pass' ? 'Clear' : 'Flag'}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---- review preview ---- */

function ReviewPanel({ dossier, sourceCount }: { dossier: Dossier; sourceCount: number }) {
  const total = dossier.holdings.reduce((s, h) => s + h.valueM, 0)
  const passing = dossier.checks.filter((c) => c.status === 'pass').length
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-[9px]">Generated dossier — preview</div>
          <h3 className="mt-1 font-serif text-[28px] leading-tight text-navy">
            {dossier.profile.name}
          </h3>
        </div>
        <div className="text-right">
          <div className="eyebrow-muted text-[8.5px]">Total documented wealth</div>
          <div className="font-serif text-[30px] leading-none text-navy figure">
            {fmtM(dossier.profile.totalWealthM)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 divide-x divide-hairline border-y border-hairline sm:grid-cols-4">
        <Metric label="Completeness" value={`${dossier.profile.completeness}%`} tone="brass" />
        <Metric label="Sources" value={String(sourceCount)} tone="navy" />
        <Metric label="Checks passing" value={`${passing}/${dossier.checks.length}`} tone="sage" />
        <Metric label="Red flags" value={String(dossier.redFlags.length)} tone="ochre" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="eyebrow-muted text-[9px]">Derived allocation</div>
          <ul className="mt-3 space-y-2">
            {dossier.holdings.map((h) => (
              <li key={h.label} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{ background: h.color, borderRadius: 1 }}
                />
                <span className="flex-1 font-sans text-[12px] text-charcoal/85">{h.label}</span>
                <span className="font-sans text-[11.5px] tracking-wide2 text-navy figure">
                  {((h.valueM / total) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow-muted text-[9px]">Auto-written narrative — first source</div>
          <p className="mt-3 border-l border-hairline pl-3 font-sans text-[12px] italic leading-relaxed text-charcoal/75">
            {dossier.events[0]?.narrative}
          </p>
        </div>
      </div>

      <p className="mt-6 font-sans text-[12px] leading-relaxed text-charcoal/70">
        Generating opens the full dossier — timeline, verification cross-checks, flow diagram,
        charts and gaps — and saves this client to your roster.
      </p>
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'brass' | 'navy' | 'sage' | 'ochre'
}) {
  const color =
    tone === 'brass'
      ? 'text-brass'
      : tone === 'sage'
      ? 'text-sage'
      : tone === 'ochre'
      ? 'text-ochre'
      : 'text-navy'
  return (
    <div className="px-4 py-3">
      <div className="eyebrow-muted text-[8.5px]">{label}</div>
      <div className={`mt-1 font-serif text-[24px] leading-none figure ${color}`}>{value}</div>
    </div>
  )
}
