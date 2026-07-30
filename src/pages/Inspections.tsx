const inspections = [
  {
    id: 'ПР-2041',
    enterprise: 'АО «Северсталь-Метиз»',
    type: 'Плановая',
    status: 'В работе',
    deadline: '05.08.2026',
  },
  {
    id: 'ПР-2038',
    enterprise: 'ООО «ТехПром Сервис»',
    type: 'Внеплановая',
    status: 'Завершена',
    deadline: '26.07.2026',
  },
  {
    id: 'ПР-2035',
    enterprise: 'ПАО «Уралхим»',
    type: 'Плановая',
    status: 'С замечаниями',
    deadline: '24.07.2026',
  },
  {
    id: 'ПР-2029',
    enterprise: 'АО «Камский завод»',
    type: 'Документарная',
    status: 'Завершена',
    deadline: '18.07.2026',
  },
]

export function Inspections() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-brand-700">
        Раздел отчётов и назначенных проверок. Здесь отображаются ваши текущие
        задачи, статусы и сроки подготовки материалов.
      </p>

      <div className="overflow-hidden border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-brand-50 text-brand-700">
            <tr>
              <th className="px-4 py-3 font-medium">Номер</th>
              <th className="px-4 py-3 font-medium">Предприятие</th>
              <th className="px-4 py-3 font-medium">Тип</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Срок</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-brand-900">{item.id}</td>
                <td className="px-4 py-3 text-brand-700">{item.enterprise}</td>
                <td className="px-4 py-3 text-brand-700">{item.type}</td>
                <td className="px-4 py-3 text-brand-800">{item.status}</td>
                <td className="px-4 py-3 text-brand-600">{item.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
