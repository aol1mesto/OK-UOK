import { useMemo, useState } from 'react'

const enterprises = [
  { id: '1', name: 'АО «Северсталь-Метиз»', region: 'Вологодская обл.', active: 4 },
  { id: '2', name: 'ООО «ТехПром Сервис»', region: 'Московская обл.', active: 2 },
  { id: '3', name: 'ПАО «Уралхим»', region: 'Пермский край', active: 3 },
  { id: '4', name: 'АО «Камский завод»', region: 'Республика Татарстан', active: 1 },
  { id: '5', name: 'ООО «ПромБезопасность»', region: 'Свердловская обл.', active: 0 },
]

export function Enterprises() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>('1')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return enterprises
    return enterprises.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q),
    )
  }, [query])

  const selected = enterprises.find((item) => item.id === selectedId) ?? null

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-brand-700">
        Фильтр доступен менеджерам и суперадминам. Выберите предприятие, чтобы
        ограничить данные дашборда и отчётов.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-600">
            Поиск
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название или регион"
            className="w-full border border-border bg-white px-3 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-600"
          />
        </label>

        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="border border-border bg-white px-4 py-2.5 text-sm font-medium text-brand-800 hover:bg-brand-50"
        >
          Сбросить фильтр
        </button>
      </div>

      {selected ? (
        <div className="border border-accent-600/30 bg-accent-50 px-4 py-3 text-sm text-accent-600">
          Активный фильтр: <span className="font-semibold">{selected.name}</span>
        </div>
      ) : (
        <div className="border border-border bg-white px-4 py-3 text-sm text-brand-600">
          Фильтр не выбран — отображаются данные по всем предприятиям.
        </div>
      )}

      <ul className="divide-y divide-border border border-border bg-white">
        {filtered.map((item) => {
          const active = item.id === selectedId
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
                  active ? 'bg-brand-50' : 'hover:bg-brand-50/60'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-brand-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-brand-600">{item.region}</p>
                </div>
                <span className="text-xs text-brand-600">
                  Активных: {item.active}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
