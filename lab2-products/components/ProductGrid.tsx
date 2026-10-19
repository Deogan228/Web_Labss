'use client';
import type { Product } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[]; // страница товаров с сервера
  total: number;       // сколько товаров нашёл сервер
  query: string;
  page: number;
}

export function ProductGrid({ products, total, query, page }: ProductGridProps) {
  const created = useProductsStore((s) => s.created);
  const updated = useProductsStore((s) => s.updated);
  const deletedIds = useProductsStore((s) => s.deletedIds);
  const pending = useProductsStore((s) => s.pending);

  // добавленные товары (с учётом поиска) показываем на первой странице
  const createdVisible = created.filter(
    (p) => !deletedIds.includes(p.id) && p.title.toLowerCase().includes(query.toLowerCase()),
  );
  const visible = [...(page === 1 ? createdVisible : []), ...products]
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => (updated[p.id] ? { ...p, ...updated[p.id] } : p));

  // итог с учётом локальных изменений (удалённые учитываем, только когда нет поиска)
  const deletedFromServer = query ? 0 : deletedIds.filter((id) => id > 0).length;
  const count = total + createdVisible.length - deletedFromServer;

  return (
    <>
      <p className="muted">Найдено товаров: {count}</p>
      {visible.length === 0 ? (
        <div className="empty">
          <p>{query ? `По запросу «${query}» ничего не найдено` : 'Товаров пока нет'}</p>
        </div>
      ) : (
        <div className={pending ? 'grid grid-stale' : 'grid'} aria-busy={pending}>
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
