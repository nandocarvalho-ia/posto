import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Autorizado } from '@/types'

const KEY = ['autorizados'] as const

export function useAutorizados() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Autorizado[]> => {
      const { data, error } = await supabase
        .from('numeros_autorizados')
        .select('*')
        .order('nome', { ascending: true, nullsFirst: false })
      if (error) throw error
      return (data ?? []) as Autorizado[]
    },
  })
}

export function useAutorizadosRealtime() {
  const qc = useQueryClient()
  useEffect(() => {
    const ch = supabase
      .channel('rt-autorizados')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'numeros_autorizados' }, () => {
        qc.invalidateQueries({ queryKey: KEY })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [qc])
}

export function useAddAutorizado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ numero, nome }: { numero: string; nome: string }) => {
      const { error } = await supabase
        .from('numeros_autorizados')
        .upsert({ numero, nome: nome || null, ativo: true }, { onConflict: 'numero' })
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useToggleAutorizado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ numero, ativo }: { numero: string; ativo: boolean }) => {
      const { error } = await supabase.from('numeros_autorizados').update({ ativo }).eq('numero', numero)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteAutorizado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (numero: string) => {
      const { error } = await supabase.from('numeros_autorizados').delete().eq('numero', numero)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
