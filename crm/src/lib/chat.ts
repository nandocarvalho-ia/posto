import type { ChatRow } from '@/types'
import { cleanText } from '@/lib/format'

/** Mensagem interna do agente (tool-call / raciocínio / vazia) — não é conversa real. */
export function isInternalMessage(m: ChatRow): boolean {
  const type = m.message?.type
  if (type === 'tool') return true
  if (type === 'ai') {
    const c = (m.message?.content ?? '').trimStart()
    if (c === '') return true
    if (c.startsWith('Calling ')) return true
    if (/"id"\s*:\s*"call_/.test(c)) return true
  }
  return false
}

export function displayText(m: ChatRow): string {
  const c = m.message?.content ?? ''
  const txt = m.message?.type === 'human' ? c.replace(/^User:\s*/, '') : c
  return cleanText(txt) || txt.trim()
}

/** É "nós" (IA ou humano que assumiu) — renderiza à direita. */
export function isOurs(m: ChatRow): boolean {
  return m.message?.type === 'ai'
}

export function visibleMessages(rows: ChatRow[]): ChatRow[] {
  return rows
    .filter((m) => {
      const t = m.message?.type
      return (t === 'human' || t === 'ai') && !isInternalMessage(m)
    })
    .sort((a, b) => a.id - b.id)
}

export interface OptimisticMsg {
  tempId: string
  content: string
  status: 'pending' | 'error'
  createdAt: number
}

/** Envia pelo webhook do n8n (único que grava em n8n_chat_histories). */
export async function postChatMessage(telefone: string, mensagem: string): Promise<void> {
  const url = import.meta.env.VITE_WEBHOOK_CHAT
  if (!url) throw new Error('Webhook de envio não configurado (VITE_WEBHOOK_CHAT).')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefone, mensagem }),
  })
  if (!res.ok) throw new Error(`Falha no envio (${res.status}).`)
}

/** Remove otimistas cujo conteúdo já apareceu como 'ai' no servidor. */
export function reconcileOptimistic(server: ChatRow[], optimistic: OptimisticMsg[]): OptimisticMsg[] {
  const aiContents = new Set(
    server.filter((m) => m.message?.type === 'ai').map((m) => (m.message?.content ?? '').trim()),
  )
  return optimistic.filter((o) => o.status === 'error' || !aiContents.has(o.content.trim()))
}

export const chatEnabled = (): boolean => Boolean(import.meta.env.VITE_WEBHOOK_CHAT)
