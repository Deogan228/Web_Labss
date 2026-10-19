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
    <form className="search" onSubmit={handleSubmit}>
      {/* key пересоздаёт поле, когда запрос в адресе меняется извне */}
      <input key={query} name="q" type="search" defaultValue={query} placeholder="Поиск товаров…" />
      <button type="submit" disabled={pending}>
        Найти
      </button>
      {query && (
        <button type="button" className="secondary" onClick={() => navigate(productsUrl(''))} disabled={pending}>
          Сбросить
        </button>
      )}
      {pending && <span className="status">Загрузка…</span>}
    </form>
  );
}
