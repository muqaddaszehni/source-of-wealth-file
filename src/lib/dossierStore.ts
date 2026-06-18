/* ------------------------------------------------------------------ *
 *  dossierStore — localStorage persistence for the client roster.
 *  Seeds Mr. Chen plus two generated sample clients on first load.
 *  Seed-on-absence is idempotent (StrictMode double-mount safe).
 * ------------------------------------------------------------------ */

import { chenDossier, type Dossier } from '../data/client'
import { generateDossier, type OnboardingInput } from './generateDossier'

const CLIENTS_KEY = 'sow.clients.v1'
const ACTIVE_KEY = 'sow.active.v1'

/* ---- two fictional sample clients, built through the generator ---- */

const tanInput: OnboardingInput = {
  id: 'tan',
  profile: {
    name: 'Madam Tan Mei-Ling',
    romanisation: '陳美玲',
    residence: 'Singapore (citizen)',
    bookingCentre: 'Singapore',
    relationshipSince: '2018',
    riskClassification: 'Medium — standard due diligence',
    reportingCurrency: 'USD',
    relationshipManager: 'L. Chevalier · Private Wealth, Asia',
  },
  screening: { sanctionsPep: 'pass', adverseMedia: 'pass' },
  sources: [
    {
      category: 'Business formation',
      title: 'Founded Meridian Health Systems',
      period: '2001',
      valueM: 1.2,
      basis: 'Seed capital from personal savings and an early angel round.',
      counterparty: 'Meridian Health Systems Pte Ltd',
      status: 'verified',
      docs: [
        { name: 'Certificate of Incorporation (ACRA)', kind: 'Registry' },
        { name: 'Founding shareholders’ agreement', kind: 'Agreement' },
      ],
    },
    {
      category: 'Liquidity event',
      title: 'Secondary sell-down at SGX listing',
      period: '2018',
      valueM: 96.0,
      basis: 'Partial sell-down of founder shares at IPO.',
      counterparty: 'SGX Mainboard listing',
      status: 'verified',
      docs: [
        { name: 'IPO prospectus & allotment notice', kind: 'Filing' },
        { name: 'Settlement statement', kind: 'Statement' },
        { name: 'Press coverage (Business Times)', kind: 'Media' },
        { name: 'Incoming wire confirmation', kind: 'Bank' },
      ],
    },
    {
      category: 'Reinvestment',
      title: 'Singapore & London real estate',
      period: '2019 – 2023',
      valueM: 64.0,
      basis: 'Two Singapore residential properties and a London flat.',
      status: 'needs-verification',
      docs: [
        { name: 'Title deeds (SLA / HM Land Registry)', kind: 'Registry' },
        { name: 'Sale & purchase agreements', kind: 'Agreement' },
        { name: 'Independent valuation — London unit', kind: 'Needs refresh' },
      ],
    },
    {
      category: 'Investment returns',
      title: 'Discretionary portfolio',
      period: '2019 – 2026',
      valueM: 58.0,
      basis: 'Diversified equities, funds and fixed income with the bank.',
      status: 'verified',
      docs: [
        { name: 'Discretionary mandate & IMA', kind: 'Agreement' },
        { name: 'Custody statements (2019 – 2026)', kind: 'Statement' },
      ],
    },
  ],
}

const ibanezInput: OnboardingInput = {
  id: 'ibanez',
  profile: {
    name: 'Mr. Rafael Ibáñez',
    romanisation: '',
    residence: 'Spain (resident); Monaco domicile',
    bookingCentre: 'Geneva',
    relationshipSince: '2016',
    riskClassification: 'High — enhanced due diligence',
    reportingCurrency: 'USD',
    relationshipManager: 'A. Védrine · Private Wealth, EMEA',
  },
  screening: { sanctionsPep: 'pass', adverseMedia: 'pass' },
  sources: [
    {
      category: 'Inheritance',
      title: 'Family shipping estate',
      period: '2009',
      valueM: 88.0,
      basis: 'Distribution from the estate of his father, a shipping operator.',
      counterparty: 'the estate of D. Ibáñez',
      status: 'verified',
      docs: [
        { name: 'Grant of probate', kind: 'Registry' },
        { name: 'Estate distribution statement', kind: 'Statement' },
        { name: 'Notarial deed of acceptance', kind: 'Letter' },
      ],
    },
    {
      category: 'Property gain',
      title: 'Madrid commercial property',
      period: '2012',
      valueM: 14.0,
      basis: 'Acquisition and 2019 disposal of a Salamanca-district building.',
      status: 'missing',
      docs: [
        { name: 'Purchase / sale deeds', kind: 'Missing' },
        { name: 'Registro de la Propiedad memorial', kind: 'Missing' },
      ],
    },
    {
      category: 'Investment returns',
      title: 'Managed multi-asset portfolio',
      period: '2013 – 2026',
      valueM: 41.0,
      basis: 'Discretionary mandate held with the bank since 2013.',
      status: 'verified',
      docs: [
        { name: 'Investment management agreement', kind: 'Agreement' },
        { name: 'Custody & performance statements', kind: 'Statement' },
      ],
    },
  ],
}

function seed(): Dossier[] {
  return [chenDossier, generateDossier(tanInput), generateDossier(ibanezInput)]
}

export function loadClients(): Dossier[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed as Dossier[]
    }
  } catch {
    /* ignore corrupt / unavailable storage */
  }
  const s = seed()
  saveClients(s)
  return s
}

export function saveClients(clients: Dossier[]): void {
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
  } catch {
    /* storage unavailable — stay in-memory */
  }
}

export function loadActiveId(): string {
  try {
    return localStorage.getItem(ACTIVE_KEY) || 'chen'
  } catch {
    return 'chen'
  }
}

export function saveActiveId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function resetDemo(): Dossier[] {
  try {
    localStorage.removeItem(CLIENTS_KEY)
    localStorage.removeItem(ACTIVE_KEY)
  } catch {
    /* ignore */
  }
  const s = seed()
  saveClients(s)
  saveActiveId('chen')
  return s
}
