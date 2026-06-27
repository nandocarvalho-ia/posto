import { useMemo, useState } from 'react'
import {
  DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useClientes, useClientesRealtime, useUpdateCliente } from '@/hooks/useClientes'
import { Loading, PageHeader } from '@/components/ui'
import ClienteModal from '@/components/ClienteModal'
import { cn } from '@/lib/utils'
import { cleanText, fmtPhone, relativeFromNow } from '@/lib/format'
import { STATUS_CRM_META, STATUS_CRM_ORDER, type Cliente, type StatusCrm } from '@/types'
import { GripVertical } from 'lucide-react'

function Card({ cliente, onOpen }: { cliente: Cliente; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: cliente.telefone })
  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={cn(
        'group rounded-lg border border-border bg-card p-3 shadow-card',
        isDragging && 'opacity-40',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="Arrastar"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium">{cleanText(cliente.nome) || fmtPhone(cliente.telefone)}</div>
          <div className="truncate text-xs text-muted-foreground">{cleanText(cliente.interesse) || 'Sem interesse'}</div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{relativeFromNow(cliente.ultima_interacao)}</span>
            {cliente.pausar_ia && <span className="rounded bg-destructive/12 px-1.5 py-0.5" style={{ color: 'oklch(0.5 0.16 25)' }}>IA pausada</span>}
          </div>
        </button>
      </div>
    </div>
  )
}

function Column({ status, cards, onOpen }: { status: StatusCrm; cards: Cliente[]; onOpen: (c: Cliente) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = STATUS_CRM_META[status]
  return (
    <div className="flex min-h-0 w-[78vw] shrink-0 flex-col sm:w-auto sm:shrink">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="h-2 w-2 rounded-full" style={{ background: `oklch(0.62 0.16 ${meta.hue})` }} />
        <span className="text-sm font-semibold">{meta.label}</span>
        <span className="num rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{cards.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[8rem] flex-1 space-y-2 rounded-lg border border-dashed p-2 transition-colors',
          isOver ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30',
        )}
      >
        {cards.map((c) => (
          <Card key={c.telefone} cliente={c} onOpen={() => onOpen(c)} />
        ))}
      </div>
    </div>
  )
}

export default function Kanban() {
  useClientesRealtime()
  const { data: clientes, isLoading } = useClientes()
  const update = useUpdateCliente()
  const [aberto, setAberto] = useState<Cliente | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 160, tolerance: 6 } }))

  const colunas = useMemo(() => {
    const map: Record<StatusCrm, Cliente[]> = { novo: [], em_atendimento: [], resolvido: [], recorrente: [] }
    for (const c of clientes ?? []) {
      const s = (STATUS_CRM_ORDER.includes(c.status_crm) ? c.status_crm : 'novo') as StatusCrm
      map[s].push(c)
    }
    return map
  }, [clientes])

  function onDragEnd(e: DragEndEvent) {
    const telefone = String(e.active.id)
    const destino = e.over?.id as StatusCrm | undefined
    if (!destino || !STATUS_CRM_ORDER.includes(destino)) return
    const atual = clientes?.find((c) => c.telefone === telefone)
    if (!atual || atual.status_crm === destino) return
    update.mutate({ telefone, patch: { status_crm: destino } })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <PageHeader title="Kanban" subtitle="Arraste pela alça para mover o atendimento de etapa" />
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {STATUS_CRM_ORDER.map((s) => (
            <Column key={s} status={s} cards={colunas[s]} onOpen={setAberto} />
          ))}
        </div>
      </DndContext>
      {aberto && <ClienteModal cliente={aberto} onClose={() => setAberto(null)} />}
    </div>
  )
}
