// Текущий пользователь в шапке (серверный компонент: читает сессию из cookie)
import Link from 'next/link';
import { logoutAction } from '@/app/login/actions';
import { ROLE_LABELS } from '@/lib/permissions';
import { getCurrentUser } from '@/lib/session';

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" className="btn btn-primary btn-sm">
        Войти
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <div className="text-sm font-medium">{user.name}</div>
        <span className="badge badge-soft badge-primary badge-sm">{ROLE_LABELS[user.role]}</span>
      </div>
      <form action={logoutAction}>
        <button type="submit" className="btn btn-ghost btn-sm">
          Выйти
        </button>
      </form>
    </div>
  );
}
