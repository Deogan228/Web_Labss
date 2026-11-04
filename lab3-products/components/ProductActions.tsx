import Link from 'next/link';
import { can } from '@/lib/permissions';
import type { Role } from '@/lib/permissions';

interface ProductActionsProps {
  productId: number;
  role: Role | null; // null — пользователь не вошёл
  onDelete: () => void;
  deleting?: boolean;
}

// Действия с товаром: недоступные текущей роли кнопки не показываются
export function ProductActions({ productId, role, onDelete, deleting = false }: ProductActionsProps) {
  if (!role) {
    return (
      <p className="text-sm text-base-content/70">
        <Link href={`/login?callbackUrl=/products/${productId}`} className="link link-primary">
          Войдите
        </Link>
        , чтобы изменить товар
      </p>
    );
  }

  return (
    <div className="card-actions items-center">
      {can(role, 'update') && (
        <Link href={`/products/${productId}/edit`} className="btn btn-primary">
          Редактировать
        </Link>
      )}
      {can(role, 'delete') && (
        <button type="button" className="btn btn-error btn-outline" onClick={onDelete} disabled={deleting}>
          {deleting && <span className="loading loading-spinner loading-sm" />}
          {deleting ? 'Удаление…' : 'Удалить'}
        </button>
      )}
    </div>
  );
}
