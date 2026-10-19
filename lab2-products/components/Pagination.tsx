'use client';
import { usePendingNavigation } from '@/hooks/usePendingNavigation';
import { productsUrl } from '@/lib/urls';
import { useProductsStore } from '@/store/ProductsStoreProvider';

interface PaginationProps {
  page: number;
  totalPages: number;
  query: string;
}

export function Pagination({ page, totalPages, query }: PaginationProps) {
  const navigate = usePendingNavigation();
  const pending = useProductsStore((s) => s.pending);

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Страницы списка">
      <button onClick={() => navigate(productsUrl(query, page - 1))} disabled={page <= 1 || pending}>
        ← Назад
      </button>
      <span className={pending ? 'status' : undefined}>
        {pending ? 'Загрузка…' : `Страница ${page} из ${totalPages}`}
      </span>
      <button onClick={() => navigate(productsUrl(query, page + 1))} disabled={page >= totalPages || pending}>
        Вперёд →
      </button>
    </nav>
  );
}
