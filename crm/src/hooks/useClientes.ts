import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Cliente, ClienteCrmUpdate } from '@/types'

const KEY = ['clientes'] as const

export function useClientes() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Cliente[]> => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('ultima_interacao', { ascending: false, nullsFirst: false })
      if (error) throw error
      return (data ?? []) as Cliente[]
    },
  })
}

export function useClientesRealtime() {
  const qc = useQueryClient()
  useEffect(() => {
    const ch = supabase
      .channel('rt-clientes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, () => {
        qc.invalidateQueries({ queryKey: KEY })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [qc])
}

export function useUpdateCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ telefone, patch }: { telefone: string; patch: ClienteCrmUpdate }) => {
      const { error } = await supabase.from('clientes').update(patch).eq('telefone', telefone)
      if (error) throw error
    },
    onMutate: async ({ telefone, patch }) => {
      await qc.cancelQueries({ queryKey: KEY })
      const prev = qc.getQueryData<Cliente[]>(KEY)
      qc.setQueryData<Cliente[]>(KEY, (old) =>
        (old ?? []).map((c) => (c.telefone === telefone ? { ...c, ...patch } : c)),
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
