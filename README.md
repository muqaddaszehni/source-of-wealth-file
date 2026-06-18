# Source-of-Wealth File

A **KYC accelerator** that assembles and pressure-tests the *source-of-wealth dossier* for an
ultra-wealthy private-banking client. It reads like a private bank's compliance memo: it collates
declared sources of wealth, attaches supporting documentation, runs cross-checks against public
sources, surfaces gaps and red flags, and produces a printable one-page summary. A banker can also
**onboard a new client** through a guided wizard that auto-generates a complete dossier.

> **Decision-support only — does not replace compliance review.**
> Illustrative demo with entirely fictional data.

- **Live demo:** <https://muqaddaszehni.github.io/source-of-wealth-file/>
- **Source:** <https://github.com/muqaddaszehni/source-of-wealth-file>

## Run it

Requires Node.js 18+.

```bash
npm install
npm run dev      # opens on http://localhost:5173
```

Production bundle:

```bash
npm run build    # tsc type-check + Vite build → dist/
npm run preview
```

## Features

**The dossier** (per active client):

- **Client header** — name, total documented wealth, and an overall completeness score as a
  refined arc gauge.
- **Wealth-origin timeline** — each event (company founding, inheritance, liquidity event,
  reinvestment, portfolio returns) with an auto-written narrative, an attached value, a
  documentation status pill (verified / needs verification / missing) and its supporting documents.
- **Verification & cross-checks rail** — registry confirmation, press coverage, sale-value
  corroboration, sanctions/PEP and adverse-media screening — some passing, some flagged.
- **Flow of wealth** — a node diagram (React Flow) tracing money from its sources through the
  business to today's holdings.
- **Composition & completeness** — wealth-accumulation curve and current allocation (Recharts),
  plus a documentation-status bar.
- **Gaps & red flags** — what is missing or inconsistent, in priority order, each with a
  recommended action.
- **Generate summary** — renders a clean, printable one-page executive summary (*Print / Save as
  PDF*).

**Client onboarding:**

- **"Onboard new client"** opens a 4-step wizard — Identity → Wealth sources → Documents & checks
  → Review. It is pre-filled with a worked example so a demo can click straight through, or every
  field can be edited.
- On **Generate dossier**, the tool produces a full dossier from the inputs (see below) and opens
  it.
- A **client switcher** (top-left dropdown) moves between dossiers. The roster ships seeded with
  Mr. Chen plus two generated sample clients.
- Onboarded/edited clients **persist in `localStorage`**; **"Reset demo data"** (footer) restores
  the seed.

## How the "accelerator" works

`src/lib/generateDossier.ts` turns raw onboarding inputs into a complete `Dossier`:

- **Narratives** — a per-category template weaves the entered facts (period, value, counterparty,
  basis) into a prose source-of-wealth paragraph, with a status-dependent tail.
- **Allocation** — each source category is mapped to an asset bucket (real estate, listed
  securities, fixed income, cash, private business) and aggregated.
- **Wealth curve** — a monotonic cumulative curve synthesized across the event years.
- **Cross-checks** — a standard battery (registry, sale corroboration, probate, title, custody,
  sanctions/PEP, adverse media) with pass/flag derived from each source's status and the screening
  toggles.
- **Completeness** — a value-weighted score (verified = 1, needs-verification = 0.5, missing = 0)
  plus a three-slice breakdown.
- **Red flags** — generated from missing/needs-verification sources and flagged screenings,
  prioritized high → low.
- **Flow diagram** — `src/lib/buildFlow.ts` derives a sources → engine → liquidity-events →
  holdings graph. (Mr. Chen keeps a hand-authored flow stored on his dossier.)

All figures are illustrative and expressed in USD millions.

## Architecture

```
src/
  data/client.ts            Types, the Dossier interface, Mr. Chen's curated dossier (chenDossier)
  lib/
    format.ts               USD-millions formatters
    generateDossier.ts      Onboarding inputs → full Dossier (the accelerator)
    buildFlow.ts            Derives the wealth-flow diagram for generated clients
    dossierStore.ts         localStorage persistence; seeds Chen + 2 sample clients; reset
  state/DossierContext.tsx  Provider + useActiveDossier() / useRoster() hooks
  components/               Presentational pieces; each reads the active dossier from context
    OnboardingWizard.tsx    4-step intake → generateDossier()
    SummaryView.tsx         Printable one-page summary
    ... (Masthead, DossierHeader, WealthTimeline, VerificationPanel,
         WealthFlowDiagram, WealthCharts, GapsRedFlags, StatusPill, Icons, ...)
  App.tsx                   View state ('dossier' | 'summary' | 'onboard'), switcher, layout
  main.tsx                  Wraps <App/> in <DossierProvider>
```

Data flows through a single `Dossier` object served by `DossierContext`; every screen renders the
*active* client. There is **no backend, no auth, no database** — the roster lives in `localStorage`
(keys `sow.clients.v1` / `sow.active.v1`), seeded on first load.

## Design language

"Restrained luxury" — a private bank's printed annual report. Midnight navy `#0E1B2E`, ivory/bone
`#F7F4EE`, brass `#B0904F`, charcoal text, 1px hairline borders. Cormorant Garamond (headings) +
Inter (body), generous whitespace, letter-spaced small-caps labels. Responsive; optimized for
iPhone and MacBook.

## Deployment

Hosted on **GitHub Pages**, built and deployed by GitHub Actions (`.github/workflows/deploy.yml`)
on every push to `main`. `vite.config.ts` sets `base: '/source-of-wealth-file/'` for the production
build only (dev stays at root). First publish can take a few minutes to propagate on the CDN.

## Stack

Vite · React · TypeScript · Tailwind CSS · Recharts · @xyflow/react (React Flow).
