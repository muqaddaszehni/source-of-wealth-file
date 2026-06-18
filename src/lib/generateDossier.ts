/* ------------------------------------------------------------------ *
 *  generateDossier — the KYC "accelerator"
 *  Turns raw onboarding inputs into a complete, pressure-tested Dossier:
 *  auto-written narratives, derived allocation & curve, a standard
 *  battery of cross-checks, a value-weighted completeness score, and
 *  prioritised red flags. All figures illustrative (USD millions).
 * ------------------------------------------------------------------ */

import type {
  Dossier,
  WealthEvent,
  VerificationCheck,
  RedFlag,
  Holding,
  CompletenessSlice,
  WealthPoint,
  ClientProfile,
  DocStatus,
  SupportingDoc,
  Priority,
} from '../data/client'
import { fmtM } from './format'

export type SourceCategory =
  | 'Business formation'
  | 'Liquidity event'
  | 'Inheritance'
  | 'Property gain'
  | 'Reinvestment'
  | 'Investment returns'

export const SOURCE_CATEGORIES: SourceCategory[] = [
  'Business formation',
  'Liquidity event',
  'Inheritance',
  'Property gain',
  'Reinvestment',
  'Investment returns',
]

export interface SourceInput {
  category: SourceCategory
  title: string
  period: string
  valueM: number
  basis: string
  counterparty?: string
  status: DocStatus
  docs: SupportingDoc[]
}

export interface ProfileInput {
  name: string
  romanisation?: string
  residence: string
  bookingCentre: string
  relationshipSince: string
  riskClassification: string
  reportingCurrency?: string
  relationshipManager?: string
}

export interface ScreeningInput {
  sanctionsPep: 'pass' | 'flag'
  adverseMedia: 'pass' | 'flag'
}

export interface OnboardingInput {
  id?: string
  profile: ProfileInput
  sources: SourceInput[]
  screening: ScreeningInput
}

/* ----------------------------- helpers ---------------------------- */

const r1 = (v: number) => Math.round(v * 10) / 10

const firstYear = (period: string): number => {
  const m = period.match(/\d{4}/)
  return m ? parseInt(m[0], 10) : 2000
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28) || 'client'

// Deterministic 4-digit file reference from the name (no Date/random).
const refNumber = (name: string): string => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return String((h % 9000) + 1000)
}

const statusTail = (status: DocStatus): string => {
  if (status === 'verified') return ' The source is supported by the documentation on file.'
  if (status === 'needs-verification')
    return ' Certain supporting records remain to be corroborated.'
  return ' Primary documentation for this item has not been located.'
}

function writeNarrative(s: SourceInput, profile: ProfileInput): string {
  const v = fmtM(s.valueM)
  const who = profile.name.replace(/^(Mr\.|Ms\.|Mrs\.|Madam|Dr\.)\s+/i, '')
  const basis = s.basis?.trim() ? ` ${s.basis.trim()}` : ''
  let lead = `In ${s.period} the client recorded ${s.title} of approximately ${v}.${basis}`
  switch (s.category) {
    case 'Business formation':
      lead = `In ${s.period} the client founded ${s.counterparty || s.title}, capitalised at approximately ${v}.${basis} The company became a principal engine of ${who}'s wealth.`
      break
    case 'Liquidity event':
      lead = `In ${s.period} the client realised approximately ${v} through ${s.title}${
        s.counterparty ? `, with ${s.counterparty} as counterparty` : ''
      }.${basis} The proceeds were received into the client's account with the bank.`
      break
    case 'Inheritance':
      lead = `In ${s.period} the client received an inheritance of approximately ${v}${
        s.counterparty ? ` from ${s.counterparty}` : ''
      }.${basis}`
      break
    case 'Property gain':
      lead = `The client attributes a property gain of approximately ${v} to ${s.title} (${s.period}).${basis}`
      break
    case 'Reinvestment':
      lead = `Between ${s.period} the client reinvested approximately ${v} into ${s.title}.${basis}`
      break
    case 'Investment returns':
      lead = `From ${s.period} the client's diversified portfolio generated approximately ${v} in cumulative returns through ${s.title}.${basis}`
      break
  }
  return lead + statusTail(s.status)
}

function makeEvents(sources: SourceInput[], profile: ProfileInput): WealthEvent[] {
  return [...sources]
    .sort((a, b) => firstYear(a.period) - firstYear(b.period))
    .map((s, i) => ({
      id: `${slugify(s.title)}-${i}`,
      period: s.period,
      title: s.title,
      category: s.category,
      valueM: s.valueM,
      valueLabel: fmtM(s.valueM),
      narrative: writeNarrative(s, profile),
      status: s.status,
      docs: s.docs,
      note:
        s.status === 'missing'
          ? 'No primary documentation located; the attributed value rests on the client’s declaration.'
          : s.status === 'needs-verification'
          ? 'Partially evidenced; corroborating records are outstanding.'
          : undefined,
    }))
}

