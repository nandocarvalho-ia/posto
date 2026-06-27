const TZ = 'America/Sao_Paulo'

/** Moeda BRL. Valor 0 ou negativo vira "—" (preço a confirmar). */
export function brl(n: number | null | undefined): string {
  if (n == null || n <= 0) return '—'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Igual ao brl, mas sempre mostra o número (inclusive 0,00) — para edição. */
export function brlAlways(n: number | null | undefined): string {
  const x = n ?? 0
  return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function fmtDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

export function clockTime(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
}

export function dayKey(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-CA', { timeZone: TZ }) // YYYY-MM-DD
}

export function relativeFromNow(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const dias = Math.floor(h / 24)
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias} dias`
  return fmtDateTime(iso)
}

/** Normaliza strings sujas do classificador ("null", "não informado") para vazio. */
export function cleanText(s?: string | null): string {
  if (!s) return ''
  const t = String(s).trim()
  if (!t) return ''
  const low = t.toLowerCase()
  if (['null', 'undefined', 'não informado', 'nao informado', 'n/a', '-'].includes(low)) return ''
  return t
}

export function fmtPhone(tel?: string | null): string {
  if (!tel) return '—'
  const d = tel.replace(/\D/g, '')
  const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  if (m) return `(${m[1]}) ${m[2]}-${m[3]}`
  const m2 = d.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (m2) return `(${m2[1]}) ${m2[2]}-${m2[3]}`
  return tel
}

export function iniciais(nome?: string | null, tel?: string | null): string {
  const n = cleanText(nome)
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean)
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  }
  const d = (tel ?? '').replace(/\D/g, '')
  return d.slice(-2) || '?'
}
