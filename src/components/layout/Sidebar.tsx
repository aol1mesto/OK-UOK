import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  UserRound,
  ShieldCheck,
} from 'lucide-react'
import type { User } from '../../types/user'
import { ROLE_LABELS } from '../../types/user'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  roles?: User['role'][]
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Главная',
    icon: LayoutDashboard,
  },
  {
    to: '/inspections',
    label: 'Мои проверки',
    icon: ClipboardList,
  },
  {
    to: '/enterprises',
    label: 'Предприятия',
    icon: Building2,
    roles: ['manager', 'superadmin'],
  },
  {
    to: '/profile',
    label: 'Настройки профиля',
    icon: UserRound,
  },
]

interface SidebarProps {
  user: User
  open: boolean
  onClose: () => void
}

export function Sidebar({ user, open, onClose }: SidebarProps) {
  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  )

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-brand-950/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-900 text-brand-100 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-accent-600 text-white">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                ОК-УОК
              </p>
              <p className="text-xs text-brand-500">Контроль качества</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Основная навигация">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-brand-100/80 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="mt-0.5 text-xs text-brand-500">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
      </aside>
    </>
  )
}
