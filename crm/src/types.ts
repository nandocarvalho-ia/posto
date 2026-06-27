export type StatusCrm = 'novo' | 'em_atendimento' | 'resolvido' | 'recorrente'

export interface Cliente {
  telefone: string
  nome: string | null
  interesse: string | null
  cidade: string | null
  observacoes: string | null
  ultima_interacao: string | null
  last_8: string | null
  criado_em: string | null
  atualizado_em: string | null
  pausar_ia: boolean
  status_crm: StatusCrm
}

/** Whitelist: as únicas colunas que o painel pode escrever em `clientes`. */
export type ClienteCrmUpdate = Partial<Pick<Cliente, 'status_crm' | 'pausar_ia' | 'observacoes'>>

export interface ChatMessageBody {
  type: string
  content?: string
  tool_calls?: unknown[]
}

export interface ChatRow {
  id: number
  session_id: string
  message: ChatMessageBody | null
  timestamp: string | null
}

export interface Preco {
  produto: string
  nome_exibicao: string
  sigla: string
  valor: number
  ativo: boolean
  atualizado_por: string | null
  atualizado_em: string | null
}

export interface PrecoHistorico {
  id: number
  produto: string
  valor_anterior: number
  valor_novo: number
  alterado_por: string | null
  nome_alterou: string | null
  alterado_em: string
}

export interface Autorizado {
  numero: string
  nome: string | null
  ativo: boolean
}

export const STATUS_CRM_META: Record<StatusCrm, { label: string; hue: number }> = {
  novo: { label: 'Novo', hue: 235 },
  em_atendimento: { label: 'Em atendimento', hue: 78 },
  resolvido: { label: 'Resolvido', hue: 150 },
  recorrente: { label: 'Recorrente', hue: 85 },
}

export const STATUS_CRM_ORDER: StatusCrm[] = ['novo', 'em_atendimento', 'resolvido', 'recorrente']
