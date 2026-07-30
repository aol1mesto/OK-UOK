import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { currentUser } from '../../data/mockUser'

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': {
    title: 'Главная',
    subtitle: 'Сводка по проверкам и ключевым показателям',
  },
  '/inspections': {
    title: 'Мои проверки / Отчёты',
    subtitle: 'Список назначенных и выполненных проверок',
  },
  '/enterprises': {
    title: 'Предприятия',
    subtitle: 'Выбор и фильтр по предприятиям',
  },
  '/profile': {
    title: 'Настройки профиля',
    subtitle: 'Личные данные и параметры учётной записи',
  },
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Личный кабинет' }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        user={currentUser}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
