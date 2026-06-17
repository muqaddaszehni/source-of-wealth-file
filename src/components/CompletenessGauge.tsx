export default function CompletenessGauge({
  value,
  size = 132,
}: {
  value: number
  size?: number
}) {
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const target = c * (1 - value / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#D8D2C6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#B0904F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={target}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-[34px] leading-none text-navy figure">
          {value}
          <span className="text-[18px] text-brass">%</span>
        </span>
        <span className="mt-1.5 eyebrow-muted text-[8.5px]">Completeness</span>
      </div>
    </div>
  )
}
