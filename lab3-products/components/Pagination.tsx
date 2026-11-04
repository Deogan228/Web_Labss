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
    <nav aria-label="Страницы списка" className="flex justify-center">
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => navigate(productsUrl(query, page - 1))} disabled={page <= 1 || pending}>
          ← Назад
        </button>
        <span className="px-3 text-sm">
          {pending ? 'Загрузка…' : `Страница ${page} из ${totalPages}`}
        </span>
        <button className="btn" onClick={() => navigate(productsUrl(query, page + 1))} disabled={page >= totalPages || pending}>
          Вперёд →
        </button>
      </div>
    </nav>
  );
}
