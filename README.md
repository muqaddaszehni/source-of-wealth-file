# Source-of-Wealth File

A KYC accelerator that assembles and pressure-tests the **source-of-wealth dossier** for an
ultra-wealthy private-banking client. It reads like a private bank's compliance memo: it collates
declared sources of wealth, attaches supporting documentation, runs cross-checks against public
sources, and surfaces gaps and red flags — then produces a printable one-page summary.

> **Decision-support only — does not replace compliance review.**
> Illustrative demo with entirely fictional data (client *Mr. Chen Wai-Lun*).

## Run it

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default <http://localhost:5173>).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What's inside

- **Client header** — name, total documented wealth, and an overall completeness score as a
  refined arc gauge.
- **Wealth-origin timeline** — each event (company founding, inheritance, the 2014 majority-stake
  sale, real-estate reinvestment, portfolio returns) with an auto-written narrative, an attached
  value, a documentation status pill (verified / needs verification / missing) and its supporting
  documents.
- **Verification & cross-checks rail** — registry confirmation, press coverage, sale-value
  corroboration, sanctions/PEP and adverse-media screening — some passing, some flagged.
- **Flow of wealth** — an interactive node diagram (React Flow) tracing money from its sources
  through the business to today's holdings.
- **Composition & completeness** — wealth-accumulation curve and current allocation (Recharts),
  plus a documentation-status bar.
- **Gaps & red flags** — what is missing or inconsistent, in priority order, each with a
  recommended action.
- **Generate summary** — renders a clean, printable one-page executive summary (use the *Print /
  Save as PDF* button).

The sample client built his wealth founding a Hong Kong logistics company in the 1990s, sold a
majority stake to a strategic buyer in 2014, and reinvested into Hong Kong & Singapore real estate
and a diversified portfolio. Most events are fully documented; one early property gain is flagged
as missing records, and a small number of cross-checks need corroboration.

## Stack

Vite · React · TypeScript · Tailwind CSS · Recharts · @xyflow/react (React Flow).
No backend, no auth, no database — all data is local mock data in `src/data/client.ts`.
