// Роли и права. Файл общий: интерфейс по нему скрывает кнопки,
// сервер по нему же проверяет доступ перед мутацией.
export type Role = 'user' | 'admin';
export type Action = 'create' | 'update' | 'delete';

const permissions: Record<Action, readonly Role[]> = {
  create: ['user', 'admin'],
  update: ['user', 'admin'],
  delete: ['admin'],
};

export function can(role: Role | null | undefined, action: Action): boolean {
  return role != null && permissions[action].includes(role);
}

export const ROLE_LABELS: Record<Role, string> = {
  user: 'пользователь',
  admin: 'администратор',
};
