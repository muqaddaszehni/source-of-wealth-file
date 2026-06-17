export default function SectionHeader({
  numeral,
  eyebrow,
  title,
  aside,
}: {
  numeral: string
  eyebrow: string
  title: string
  aside?: string
}) {
  return (
    <header className="mb-7">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[15px] italic text-brass">{numeral}</span>
        <span className="eyebrow-muted">{eyebrow}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-6">
        <h2 className="font-serif text-[30px] leading-[1.05] text-navy md:text-[34px]">
          {title}
        </h2>
        {aside && (
          <span className="hidden whitespace-nowrap pb-1 font-sans text-[11px] tracking-wide2 text-slatey sm:block">
            {aside}
          </span>
        )}
      </div>
      <div className="mt-4 h-px w-full bg-hairline" />
    </header>
  )
}
