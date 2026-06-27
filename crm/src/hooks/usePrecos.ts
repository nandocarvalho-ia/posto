import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Preco, PrecoHistorico } from '@/types'

export function usePrecos() {
  return useQuery({
    queryKey: ['precos'],
    queryFn: async (): Promise<Preco[]> => {
      const { data, error } = await supabase.from('precos').select('*').order('produto', { ascending: true })
      if (error) throw error
      return (data ?? []) as Preco[]
    },
  })
}

export function usePrecoHistorico() {
  return useQuery({
    queryKey: ['precos_historico'],
    queryFn: async (): Promise<PrecoHistorico[]> => {
      const { data, error } = await supabase
        .from('precos_historico')
        .select('*')
        .order('alterado_em', { ascending: false })
        .limit(60)
      if (error) throw error
      return (data ?? []) as PrecoHistorico[]
    },
  })
}

export function usePrecosRealtime() {
  const qc = useQueryClient()
  useEffect(() => {
    const ch = supabase
      .channel('rt-precos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'precos' }, () => {
        qc.invalidateQueries({ queryKey: ['precos'] })
        qc.invalidateQueries({ queryKey: ['precos_historico'] })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [qc])
}

export function useSetPreco() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ produto, valor }: { produto: string; valor: number }) => {
      const { data, error } = await supabase.rpc('atualizar_preco', {
        p_produto: produto,
        p_valor: valor,
        p_numero: 'PAINEL',
      })
      if (error) throw error
      const res = data as { sucesso?: boolean; erro?: string } | null
      if (res && res.sucesso === false) throw new Error(res.erro || 'Falha ao atualizar preço.')
      return res
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['precos'] })
      qc.invalidateQueries({ queryKey: ['precos_historico'] })
    },
  })
}
