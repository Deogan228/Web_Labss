// Проверка доступа на сервере. Используется в страницах, Server Functions и Route Handler —
// скрытие кнопок в интерфейсе само по себе ничего не защищает.
import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { auth } from '@/auth';
import { can } from './permissions';
import type { Action } from './permissions';

export async function getCurrentUser() {
  // сессия читается при каждом запросе: Auth.js сверяет срок действия по текущему времени
  await connection();
  const session = await auth();
  return session?.user ?? null;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export type AccessResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; status: 401 | 403; error: string };

// 401 — пользователь не вошёл, 403 — вошёл, но прав на действие нет
export async function checkAccess(action: Action): Promise<AccessResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, status: 401, error: 'Войдите в систему, чтобы выполнить это действие' };
  if (!can(user.role, action)) {
    return {
      ok: false,
      status: 403,
      error: action === 'delete' ? 'Удалять товары может только администратор' : 'Недостаточно прав',
    };
  }
  return { ok: true, user };
}

// Для страниц: анонимного пользователя отправляем на страницу входа
export async function requireUser(callbackUrl: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}