const PALETTE = ['#0E1B2E', '#B0904F', '#4F6B53', '#7C8AA0', '#C2B79A']

function deriveHoldings(sources: SourceInput[]): Holding[] {
  const sum = (cats: SourceCategory[]) =>
    sources.filter((s) => cats.includes(s.category)).reduce((t, s) => t + s.valueM, 0)

  const realEstate = sum(['Property gain', 'Reinvestment'])
  const privateBiz = sum(['Business formation'])
  const liquid = sum(['Liquidity event', 'Investment returns', 'Inheritance'])

  const raw: { label: string; valueM: number }[] = [
    { label: 'Real estate', valueM: realEstate },
    { label: 'Listed securities & funds', valueM: liquid * 0.6 },
    { label: 'Fixed income', valueM: liquid * 0.25 },
    { label: 'Cash & equivalents', valueM: liquid * 0.15 },
    { label: 'Private business interests', valueM: privateBiz },
  ]

  return raw
    .filter((h) => h.valueM > 0.05)
    .sort((a, b) => b.valueM - a.valueM)
    .map((h, i) => ({ label: h.label, valueM: r1(h.valueM), color: PALETTE[i % PALETTE.length] }))
}

function buildCurve(events: WealthEvent[], totalM: number): WealthPoint[] {
  const sorted = [...events].sort((a, b) => firstYear(a.period) - firstYear(b.period))
  const pts: WealthPoint[] = []
  let cum = 0
  const seen = new Map<string, number>()
  for (const e of sorted) {
    cum += e.valueM ?? 0
    seen.set(String(firstYear(e.period)), r1(cum))
  }
  for (const [year, value] of seen) pts.push({ year, value })
  // Anchor a low starting point and a present-day endpoint for a fuller curve.
  if (pts.length) {
    const startYear = firstYear(sorted[0].period)
    pts.unshift({ year: String(startYear - 2), value: Math.max(1, r1((pts[0].value || 1) * 0.15)) })
    const lastYear = parseInt(pts[pts.length - 1].year, 10)
    if (lastYear < 2026) pts.push({ year: '2026', value: r1(totalM) })
  }
  return pts
}

const flagFor = (status: DocStatus) => (status === 'verified' ? 'pass' : 'flag') as 'pass' | 'flag'

function buildChecks(events: WealthEvent[], screening: ScreeningInput): VerificationCheck[] {
  const out: VerificationCheck[] = []
  for (const e of events) {
    const y = e.period
    switch (e.category) {
      case 'Business formation':
        out.push({
          label: `Company confirmed in public registry (${y})`,
          detail: `${e.title} located in the corporate registry; client recorded as founder.`,
          source: 'Corporate registry',
          status: flagFor(e.status),
        })
        break
      case 'Liquidity event':
        out.push({
          label: `Sale value corroborated (${y})`,
          detail: `Headline ${e.valueLabel} cross-checked against agreement, settlement and media.`,
          source: 'Agreement · settlement · press',
          status: flagFor(e.status),
        })
        break
      case 'Inheritance':
        out.push({
          label: `Probate & inheritance evidenced (${y})`,
          detail: 'Grant of probate and estate distribution reviewed.',
          source: 'Probate registry · solicitors',
          status: flagFor(e.status),
        })
        break
      case 'Property gain':
        out.push({
          label: `Property transaction documented (${y})`,
          detail: `${e.title}: purchase / sale records and title reviewed.`,
          source: 'Land registry · contracts',
          status: flagFor(e.status),
        })
        break
      case 'Reinvestment':
        out.push({
          label: `Asset title verified (${y})`,
          detail: `${e.title}: title deeds and acquisition documentation reviewed.`,
          source: 'Land registry · agreements',
          status: flagFor(e.status),
        })
        break
      case 'Investment returns':
        out.push({
          label: `Custody & performance statements on file (${y})`,
          detail: 'Portfolio flows reconciled to custody and performance reporting.',
          source: 'Custody statements',
          status: flagFor(e.status),
        })
        break
    }
  }
  out.push({
    label: 'Sanctions & PEP screening',
    detail:
      screening.sanctionsPep === 'pass'
        ? 'No sanctions, watch-list or PEP hits for client or close associates.'
        : 'Potential match requires manual adjudication.',
    source: 'World-Check · Dow Jones',
    status: screening.sanctionsPep,
  })
  out.push({
    label: 'Adverse-media screening',
    detail:
      screening.adverseMedia === 'pass'
        ? 'No negative news, litigation or enforcement matches.'
        : 'Adverse-media item flagged for review.',
    source: 'Factiva · World-Check',
    status: screening.adverseMedia,
  })
  return out
}

