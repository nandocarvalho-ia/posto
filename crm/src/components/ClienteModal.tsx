import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, MessageSquare, Save, MapPin, Tag } from 'lucide-react'
import type { Cliente } from '@/types'
import { STATUS_CRM_META, STATUS_CRM_ORDER } from '@/types'
import { Avatar, Switch } from '@/components/ui'
import { cn } from '@/lib/utils'
import { cleanText, fmtPhone, iniciais, relativeFromNow } from '@/lib/format'
import { useUpdateCliente } from '@/hooks/useClientes'

export default function ClienteModal({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  const navigate = useNavigate()
  const update = useUpdateCliente()
  const [obs, setObs] = useState(cliente.observacoes ?? '')
  const dirty = (obs ?? '') !== (cliente.observacoes ?? '')

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const nome = cleanText(cliente.nome) || 'Sem nome'
  const interesse = cleanText(cliente.interesse)
  const cidade = cleanText(cliente.cidade)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-lift sm:rounded-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <Avatar initials={iniciais(cliente.nome, cliente.telefone)} size={48} />
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold">{nome}</div>
            <div className="num text-sm text-muted-foreground">{fmtPhone(cliente.telefone)}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {interesse && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" /> {interesse}
            </span>
          )}
          {cidade && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {cidade}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-muted-foreground">
            {relativeFromNow(cliente.ultima_interacao)}
          </span>
        </div>

        {/* Status do funil */}
        <div className="mt-5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Etapa</label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {STATUS_CRM_ORDER.map((s) => {
              const meta = STATUS_CRM_META[s]
              const active = cliente.status_crm === s
              return (
                <button
                  key={s}
                  onClick={() => update.mutate({ telefone: cliente.telefone, patch: { status_crm: s } })}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active ? 'text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground',
                  )}
                  style={active ? { background: `oklch(0.62 0.15 ${meta.hue})` } : undefined}
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pausar IA */}
        <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3.5 py-3">
          <div>
            <div className="text-sm font-medium">IA pausada</div>
            <div className="text-xs text-muted-foreground">Quando ligado, a Nanda não responde este contato.</div>
          </div>
          <Switch
            checked={cliente.pausar_ia}
            onChange={(v) => update.mutate({ telefone: cliente.telefone, patch: { pausar_ia: v } })}
          />
        </div>

        {/* Observações */}
        <div className="mt-5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Observações</label>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={3}
            placeholder="Anotações internas sobre este cliente…"
            className="mt-1.5 w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          {dirty && (
            <button
              onClick={() => update.mutate({ telefone: cliente.telefone, patch: { observacoes: obs } })}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Save className="h-4 w-4" /> Salvar
            </button>
          )}
        </div>

        <button
          onClick={() => navigate(`/atendimentos/${cliente.telefone}`)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-2.5 text-sm font-medium hover:bg-muted"
        >
          <MessageSquare className="h-4 w-4" /> Abrir conversa
        </button>
      </div>
    </div>
  )
}
