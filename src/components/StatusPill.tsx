import type { DocStatus } from '../data/client'
import { CheckIcon, FlagIcon, DashIcon } from './Icons'

const config: Record<
  DocStatus,
  { label: string; text: string; border: string; bg: string; Icon: typeof CheckIcon }
> = {
  verified: {
    label: 'Verified',
    text: 'text-sage',
    border: 'border-sage/35',
    bg: 'bg-sage/[0.08]',
    Icon: CheckIcon,
  },
  'needs-verification': {
    label: 'Needs verification',
    text: 'text-ochre',
    border: 'border-ochre/40',
    bg: 'bg-ochre/[0.09]',
    Icon: FlagIcon,
  },
  missing: {
    label: 'Missing',
    text: 'text-slatey',
    border: 'border-slatey/40',
    bg: 'bg-slatey/[0.08]',
    Icon: DashIcon,
  },
}

export default function StatusPill({
  status,
  size = 'md',
}: {
  status: DocStatus
  size?: 'sm' | 'md'
}) {
  const c = config[status]
  const pad = size === 'sm' ? 'px-2 py-[2px] text-[9.5px]' : 'px-2.5 py-1 text-[10px]'
  const ic = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border ${c.border} ${c.bg} ${c.text} ${pad} font-sans font-medium uppercase tracking-wide2 leading-none`}
    >
      <c.Icon className={ic} />
      {c.label}
    </span>
  )
}
