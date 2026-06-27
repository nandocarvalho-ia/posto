import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card shadow-card', className)}>{children}</div>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 pb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Dot({ hue, className }: { hue: number; className?: string }) {
  return (
    <span
      className={cn('inline-block h-2 w-2 shrink-0 rounded-full', className)}
      style={{ background: `oklch(0.66 0.15 ${hue})` }}
    />
  )
}

export function Badge({ hue, children }: { hue: number; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `oklch(0.66 0.15 ${hue} / 0.12)`,
        color: `oklch(0.45 0.13 ${hue})`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `oklch(0.62 0.16 ${hue})` }} />
      {children}
    </span>
  )
}

export function Avatar({ initials, hue = 150, size = 40 }: { initials: string; hue?: number; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold uppercase"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `oklch(0.92 0.04 ${hue})`,
        color: `oklch(0.45 0.13 ${hue})`,
      }}
    >
      {initials}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-muted-foreground', className)} />
}

export function Loading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Spinner /> {label}
    </div>
  )
}

export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {icon && <div className="text-muted-foreground/60">{icon}</div>}
      <p className="font-medium text-foreground">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-md px-3 py-2 text-sm"
      style={{ background: 'oklch(0.58 0.2 25 / 0.1)', color: 'oklch(0.45 0.18 25)' }}
    >
      {children}
    </div>
  )
}
