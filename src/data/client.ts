/* ------------------------------------------------------------------ *
 *  Source-of-Wealth File — sample dossier
 *  Fictional client: Mr. Chen Wai-Lun
 *  All figures are illustrative and expressed in USD millions.
 * ------------------------------------------------------------------ */

export type DocStatus = 'verified' | 'needs-verification' | 'missing'
export type CheckStatus = 'pass' | 'flag'
export type Priority = 'high' | 'medium' | 'low'

export interface SupportingDoc {
  name: string
  kind: string // short tag, e.g. 'Registry', 'Agreement', 'Statement'
}

export interface WealthEvent {
  id: string
  period: string // '1992' or '2015 – 2019'
  title: string
  category: string // small-caps tag
  valueM: number | null
  valueLabel: string // pre-formatted, e.g. 'US$ 182.0M (gross)'
  narrative: string
  status: DocStatus
  docs: SupportingDoc[]
  note?: string // optional footnote for flagged items
}

export interface VerificationCheck {
  label: string
  detail: string
  source: string
  status: CheckStatus
}

export interface RedFlag {
  priority: Priority
  title: string
  detail: string
  action: string
}

export interface Holding {
  label: string
  valueM: number
  color: string
}

export interface CompletenessSlice {
  label: string
  pct: number
  status: DocStatus
}

export interface ClientProfile {
  name: string
  romanisation: string
  fileRef: string
  bookingCentre: string
  relationshipSince: string
  riskClassification: string
  reportingCurrency: string
  residence: string
  relationshipManager: string
  preparedOn: string
  totalWealthM: number
  completeness: number
}

/* ---------------------------- Profile ---------------------------- */

export const client: ClientProfile = {
  name: 'Chen Wai-Lun',
  romanisation: '陳偉倫',
  fileRef: 'SOW-2026-0417 / Rev. 3',
  bookingCentre: 'Hong Kong SAR',
  relationshipSince: '2014',
  riskClassification: 'High — enhanced due diligence',
  reportingCurrency: 'USD',
  residence: 'Hong Kong SAR (permanent resident)',
  relationshipManager: 'A. Védrine · Private Wealth, Asia',
  preparedOn: '17 June 2026',
  totalWealthM: 312.4,
  completeness: 78,
}

/* ------------------------- Wealth origin ------------------------- */

