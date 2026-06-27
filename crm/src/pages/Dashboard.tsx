import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes, useClientesRealtime } from '@/hooks/useClientes'
import { Card, PageHeader, Loading, Avatar } from '@/components/ui'
import { dayKey, cleanText, relativeFromNow, iniciais, fmtPhone } from '@/lib/format'
import { Users, CalendarClock, CalendarRange, PauseCircle, UserCheck } from 'lucide-react'

function todaySP(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}
function lastDays(n: number): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    out.push(d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }))
  }
  return out
}

function Kpi({ icon, label, value, hue }: { icon: React.ReactNode; label: string; value: number; hue?: number }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-4 py-3.5 sm:px-5">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `oklch(0.66 0.14 ${hue ?? 36} / 0.14)`, color: `oklch(0.45 0.13 ${hue ?? 36})` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="num text-xl font-semibold leading-none">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  useClientesRealtime()
  const navigate = useNavigate()
  const { data: clientes, isLoading } = useClientes()

  const stats = useMemo(() => {
    const list = clientes ?? []
    const hoje = todaySP()
    const days7 = new Set(lastDays(7))
    const days14 = lastDays(14)

    const porDia = days14.map((d) => ({
      d,
      n: list.filter((c) => dayKey(c.ultima_interacao) === d).length,
    }))
    const maxDia = Math.max(1, ...porDia.map((x) => x.n))

    const interesses = new Map<string, number>()
    for (const c of list) {
      const i = cleanText(c.interesse)
      if (!i) continue
      const k = i.charAt(0).toUpperCase() + i.slice(1)
      interesses.set(k, (interesses.get(k) ?? 0) + 1)
    }
    const topInteresses = [...interesses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)

    return {
      total: list.length,
      hoje: list.filter((c) => dayKey(c.ultima_interacao) === hoje).length,
      semana: list.filter((c) => days7.has(dayKey(c.ultima_interacao))).length,
      comNome: list.filter((c) => cleanText(c.nome)).length,
      pausados: list.filter((c) => c.pausar_ia).length,
      porDia,
      maxDia,
      topInteresses,
      recentes: list.slice(0, 8),
    }
  }, [clientes])

  if (isLoading) return <Loading />

  return (
    <div>
      <PageHeader title="Painel" subtitle="Visão geral do atendimento da Nanda" />

      {/* KPIs em faixa única segmentada */}
      <Card className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
        <Kpi icon={<Users className="h-[18px] w-[18px]" />} label="Clientes" value={stats.total} hue={158} />
        <Kpi icon={<CalendarClock className="h-[18px] w-[18px]" />} label="Atendidos hoje" value={stats.hoje} hue={235} />
        <Kpi icon={<CalendarRange className="h-[18px] w-[18px]" />} label="Últimos 7 dias" value={stats.semana} hue={150} />
        <Kpi icon={<UserCheck className="h-[18px] w-[18px]" />} label="Com nome" value={stats.comNome} hue={85} />
        <Kpi icon={<PauseCircle className="h-[18px] w-[18px]" />} label="IA pausada" value={stats.pausados} hue={25} />
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Atendimentos por dia */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Atendimentos por dia</h2>
          <p className="text-xs text-muted-foreground">Últimos 14 dias</p>
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {stats.porDia.map((x) => (
              <div key={x.d} className="group flex flex-1 flex-col items-center justify-end gap-1.5" title={`${x.d}: ${x.n}`}>
                <div className="num text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">{x.n || ''}</div>
                <div
                  className="w-full rounded-t bg-primary/80 transition-all group-hover:bg-primary"
                  style={{ height: `${(x.n / stats.maxDia) * 100}%`, minHeight: x.n ? 4 : 2, opacity: x.n ? 1 : 0.25 }}
                />
                <div className="text-[10px] text-muted-foreground">{x.d.slice(8)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Interesses mais comuns */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Interesses mais comuns</h2>
          <div className="mt-4 space-y-2.5">
            {stats.topInteresses.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            )}
            {stats.topInteresses.map(([nome, n]) => {
              const w = (n / stats.topInteresses[0][1]) * 100
              return (
                <div key={nome}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{nome}</span>
                    <span className="num text-muted-foreground">{n}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${w}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recentes */}
      <Card className="mt-5 p-1.5">
        <div className="px-3.5 pb-1 pt-3 text-sm font-semibold">Últimos atendimentos</div>
        <div className="divide-y divide-border">
          {stats.recentes.map((c) => (
            <button
              key={c.telefone}
              onClick={() => navigate(`/atendimentos/${c.telefone}`)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-secondary/60"
            >
              <Avatar initials={iniciais(c.nome, c.telefone)} size={36} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{cleanText(c.nome) || fmtPhone(c.telefone)}</div>
                <div className="truncate text-xs text-muted-foreground">{cleanText(c.interesse) || 'Sem interesse registrado'}</div>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">{relativeFromNow(c.ultima_interacao)}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
