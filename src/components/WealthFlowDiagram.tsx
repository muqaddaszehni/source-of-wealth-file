import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { FlowNodeData } from '../data/client'

type SwfNode = Node<FlowNodeData, 'swf'>

const toneStyle: Record<
  FlowNodeData['tone'],
  { box: string; title: string; sub: string; value: string }
> = {
  source: {
    box: 'border-hairline bg-bone',
    title: 'text-navy',
    sub: 'text-slatey',
    value: 'text-brass-deep',
  },
  engine: {
    box: 'border-navy bg-navy shadow-document',
    title: 'text-bone',
    sub: 'text-bone/55',
    value: 'text-brass',
  },
  event: {
    box: 'border-hairline bg-paper border-l-[3px] border-l-brass',
    title: 'text-navy',
    sub: 'text-slatey',
    value: 'text-brass-deep',
  },
  holding: {
    box: 'border-hairline bg-paper',
    title: 'text-navy',
    sub: 'text-slatey',
    value: 'text-sage',
  },
}

function FlowCard({ data }: NodeProps<SwfNode>) {
  const t = toneStyle[data.tone]
  return (
    <div
      className={`w-[208px] border px-4 py-3 ${t.box}`}
      style={{ borderRadius: 2 }}
    >
      <Handle type="target" position={Position.Left} />
      <div className={`font-serif text-[16px] leading-tight ${t.title}`}>{data.title}</div>
      {data.sub && (
        <div className={`mt-1 font-sans text-[10px] tracking-wide2 ${t.sub}`}>{data.sub}</div>
      )}
      {data.value && (
        <div className={`mt-2 font-sans text-[13px] font-medium tracking-wide2 figure ${t.value}`}>
          {data.value}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = { swf: FlowCard }

const nodes: SwfNode[] = [
  { id: 'savings', type: 'swf', position: { x: 0, y: 40 }, data: { title: 'Savings & family loan', sub: '1992 · founder capital', tone: 'source' } },
  { id: 'inherit', type: 'swf', position: { x: 0, y: 360 }, data: { title: 'Inheritance', sub: '2008 · paternal estate', value: 'US$ 12.0M', tone: 'source' } },
  { id: 'engine', type: 'swf', position: { x: 268, y: 190 }, data: { title: 'Pacific Meridian Logistics', sub: 'Founded 1992 · sold 2014', tone: 'engine' } },
  { id: 'sale', type: 'swf', position: { x: 536, y: 70 }, data: { title: 'Sale of 68% stake', sub: '2014 · Orient Global Freight', value: 'US$ 182.0M', tone: 'event' } },
  { id: 'retain', type: 'swf', position: { x: 536, y: 320 }, data: { title: 'Retained 32% stake', sub: 'Dividends · current value', value: 'US$ 46.0M', tone: 'event' } },
  { id: 're', type: 'swf', position: { x: 824, y: 0 }, data: { title: 'Real estate — HK & SG', value: 'US$ 138.0M', tone: 'holding' } },
  { id: 'sec', type: 'swf', position: { x: 824, y: 118 }, data: { title: 'Listed securities & funds', value: 'US$ 74.0M', tone: 'holding' } },
  { id: 'fi', type: 'swf', position: { x: 824, y: 236 }, data: { title: 'Fixed income', value: 'US$ 38.4M', tone: 'holding' } },
  { id: 'cash', type: 'swf', position: { x: 824, y: 354 }, data: { title: 'Cash & equivalents', value: 'US$ 16.0M', tone: 'holding' } },
]

const edge = (id: string, source: string, target: string, label?: string): Edge => ({
  id,
  source,
  target,
  type: 'smoothstep',
  label,
  labelStyle: { fill: '#8B8579', fontSize: 9, fontFamily: 'Inter', letterSpacing: '0.06em' },
  labelBgStyle: { fill: '#FCFAF5' },
  labelBgPadding: [4, 2],
  markerEnd: { type: MarkerType.ArrowClosed, color: '#B0904F', width: 14, height: 14 },
  style: { stroke: '#B0904F', strokeOpacity: 0.5 },
})

const edges: Edge[] = [
  edge('e1', 'savings', 'engine', 'founds'),
  edge('e2', 'engine', 'sale'),
  edge('e3', 'engine', 'retain'),
  edge('e4', 'sale', 're', 'reinvest'),
  edge('e5', 'sale', 'sec'),
  edge('e6', 'sale', 'fi'),
  edge('e7', 'sale', 'cash'),
  edge('e8', 'retain', 'sec', 'dividends'),
  edge('e9', 'inherit', 'sec'),
  edge('e10', 'inherit', 're'),
]

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 border ${className}`} style={{ borderRadius: 2 }} />
      <span className="font-sans text-[10px] tracking-wide2 text-slatey">{label}</span>
    </span>
  )
}

export default function WealthFlowDiagram() {
  const memoNodes = useMemo(() => nodes, [])
  const memoEdges = useMemo(() => edges, [])

  return (
    <div className="border border-hairline bg-paper">
      <div
        className="h-[460px] w-full"
        style={{ background: 'radial-gradient(circle at 50% 40%, #FCFAF5, #F4F0E7)' }}
      >
        <ReactFlow
          nodes={memoNodes}
          edges={memoEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.16 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.4}
          maxZoom={1.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#B0904F" gap={26} size={1} style={{ opacity: 0.14 }} />
        </ReactFlow>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline px-5 py-3">
        <LegendDot className="border-hairline bg-bone" label="Source of funds" />
        <LegendDot className="border-navy bg-navy" label="Wealth engine" />
        <LegendDot className="border-l-[3px] border-l-brass border-hairline bg-paper" label="Liquidity event" />
        <LegendDot className="border-hairline bg-paper" label="Current holding" />
      </div>
    </div>
  )
}
