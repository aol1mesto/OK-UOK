export type UserRole = 'inspector' | 'manager' | 'superadmin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  position: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  inspector: 'Инспектор',
  manager: 'Менеджер',
  superadmin: 'Суперадмин',
}

export function canFilterEnterprises(role: UserRole): boolean {
  return role === 'manager' || role === 'superadmin'
}
