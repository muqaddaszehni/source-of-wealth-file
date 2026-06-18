import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Dossier } from '../data/client'
import {
  loadClients,
  saveClients,
  loadActiveId,
  saveActiveId,
  resetDemo as resetStore,
} from '../lib/dossierStore'

interface DossierContextValue {
  clients: Dossier[]
  activeId: string
  active: Dossier
  selectClient: (id: string) => void
  addClient: (d: Dossier) => void
  resetDemo: () => void
}

const Ctx = createContext<DossierContextValue | null>(null)

export function DossierProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Dossier[]>(() => loadClients())
  const [activeId, setActiveId] = useState<string>(() => loadActiveId())

  const active = clients.find((c) => c.id === activeId) ?? clients[0]

  const selectClient = useCallback((id: string) => {
    setActiveId(id)
    saveActiveId(id)
  }, [])

  const addClient = useCallback((d: Dossier) => {
    setClients((prev) => {
      const next = [...prev.filter((c) => c.id !== d.id), d]
      saveClients(next)
      return next
    })
    setActiveId(d.id)
    saveActiveId(d.id)
  }, [])

  const resetDemo = useCallback(() => {
    const s = resetStore()
    setClients(s)
    setActiveId('chen')
  }, [])

  return (
    <Ctx.Provider value={{ clients, activeId: active.id, active, selectClient, addClient, resetDemo }}>
      {children}
    </Ctx.Provider>
  )
}

function useDossierContext(): DossierContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useDossierContext must be used within a DossierProvider')
  return c
}

/** The currently active client's full dossier. */
export function useActiveDossier(): Dossier {
  return useDossierContext().active
}

/** Roster + actions for the client switcher and onboarding. */
export function useRoster() {
  const { clients, activeId, selectClient, addClient, resetDemo } = useDossierContext()
  return { clients, activeId, selectClient, addClient, resetDemo }
}
