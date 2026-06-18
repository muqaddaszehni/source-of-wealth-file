import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { FlowNodeData } from '../data/client'
import { useActiveDossier } from '../state/DossierContext'
import { buildFlowModel } from '../lib/buildFlow'

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

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 border ${className}`} style={{ borderRadius: 2 }} />
      <span className="font-sans text-[10px] tracking-wide2 text-slatey">{label}</span>
    </span>
  )
}

export default function WealthFlowDiagram() {
  const dossier = useActiveDossier()
  const flow = useMemo(() => dossier.flow ?? buildFlowModel(dossier), [dossier])
  const memoNodes = flow.nodes
  const memoEdges = flow.edges

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
