import { Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-white">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center border border-border text-brand-800 lg:hidden"
          aria-label="Открыть меню"
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-brand-900 sm:text-xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-brand-600">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
