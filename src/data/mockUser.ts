import type { User } from '../types/user'

/** Демо-пользователь. Смените role на 'inspector', чтобы скрыть фильтр предприятий. */
export const currentUser: User = {
  id: '1',
  name: 'Иванова Е.А.',
  email: 'e.ivanova@ok-uok.ru',
  role: 'manager',
  position: 'Специалист службы контроля качества',
}