export const events: WealthEvent[] = [
  {
    id: 'founding-1992',
    period: '1992',
    title: 'Founded Pacific Meridian Logistics Ltd.',
    category: 'Business formation',
    valueM: 0.6,
    valueLabel: 'Seed capital US$ 0.6M',
    narrative:
      'In April 1992 the client incorporated Pacific Meridian Logistics Ltd. in Hong Kong, a freight-forwarding and bonded-warehousing operator serving the Pearl River Delta manufacturing corridor. Initial capitalisation of approximately US$ 0.6M was stated to derive from personal savings accumulated during eight years as a shipping-line operations manager, supplemented by an interest-free family loan of HK$ 2.0M. The company became the principal engine of the client’s wealth over the following two decades.',
    status: 'needs-verification',
    note: 'Personal-savings component is supported by employment history; the HK$ 2.0M family loan is asserted but the loan instrument has not been produced.',
    docs: [
      { name: 'Certificate of Incorporation (Companies Registry)', kind: 'Registry' },
      { name: 'Business Registration Certificate', kind: 'Registry' },
      { name: 'Founding shareholders’ agreement (1992)', kind: 'Agreement' },
      { name: 'Family loan instrument', kind: 'Missing' },
    ],
  },
  {
    id: 'kowloon-2003',
    period: '2003',
    title: 'Kowloon residential property gain',
    category: 'Property gain',
    valueM: 8.0,
    valueLabel: 'US$ 8.0M (attributed)',
    narrative:
      'The client reports acquiring a residential unit in Ho Man Tin, Kowloon during the 2003 SARS-period market trough and disposing of it in 2011 for a stated gain of approximately US$ 8.0M, the proceeds of which were folded into the business and later into the investment portfolio. Contemporaneous purchase and sale contracts, completion statements and bank records for this transaction have not been located in the relationship file.',
    status: 'missing',
    note: 'No primary documentation located. The US$ 8.0M attribution rests solely on the client’s declaration and cannot presently be corroborated.',
    docs: [
      { name: 'Sale & purchase agreements (2003 / 2011)', kind: 'Missing' },
      { name: 'Land Registry memorial', kind: 'Missing' },
      { name: 'Completion / settlement statements', kind: 'Missing' },
    ],
  },
  {
    id: 'inheritance-2008',
    period: '2008',
    title: 'Inheritance — paternal estate',
    category: 'Inheritance',
    valueM: 12.0,
    valueLabel: 'US$ 12.0M',
    narrative:
      'On the death of his father, Mr. Chen Kwok-Keung, in 2008 the client received a distribution of approximately US$ 12.0M, comprising listed Hong Kong equities, a commercial unit in Sheung Wan and cash deposits. The estate was administered through grant of probate and the distribution is fully evidenced by the executing solicitors.',
    status: 'verified',
    docs: [
      { name: 'Grant of probate (HK Probate Registry)', kind: 'Registry' },
      { name: 'Estate distribution statement', kind: 'Statement' },
      { name: 'Solicitors’ confirmation letter (Wong & Tse)', kind: 'Letter' },
      { name: 'Transfer records — inherited securities', kind: 'Statement' },
    ],
  },
  {
    id: 'sale-2014',
    period: '2014',
    title: 'Sale of 68% majority stake',
    category: 'Liquidity event',
    valueM: 182.0,
    valueLabel: 'US$ 182.0M gross · US$ 168.0M net',
    narrative:
      'In November 2014 the client sold a 68% controlling interest in Pacific Meridian Logistics Ltd. to Orient Global Freight Holdings, a strategic regional acquirer, for a headline consideration of US$ 182.0M. Net proceeds of approximately US$ 168.0M (after advisory fees, stamp duty and an escrowed warranty retention) were received into the client’s account with the bank. The transaction is the dominant source of the client’s present liquid wealth and is comprehensively documented.',
    status: 'verified',
    docs: [
      { name: 'Share purchase agreement (executed)', kind: 'Agreement' },
      { name: 'Completion statement & funds flow', kind: 'Statement' },
      { name: 'Board & shareholder resolutions', kind: 'Resolution' },
      { name: 'Incoming wire confirmation — US$ 168.0M', kind: 'Bank' },
      { name: 'Press release & SCMP / Reuters coverage', kind: 'Media' },
    ],
  },
  {
    id: 'realestate-2015',
    period: '2015 – 2019',
    title: 'Real-estate reinvestment — Hong Kong & Singapore',
    category: 'Reinvestment',
    valueM: 96.0,
    valueLabel: 'US$ 96.0M deployed · US$ 138.0M current',
    narrative:
      'Between 2015 and 2019 the client deployed roughly US$ 96.0M of sale proceeds into direct real estate: two residential properties on Hong Kong Island, a Central commercial floor held through a wholly-owned BVI company, and a Singapore residential property at Orchard Boulevard. The current aggregate valuation is approximately US$ 138.0M. Title and acquisition documentation is complete; one Singapore valuation requires independent refresh.',
    status: 'needs-verification',
    note: 'The Orchard Boulevard valuation relies on a single 2021 broker estimate; an independent valuation is recommended to corroborate the current US$ 138.0M aggregate.',
    docs: [
      { name: 'Title deeds & Land Registry records (HK)', kind: 'Registry' },
      { name: 'Sale & purchase agreements (4 properties)', kind: 'Agreement' },
      { name: 'BVI holding-company register & UBO record', kind: 'Registry' },
      { name: 'Independent valuation — Singapore unit', kind: 'Needs refresh' },
    ],
  },
  {
    id: 'portfolio-2016',
    period: '2016 – 2026',
    title: 'Diversified investment portfolio & returns',
    category: 'Investment returns',
    valueM: 74.0,
    valueLabel: 'US$ 74.0M current · ~US$ 31.0M cumulative gains',
    narrative:
      'From 2016 the client invested the balance of sale proceeds, the retained minority dividend stream and inheritance assets into a diversified discretionary portfolio of listed equities, funds and fixed income managed by the bank and one external manager. The portfolio has compounded to a current value of approximately US$ 74.0M, including roughly US$ 31.0M of accumulated investment returns. All flows are evidenced by custody and performance statements.',
    status: 'verified',
    docs: [
      { name: 'Discretionary mandate & IMA', kind: 'Agreement' },
      { name: 'Custody statements (2016 – 2026)', kind: 'Statement' },
      { name: 'Annual performance & attribution reports', kind: 'Statement' },
      { name: 'External-manager reconciliation', kind: 'Statement' },
    ],
  },
]

/* --------------------- Verification & checks -------------------- */

