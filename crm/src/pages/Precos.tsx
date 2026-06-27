import { useState } from 'react'
import { usePrecos, usePrecoHistorico, usePrecosRealtime, useSetPreco } from '@/hooks/usePrecos'
import { Card, PageHeader, Loading, EmptyState, ErrorNote } from '@/components/ui'
import { brl, fmtDateTime, fmtPhone } from '@/lib/format'
import type { Preco } from '@/types'
import { Check, History, Fuel, Pencil } from 'lucide-react'

function parseValor(s: string): number {
  const n = Number(s.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.'))
  return isNaN(n) ? NaN : n
}

function PrecoRow({ p }: { p: Preco }) {
  const setPreco = useSetPreco()
  const [edit, setEdit] = useState(false)
  const [val, setVal] = useState(p.valor > 0 ? String(p.valor).replace('.', ',') : '')
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    const v = parseValor(val)
    if (isNaN(v) || v < 0) { setErro('Valor inválido.'); return }
    setErro(null)
    try {
      await setPreco.mutateAsync({ produto: p.produto, valor: v })
      setEdit(false)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar.')
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10" style={{ color: 'oklch(0.45 0.12 158)' }}>
        <Fuel className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{p.nome_exibicao}</div>
        <div className="text-xs text-muted-foreground">
          {p.sigla}
          {p.atualizado_por && <> · por {p.atualizado_por === 'PAINEL' ? 'painel' : fmtPhone(p.atualizado_por)}</>}
        </div>
      </div>

      {edit ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <input
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && salvar()}
              inputMode="decimal"
              placeholder="0,00"
              className="num w-28 rounded-md border border-border bg-background py-2 pl-8 pr-2 text-right text-base outline-none focus:ring-2 focus:ring-ring/40 sm:text-sm"
            />
          </div>
          <button onClick={salvar} disabled={setPreco.isPending} className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">
            <Check className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button onClick={() => setEdit(true)} className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary">
          <span className="num text-base font-semibold">{p.valor > 0 ? brl(p.valor) : <span className="text-sm font-normal text-muted-foreground">a confirmar</span>}</span>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
        </button>
      )}
      {erro && <div className="ml-2"><ErrorNote>{erro}</ErrorNote></div>}
    </div>
  )
}

export default function Precos() {
  usePrecosRealtime()
  const { data: precos, isLoading } = usePrecos()
  const { data: hist } = usePrecoHistorico()

  if (isLoading) return <Loading />

  return (
    <div>
      <PageHeader title="Preços" subtitle="Altere o preço de cada combustível direto pelo painel" />

      <Card className="divide-y divide-border">
        {(precos ?? []).map((p) => <PrecoRow key={p.produto} p={p} />)}
      </Card>

      <p className="mt-2 px-1 text-xs text-muted-foreground">
        Dica: Gasolina Comum e Aditivada costumam ter o mesmo preço — atualize as duas quando mexer.
      </p>

      <div className="mt-6">
        <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold">
          <History className="h-4 w-4 text-muted-foreground" /> Histórico de alterações
        </h2>
        <Card className="overflow-hidden">
          {(hist ?? []).length === 0 ? (
            <EmptyState title="Sem alterações registradas" />
          ) : (
            <div className="divide-y divide-border">
              {(hist ?? []).map((h) => (
                <div key={h.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{h.produto.replace(/_/g, ' ')}</span>
                    <span className="num ml-2 text-muted-foreground">
                      {brl(Number(h.valor_anterior))} → <span className="font-medium text-foreground">{brl(Number(h.valor_novo))}</span>
                    </span>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    <div>{h.nome_alterou || (h.alterado_por === 'PAINEL' ? 'Painel' : fmtPhone(h.alterado_por))}</div>
                    <div>{fmtDateTime(h.alterado_em)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
