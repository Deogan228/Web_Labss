'use client';
import type { FormEvent } from 'react';
import { usePendingNavigation } from '@/hooks/usePendingNavigation';
import { productsUrl } from '@/lib/urls';
import { useProductsStore } from '@/store/ProductsStoreProvider';

export function SearchBar({ query }: { query: string }) {
  const navigate = usePendingNavigation();
  const pending = useProductsStore((s) => s.pending);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get('q') ?? '').trim();
    navigate(productsUrl(q));
  }

  return (
    // action="/products": до загрузки JS поиск работает обычной отправкой формы
    <form role="search" action="/products" className="flex items-center gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        {/* key пересоздаёт поле, когда запрос в адресе меняется извне */}
        <input key={query} name="q" type="search" defaultValue={query} placeholder="Поиск товаров…" aria-label="Поиск товаров" className="input w-64" />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          Найти
        </button>
      </div>
      {query && (
        <button type="button" className="btn btn-ghost" onClick={() => navigate(productsUrl(''))} disabled={pending}>
          Сбросить
        </button>
      )}
      {pending && <span className="loading loading-spinner loading-sm" aria-label="Загрузка" />}
    </form>
  );
}
