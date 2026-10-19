'use client';
import Link from 'next/link';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductDetails } from './ProductDetails';

// Товар, добавленный в этой сессии: на сервере DummyJSON его нет, берём из store
export function LocalProduct({ id }: { id: number }) {
  const product = useProductsStore((s) => s.created.find((p) => p.id === id));

  if (!product) {
    return (
      <div className="empty">
        <p>Товар не найден. Добавленные товары хранятся только до перезагрузки страницы.</p>
        <Link href="/products">← К списку товаров</Link>
      </div>
    );
  }
  return <ProductDetails key={product.id} product={product} />;
}
