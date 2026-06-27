import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ChatRow } from '@/types'

export function useChat(telefone: string | null) {
  return useQuery({
    queryKey: ['chat', telefone],
    enabled: !!telefone,
    queryFn: async (): Promise<ChatRow[]> => {
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('id, session_id, message, timestamp')
        .eq('session_id', telefone as string)
        .order('id', { ascending: true })
      if (error) throw error
      return (data ?? []) as ChatRow[]
    },
  })
}

export function useChatRealtime(telefone: string | null) {
  const qc = useQueryClient()
  useEffect(() => {
    if (!telefone) return
    const ch = supabase
      .channel(`rt-chat-${telefone}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'n8n_chat_histories', filter: `session_id=eq.${telefone}` },
        () => qc.invalidateQueries({ queryKey: ['chat', telefone] }),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [qc, telefone])
}