function computeCompleteness(events: WealthEvent[]): {
  score: number
  breakdown: CompletenessSlice[]
} {
  const weight: Record<DocStatus, number> = {
    verified: 1,
    'needs-verification': 0.5,
    missing: 0,
  }
  const total = events.reduce((t, e) => t + (e.valueM ?? 0), 0) || 1
  const part = (st: DocStatus) =>
    events.filter((e) => e.status === st).reduce((t, e) => t + (e.valueM ?? 0), 0)

  const verifiedPct = Math.round((part('verified') / total) * 100)
  const needsPct = Math.round((part('needs-verification') / total) * 100)
  const missingPct = Math.max(0, 100 - verifiedPct - needsPct)
  const score = Math.round(
    ((part('verified') * weight.verified + part('needs-verification') * weight['needs-verification']) /
      total) *
      100,
  )

  return {
    score,
    breakdown: [
      { label: 'Verified & corroborated', pct: verifiedPct, status: 'verified' },
      { label: 'Needs verification', pct: needsPct, status: 'needs-verification' },
      { label: 'Missing documentation', pct: missingPct, status: 'missing' },
    ],
  }
}

function buildRedFlags(events: WealthEvent[], checks: VerificationCheck[]): RedFlag[] {
  const flags: RedFlag[] = []
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

  for (const e of events) {
    if (e.status === 'missing') {
      flags.push({
        priority: 'high',
        title: `${e.title} undocumented`,
        detail: `Approximately ${e.valueLabel} is attributed to this ${e.period} item, for which no primary documentation exists in the file.`,
        action:
          'Obtain registry / bank records, or formally reclassify the value as undocumented and exclude it from the corroborated wealth base.',
      })
    } else if (e.status === 'needs-verification') {
      flags.push({
        priority: 'medium',
        title: `${e.title} partially corroborated`,
        detail: `The ${e.period} item (${e.valueLabel}) is asserted but supporting records remain outstanding.`,
        action: 'Request the outstanding documentation or a signed source-of-funds declaration.',
      })
    }
  }

  for (const c of checks) {
    if (c.status === 'flag' && /sanctions|adverse/i.test(c.label)) {
      flags.push({
        priority: 'high',
        title: `${c.label} — match to adjudicate`,
        detail: c.detail,
        action: 'Escalate to compliance for manual adjudication before account opening.',
      })
    }
  }

  return flags.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 6)
}

/* --------------------------- entry point -------------------------- */

export function generateDossier(input: OnboardingInput): Dossier {
  const { profile: p, sources, screening } = input
  const events = makeEvents(sources, p)
  const holdings = deriveHoldings(sources)
  const totalWealthM = r1(sources.reduce((t, s) => t + s.valueM, 0))
  const wealthCurve = buildCurve(events, totalWealthM)
  const checks = buildChecks(events, screening)
  const { score, breakdown } = computeCompleteness(events)
  const redFlags = buildRedFlags(events, checks)

  const biggest = [...sources].sort((a, b) => b.valueM - a.valueM)[0]
  const summary = biggest
    ? `${p.residence.split('(')[0].trim()} client. Principal wealth attributed to ${biggest.title.toLowerCase()} (${fmtM(
        biggest.valueM,
      )}); ${sources.length} declared source${sources.length === 1 ? '' : 's'} under review.`
    : undefined

  const profile: ClientProfile = {
    name: p.name,
    romanisation: p.romanisation || '',
    fileRef: `SOW-2026-${refNumber(p.name)} / Rev. 1`,
    bookingCentre: p.bookingCentre,
    relationshipSince: p.relationshipSince,
    riskClassification: p.riskClassification,
    reportingCurrency: p.reportingCurrency || 'USD',
    residence: p.residence,
    relationshipManager: p.relationshipManager || 'A. Védrine · Private Wealth, Asia',
    preparedOn: '17 June 2026',
    totalWealthM,
    completeness: score,
    summary,
  }

  return {
    id: input.id || `${slugify(p.name)}-${refNumber(p.name)}`,
    profile,
    events,
    checks,
    redFlags,
    holdings,
    wealthCurve,
    completenessBreakdown: breakdown,
  }
}
