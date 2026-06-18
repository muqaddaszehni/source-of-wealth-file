/* ------------------------------------------------------------------ *
 *  buildFlowModel — derives a wealth-flow diagram for generated clients
 *  (Mr. Chen keeps his hand-authored flow on the Dossier itself.)
 *  Layout: sources → engine → liquidity events → current holdings.
 * ------------------------------------------------------------------ */

import { MarkerType, type Edge } from '@xyflow/react'
import type { Dossier, FlowModel, SwfFlowNode, FlowNodeData } from '../data/client'
import { fmtM } from './format'

const mkEdge = (id: string, source: string, target: string, label?: string): Edge => ({
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

const colY = (n: number, i: number, center = 180, spacing = 118) =>
  center - ((n - 1) * spacing) / 2 + i * spacing

export function buildFlowModel(dossier: Dossier): FlowModel {
  const { events, holdings } = dossier
  const engineEvent = events.find((e) => e.category === 'Business formation')
  const sourceEvents = events.filter(
    (e) => e.category === 'Inheritance' || e.category === 'Property gain',
  )
  const liquidityEvents = events.filter((e) => e.category === 'Liquidity event')

  const nodes: SwfFlowNode[] = []
  const edges: Edge[] = []
  const X = { src: 0, eng: 268, evt: 536, hold: 824 }

  // ---- sources column: synthetic founder capital + inheritance/property
  const sourceDefs: { id: string; data: FlowNodeData }[] = []
  if (engineEvent)
    sourceDefs.push({
      id: 'savings',
      data: { title: 'Founder capital', sub: 'Personal savings', tone: 'source' },
    })
  sourceEvents.forEach((e, i) =>
    sourceDefs.push({
      id: `src-${i}`,
      data: { title: e.category, sub: e.period, value: fmtM(e.valueM ?? 0), tone: 'source' },
    }),
  )
  sourceDefs.forEach((s, i) =>
    nodes.push({
      id: s.id,
      type: 'swf',
      position: { x: X.src, y: colY(sourceDefs.length, i) },
      data: s.data,
    }),
  )

  // ---- engine column
  if (engineEvent)
    nodes.push({
      id: 'engine',
      type: 'swf',
      position: { x: X.eng, y: 180 },
      data: {
        title: engineEvent.title.replace(/^Founded\s+/i, ''),
        sub: `Founded ${engineEvent.period}`,
        tone: 'engine',
      },
    })

  // ---- events column (liquidity)
  liquidityEvents.forEach((e, i) =>
    nodes.push({
      id: `evt-${i}`,
      type: 'swf',
      position: { x: X.evt, y: colY(liquidityEvents.length, i) },
      data: { title: e.title, sub: e.period, value: fmtM(e.valueM ?? 0), tone: 'event' },
    }),
  )

  // ---- holdings column
  holdings.forEach((h, i) =>
    nodes.push({
      id: `hold-${i}`,
      type: 'swf',
      position: { x: X.hold, y: colY(holdings.length, i, 180, 104) },
      data: { title: h.label, value: fmtM(h.valueM), tone: 'holding' },
    }),
  )

  // ---- edges
  let ei = 0
  const E = (s: string, t: string, l?: string) => edges.push(mkEdge(`ge${ei++}`, s, t, l))
  const holdIds = holdings.map((_, i) => `hold-${i}`)
  const firstHold = holdIds[0]

  if (engineEvent) {
    if (sourceDefs.some((s) => s.id === 'savings')) E('savings', 'engine', 'founds')
    if (liquidityEvents.length) liquidityEvents.forEach((_, i) => E('engine', `evt-${i}`))
    else holdIds.forEach((h) => E('engine', h))
  }

  liquidityEvents.forEach((_, i) => {
    if (i === 0) holdIds.forEach((h) => E('evt-0', h, undefined))
    else if (firstHold) E(`evt-${i}`, firstHold)
  })

  const hasDistributor = Boolean(engineEvent) || liquidityEvents.length > 0
  sourceEvents.forEach((_, i) => {
    if (!hasDistributor && holdIds.length) {
      // No business / liquidity node — sources are the origins of everything.
      holdIds.forEach((h, k) => E(`src-${i}`, h, i === 0 && k === 0 ? 'allocated' : undefined))
    } else if (firstHold) {
      E(`src-${i}`, firstHold, i === 0 ? 'contributes' : undefined)
    } else if (engineEvent) {
      E(`src-${i}`, 'engine')
    }
  })

  return { nodes, edges }
}
