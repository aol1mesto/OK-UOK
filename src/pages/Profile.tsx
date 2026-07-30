import { currentUser } from '../data/mockUser'
import { ROLE_LABELS } from '../types/user'

export function Profile() {
  return (
    <div className="max-w-xl space-y-6">
      <p className="text-sm leading-relaxed text-brand-700">
        Основные сведения учётной записи сотрудника службы контроля качества.
      </p>

      <form
        className="space-y-4 border border-border bg-white p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-600">
            ФИО
          </span>
          <input
            defaultValue={currentUser.name}
            className="w-full border border-border bg-white px-3 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-600"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-600">
            Email
          </span>
          <input
            type="email"
            defaultValue={currentUser.email}
            className="w-full border border-border bg-white px-3 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-600"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-600">
            Должность
          </span>
          <input
            defaultValue={currentUser.position}
            className="w-full border border-border bg-white px-3 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-600"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-brand-600">
            Роль
          </span>
          <input
            value={ROLE_LABELS[currentUser.role]}
            readOnly
            className="w-full border border-border bg-brand-50 px-3 py-2.5 text-sm text-brand-700 outline-none"
          />
        </label>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-brand-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
          >
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  )
}
