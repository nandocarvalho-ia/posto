import { useState } from 'react'
import { useAutorizados, useAutorizadosRealtime, useAddAutorizado, useToggleAutorizado, useDeleteAutorizado } from '@/hooks/useAutorizados'
import { Card, PageHeader, Loading, EmptyState, Switch } from '@/components/ui'
import { fmtPhone } from '@/lib/format'
import { Plus, Trash2, ShieldCheck } from 'lucide-react'

export default function Autorizados() {
  useAutorizadosRealtime()
  const { data: lista, isLoading } = useAutorizados()
  const add = useAddAutorizado()
  const toggle = useToggleAutorizado()
  const del = useDeleteAutorizado()
  const [numero, setNumero] = useState('')
  const [nome, setNome] = useState('')

  function adicionar() {
    const n = numero.replace(/\D/g, '')
    if (n.length < 10) return
    add.mutate({ numero: n, nome: nome.trim() }, { onSuccess: () => { setNumero(''); setNome('') } })
  }

  if (isLoading) return <Loading />

  return (
    <div className="max-w-2xl">
      <PageHeader title="Autorizados" subtitle="Quem pode alterar preço pelo WhatsApp" />

      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Plus className="h-4 w-4 text-muted-foreground" /> Adicionar número
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome (ex.: Dalva)"
            className="rounded-md border border-border bg-background px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40 sm:text-sm"
          />
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionar()}
            inputMode="numeric"
            placeholder="Número com DDD (ex.: 5573988236527)"
            className="num rounded-md border border-border bg-background px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40 sm:text-sm"
          />
          <button
            onClick={adicionar}
            disabled={numero.replace(/\D/g, '').length < 10 || add.isPending}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            Adicionar
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          A API do WhatsApp às vezes manda o número com o 9º dígito, às vezes sem. Se quiser garantir, cadastre os dois formatos.
        </p>
      </Card>

      <Card className="mt-5">
        {(lista ?? []).length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-9 w-9" />} title="Nenhum número autorizado" />
        ) : (
          <div className="divide-y divide-border">
            {(lista ?? []).map((a) => (
              <div key={a.numero} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.nome || 'Sem nome'}</div>
                  <div className="num text-xs text-muted-foreground">{fmtPhone(a.numero)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">{a.ativo ? 'Ativo' : 'Inativo'}</span>
                  <Switch checked={a.ativo} onChange={(v) => toggle.mutate({ numero: a.numero, ativo: v })} />
                </div>
                <button
                  onClick={() => del.mutate(a.numero)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
