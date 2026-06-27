import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessagesSquare,
  KanbanSquare,
  Fuel,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/atendimentos', label: 'Atendimentos', icon: MessagesSquare, end: false },
  { to: '/kanban', label: 'Kanban', icon: KanbanSquare, end: false },
  { to: '/precos', label: 'Preços', icon: Fuel, end: false },
  { to: '/autorizados', label: 'Autorizados', icon: ShieldCheck, end: false },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )
          }
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <div className="px-4 py-5">
      <div className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
        <img src="/logo.png" alt="Posto Carvalho" className="h-9 w-auto" />
      </div>
      <div className="mt-2 px-0.5 text-xs font-medium text-sidebar-muted">Painel da Nanda</div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <Brand />
        <NavItems />
        <div className="mt-auto px-5 py-4 text-xs text-sidebar-muted">
          BR-116, km 698 · Jequié-BA
        </div>
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar shadow-lift">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button onClick={() => setOpen(false)} className="text-sidebar-muted hover:text-sidebar-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavItems onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menu" className="text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold">{current?.label ?? 'Painel'}</span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
