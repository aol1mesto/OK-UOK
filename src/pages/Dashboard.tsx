const stats = [
  { label: 'Всего проверок', value: '128', hint: 'за текущий квартал' },
  { label: 'В работе', value: '14', hint: 'требуют завершения' },
  { label: 'Завершено', value: '97', hint: 'с оформленным отчётом' },
  { label: 'С замечаниями', value: '17', hint: 'нуждаются в контроле' },
]

const recent = [
  {
    id: 'ПР-2041',
    enterprise: 'АО «Северсталь-Метиз»',
    status: 'В работе',
    date: '28.07.2026',
  },
  {
    id: 'ПР-2038',
    enterprise: 'ООО «ТехПром Сервис»',
    status: 'Завершена',
    date: '26.07.2026',
  },
  {
    id: 'ПР-2035',
    enterprise: 'ПАО «Уралхим»',
    status: 'С замечаниями',
    date: '24.07.2026',
  },
]

function statusClass(status: string) {
  if (status === 'Завершена') return 'text-accent-600'
  if (status === 'С замечаниями') return 'text-amber-700'
  return 'text-brand-700'
}

export function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Статистика проверок
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="border border-border bg-white px-5 py-4"
            >
              <p className="text-sm text-brand-600">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-brand-500">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Последние проверки
          </h2>
        </div>

        <div className="mt-4 overflow-hidden border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-brand-50 text-brand-700">
              <tr>
                <th className="px-4 py-3 font-medium">Номер</th>
                <th className="px-4 py-3 font-medium">Предприятие</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-900">{row.id}</td>
                  <td className="px-4 py-3 text-brand-700">{row.enterprise}</td>
                  <td className={`px-4 py-3 font-medium ${statusClass(row.status)}`}>
                    {row.status}
                  </td>
                  <td className="px-4 py-3 text-brand-600">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