export const checks: VerificationCheck[] = [
  {
    label: 'Company confirmed in public registry',
    detail: 'Pacific Meridian Logistics Ltd. active 1992 – present; client recorded as founding director.',
    source: 'HK Companies Registry · ICRIS',
    status: 'pass',
  },
  {
    label: 'Press coverage of sale located',
    detail: 'Acquisition by Orient Global Freight Holdings reported Nov 2014.',
    source: 'SCMP · Reuters · company release',
    status: 'pass',
  },
  {
    label: 'Sale value corroborated',
    detail: 'Headline US$ 182.0M consistent across SPA, completion statement and press.',
    source: 'SPA vs. media vs. bank receipt',
    status: 'pass',
  },
  {
    label: 'Strategic buyer identity verified',
    detail: 'Acquirer is a substantive regional logistics group; no nominee indicators.',
    source: 'Corporate registry · D&B profile',
    status: 'pass',
  },
  {
    label: 'Incoming funds traced to client account',
    detail: 'US$ 168.0M net settlement matched to wire confirmation.',
    source: 'Internal payments record',
    status: 'pass',
  },
  {
    label: 'Probate & inheritance evidenced',
    detail: 'Grant of probate and distribution statement on file.',
    source: 'HK Probate Registry · solicitors',
    status: 'pass',
  },
  {
    label: 'Real-estate title verified',
    detail: 'Land Registry memorials confirmed for all Hong Kong holdings.',
    source: 'HK Land Registry',
    status: 'pass',
  },
  {
    label: 'Adverse-media screening clear',
    detail: 'No negative news, litigation or enforcement matches.',
    source: 'World-Check · Factiva',
    status: 'pass',
  },
  {
    label: 'Sanctions & PEP screening clear',
    detail: 'No sanctions, watch-list or PEP hits for client or close associates.',
    source: 'World-Check · Dow Jones',
    status: 'pass',
  },
  {
    label: 'Source of 1992 founding capital',
    detail: 'Family loan of HK$ 2.0M asserted but loan instrument not produced.',
    source: 'Client declaration only',
    status: 'flag',
  },
  {
    label: 'Singapore property valuation',
    detail: 'Current value rests on a single 2021 broker estimate; corroboration needed.',
    source: 'Broker estimate (uncorroborated)',
    status: 'flag',
  },
  {
    label: 'Early Kowloon property (2003)',
    detail: 'No purchase / sale records located; US$ 8.0M attribution unsupported.',
    source: 'No primary documentation',
    status: 'flag',
  },
]

/* ---------------------- Gaps & red flags ----------------------- */

export const redFlags: RedFlag[] = [
  {
    priority: 'high',
    title: 'Early Kowloon property gain undocumented',
    detail:
      'Approximately US$ 8.0M (2.6% of declared wealth) is attributed to a 2003 – 2011 Kowloon property transaction for which no purchase, sale or settlement records exist in the file. The attribution rests solely on the client’s declaration.',
    action:
      'Request Land Registry memorials and bank records, or formally reclassify the US$ 8.0M as undocumented and exclude it from the corroborated wealth base.',
  },
  {
    priority: 'medium',
    title: 'Source of 1992 founding capital partially corroborated',
    detail:
      'The HK$ 2.0M interest-free family loan that part-funded the company’s formation is asserted but unsupported by a loan instrument or contemporaneous bank record. The personal-savings component is reasonably supported by employment history.',
    action:
      'Obtain the loan instrument or a signed family-source declaration; document the lender relationship and original source of funds.',
  },
  {
    priority: 'low',
    title: 'Singapore property valuation stale',
    detail:
      'The Orchard Boulevard unit’s contribution to the US$ 138.0M real-estate aggregate relies on a single 2021 broker estimate, now over twelve months old and not independently corroborated.',
    action:
      'Commission an independent RICS-equivalent valuation to refresh the holding before the next periodic review.',
  },
]

/* -------------------- Current asset allocation ----------------- */

export const holdings: Holding[] = [
  { label: 'Real estate — HK & Singapore', valueM: 138.0, color: '#0E1B2E' },
  { label: 'Listed securities & funds', valueM: 74.0, color: '#B0904F' },
  { label: 'Retained private equity (32% stake)', valueM: 46.0, color: '#4F6B53' },
  { label: 'Fixed income', valueM: 38.4, color: '#7C8AA0' },
  { label: 'Cash & equivalents', valueM: 16.0, color: '#C2B79A' },
]

/* ----------------- Wealth accumulation over time --------------- */

export interface WealthPoint {
  year: string
  value: number // cumulative net worth, USD millions
}

export const wealthCurve: WealthPoint[] = [
  { year: '1992', value: 1 },
  { year: '1997', value: 7 },
  { year: '2000', value: 15 },
  { year: '2003', value: 27 },
  { year: '2006', value: 42 },
  { year: '2008', value: 64 },
  { year: '2011', value: 99 },
  { year: '2014', value: 252 },
  { year: '2017', value: 269 },
  { year: '2020', value: 282 },
  { year: '2023', value: 299 },
  { year: '2026', value: 312 },
]

/* ----------------- Completeness composition -------------------- */

export const completenessBreakdown: CompletenessSlice[] = [
  { label: 'Verified & corroborated', pct: 78, status: 'verified' },
  { label: 'Needs verification', pct: 14, status: 'needs-verification' },
  { label: 'Missing documentation', pct: 8, status: 'missing' },
]

/* ------------------ Wealth-flow diagram model ------------------ */

export interface FlowNodeData extends Record<string, unknown> {
  title: string
  sub?: string
  value?: string
  tone: 'source' | 'engine' | 'event' | 'holding'
}

export const disclaimerLine =
  'Decision-support only — does not replace compliance review.'
