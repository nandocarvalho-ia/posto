import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useClientes, useClientesRealtime, useUpdateCliente } from '@/hooks/useClientes'
import { useChat, useChatRealtime } from '@/hooks/useChat'
import { Avatar, Switch, Loading, EmptyState } from '@/components/ui'
import { cn } from '@/lib/utils'
import { cleanText, fmtPhone, iniciais, relativeFromNow, clockTime } from '@/lib/format'
import { visibleMessages, displayText, isOurs, postChatMessage, reconcileOptimistic, chatEnabled, type OptimisticMsg } from '@/lib/chat'
import type { Cliente } from '@/types'
import { ArrowLeft, Search, Send, Bot, BotOff, MessageSquare, AlertCircle } from 'lucide-react'

export default function Atendimentos() {
  useClientesRealtime()
  const { telefone } = useParams()
  const navigate = useNavigate()
  const { data: clientes, isLoading } = useClientes()
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(() => {
    const list = clientes ?? []
    const q = busca.trim().toLowerCase()
    if (!q) return list
    return list.filter((c) =>
      [cleanText(c.nome), c.telefone, cleanText(c.interesse), cleanText(c.cidade)]
        .join(' ').toLowerCase().includes(q),
    )
  }, [clientes, busca])

  const selecionado = clientes?.find((c) => c.telefone === telefone) ?? null

  if (isLoading) return <Loading />

  return (
    <div className="h-[calc(100dvh-7rem)] sm:h-[calc(100dvh-8rem)]">
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
        {/* Lista */}
        <div className={cn('flex min-h-0 flex-col rounded-lg border border-border bg-card', telefone && 'hidden lg:flex')}>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar cliente…"
                className="w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-base outline-none focus:ring-2 focus:ring-ring/40 sm:text-sm"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {filtrados.length === 0 && <EmptyState title="Nenhum cliente" />}
            {filtrados.map((c) => (
              <button
                key={c.telefone}
                onClick={() => navigate(`/atendimentos/${c.telefone}`)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition',
                  c.telefone === telefone ? 'bg-secondary' : 'hover:bg-secondary/60',
                )}
              >
                <div className="relative">
                  <Avatar initials={iniciais(c.nome, c.telefone)} size={40} />
                  {c.pausar_ia && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card">
                      <BotOff className="h-3 w-3" style={{ color: 'oklch(0.55 0.18 25)' }} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{cleanText(c.nome) || fmtPhone(c.telefone)}</div>
                  <div className="truncate text-xs text-muted-foreground">{cleanText(c.interesse) || 'Sem interesse'}</div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{relativeFromNow(c.ultima_interacao)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversa */}
        <div className={cn('min-h-0', !telefone && 'hidden lg:block')}>
          {selecionado ? (
            <Conversa key={selecionado.telefone} cliente={selecionado} onBack={() => navigate('/atendimentos')} />
          ) : (
            <div className="hidden h-full items-center justify-center rounded-lg border border-border bg-card lg:flex">
              <EmptyState icon={<MessageSquare className="h-10 w-10" />} title="Selecione uma conversa" hint="Escolha um cliente à esquerda para ver o histórico com a Nanda." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Conversa({ cliente, onBack }: { cliente: Cliente; onBack: () => void }) {
  useChatRealtime(cliente.telefone)
  const { data: rows, isLoading } = useChat(cliente.telefone)
  const update = useUpdateCliente()
  const [texto, setTexto] = useState('')
  const [optimistic, setOptimistic] = useState<OptimisticMsg[]>([])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const msgs = useMemo(() => visibleMessages(rows ?? []), [rows])

  // Reconcilia otimistas quando o servidor confirma
  useEffect(() => {
    setOptimistic((prev) => reconcileOptimistic(rows ?? [], prev))
  }, [rows])

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [msgs.length, optimistic.length])

  function autoGrow() {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  async function enviar() {
    const t = texto.trim()
    if (!t || enviando) return
    setErro(null)
    const tempId = `tmp-${Date.now()}`
    setOptimistic((p) => [...p, { tempId, content: t, status: 'pending', createdAt: Date.now() }])
    setTexto('')
    setTimeout(autoGrow, 0)
    setEnviando(true)
    // Humano assumiu → pausa a Nanda
    if (!cliente.pausar_ia) update.mutate({ telefone: cliente.telefone, patch: { pausar_ia: true } })
    try {
      await postChatMessage(cliente.telefone, t)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha no envio.')
      setOptimistic((p) => p.map((o) => (o.tempId === tempId ? { ...o, status: 'error' } : o)))
    } finally {
      setEnviando(false)
    }
  }

  const enabled = chatEnabled()

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
        <button onClick={onBack} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar initials={iniciais(cliente.nome, cliente.telefone)} size={38} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{cleanText(cliente.nome) || fmtPhone(cliente.telefone)}</div>
          <div className="num truncate text-xs text-muted-foreground">{fmtPhone(cliente.telefone)}</div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1.5">
          {cliente.pausar_ia ? <BotOff className="h-4 w-4 text-muted-foreground" /> : <Bot className="h-4 w-4" style={{ color: 'oklch(0.55 0.14 150)' }} />}
          <span className="hidden text-xs text-muted-foreground sm:inline">{cliente.pausar_ia ? 'IA pausada' : 'IA ativa'}</span>
          <Switch checked={cliente.pausar_ia} onChange={(v) => update.mutate({ telefone: cliente.telefone, patch: { pausar_ia: v } })} />
        </div>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-background/40 px-3 py-4 sm:px-5">
        {isLoading ? (
          <Loading />
        ) : msgs.length === 0 && optimistic.length === 0 ? (
          <EmptyState title="Sem mensagens" hint="A conversa aparecerá aqui." />
        ) : (
          <>
            {msgs.map((m) => {
              const ours = isOurs(m)
              return (
                <div key={m.id} className={cn('flex', ours ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm shadow-sm',
                      ours ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm border border-border bg-card',
                    )}
                  >
                    {displayText(m)}
                    <div className={cn('mt-1 text-[10px]', ours ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                      {clockTime(m.timestamp)}
                    </div>
                  </div>
                </div>
              )
            })}
            {optimistic.map((o) => (
              <div key={o.tempId} className="flex justify-end">
                <div className={cn('max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm px-3.5 py-2 text-sm', o.status === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/70 text-primary-foreground')}>
                  {o.content}
                  <div className="mt-1 text-[10px] opacity-80">{o.status === 'error' ? 'falhou' : 'enviando…'}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3">
        {erro && <div className="mb-2 flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" /> {erro}</div>}
        {!enabled ? (
          <div className="flex items-center gap-2 rounded-md bg-secondary/70 px-3 py-2.5 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Envio desativado: configure o webhook do n8n (VITE_WEBHOOK_CHAT) para responder pelo painel.
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              ref={taRef}
              value={texto}
              onChange={(e) => { setTexto(e.target.value); autoGrow() }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
              rows={1}
              placeholder="Escreva uma mensagem… (a Nanda pausa quando você assume)"
              className="max-h-[140px] min-h-[42px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40 sm:text-sm"
            />
            <button
              onClick={enviar}
              disabled={!texto.trim() || enviando}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-[18px] w-[18px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
