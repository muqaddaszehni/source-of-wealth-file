import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { type DocStatus } from '../data/client'
import { useActiveDossier } from '../state/DossierContext'
import { fmtM } from '../lib/format'

const axisFont = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 10.5,
  letterSpacing: '0.04em',
  fill: '#8B8579',
}

function CurveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-hairline bg-paper px-3 py-2 shadow-document">
      <div className="eyebrow-muted text-[8.5px]">{label}</div>
      <div className="mt-0.5 font-serif text-[18px] text-navy figure">
        {fmtM(payload[0].value)}
      </div>
    </div>
  )
}

function SliceTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="border border-hairline bg-paper px-3 py-2 shadow-document">
      <div className="font-sans text-[11px] tracking-wide2 text-charcoal">{p.label}</div>
      <div className="mt-0.5 font-serif text-[16px] text-navy figure">{fmtM(p.valueM)}</div>
    </div>
  )
}

function WealthCurve() {
  const { wealthCurve } = useActiveDossier()
  return (
    <div className="border border-hairline bg-paper p-6">
      <div className="eyebrow-muted text-[9px]">Wealth accumulation</div>
      <h3 className="mt-1 font-serif text-[22px] leading-tight text-navy">
        Estimated net worth, 1992 – 2026
      </h3>
      <p className="mt-1 font-sans text-[11px] tracking-wide2 text-slatey">
        USD millions · step change reflects the 2014 liquidity event
      </p>
      <div className="mt-5 h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={wealthCurve} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E1B2E" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#0E1B2E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#D8D2C6" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="year"
              tick={axisFont}
              tickLine={false}
              axisLine={{ stroke: '#D8D2C6' }}
              interval="preserveStartEnd"
              minTickGap={18}
            />
            <YAxis
              tick={axisFont}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CurveTooltip />} cursor={{ stroke: '#B0904F', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0E1B2E"
              strokeWidth={1.6}
              fill="url(#curveFill)"
              dot={false}
              activeDot={{ r: 3.5, fill: '#B0904F', stroke: '#FCFAF5', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Allocation() {
  const { holdings } = useActiveDossier()
  const total = holdings.reduce((s, h) => s + h.valueM, 0)
  return (
    <div className="border border-hairline bg-paper p-6">
      <div className="eyebrow-muted text-[9px]">Current allocation</div>
      <h3 className="mt-1 font-serif text-[22px] leading-tight text-navy">
        Composition of present holdings
      </h3>
      <p className="mt-1 font-sans text-[11px] tracking-wide2 text-slatey">
        Where the documented wealth sits today
      </p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-[176px] w-[176px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={holdings}
                dataKey="valueM"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={84}
                paddingAngle={1.5}
                stroke="#FCFAF5"
                strokeWidth={2}
                startAngle={90}
                endAngle={-270}
              >
                {holdings.map((h) => (
                  <Cell key={h.label} fill={h.color} />
                ))}
              </Pie>
              <Tooltip content={<SliceTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[24px] leading-none text-navy figure">
              {fmtM(total)}
            </span>
            <span className="mt-1 eyebrow-muted text-[8px]">Total</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5">
          {holdings.map((h) => (
            <li key={h.label} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0"
                style={{ background: h.color, borderRadius: 1 }}
              />
              <span className="min-w-0 flex-1 font-sans text-[12px] leading-tight text-charcoal/85">
                {h.label}
              </span>
              <span className="font-sans text-[11.5px] tracking-wide2 text-navy figure">
                {((h.valueM / total) * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const barColor: Record<DocStatus, string> = {
  verified: '#4F6B53',
  'needs-verification': '#9C7B3C',
  missing: '#8B8579',
}

function CompletenessBar() {
  const { completenessBreakdown, profile: client } = useActiveDossier()
  return (
    <div className="border border-hairline bg-paper p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="eyebrow-muted text-[9px]">Documentation status</div>
          <h3 className="mt-1 font-serif text-[22px] leading-tight text-navy">
            How complete is the file
          </h3>
        </div>
        <div className="font-serif text-[15px] italic text-brass figure">
          {client.completeness}% corroborated
        </div>
      </div>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-[2px] border border-hairline">
        {completenessBreakdown.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.pct}%`, background: barColor[s.status] }}
            title={`${s.label} — ${s.pct}%`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        {completenessBreakdown.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5"
              style={{ background: barColor[s.status], borderRadius: 1 }}
            />
            <span className="font-sans text-[12px] text-charcoal/85">{s.label}</span>
            <span className="font-sans text-[12px] tracking-wide2 text-navy figure">
              {s.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WealthCharts() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <WealthCurve />
        <Allocation />
      </div>
      <CompletenessBar />
    </div>
  )
}
