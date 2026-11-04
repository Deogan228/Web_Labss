'use client';
import Link from 'next/link';
import type { Role } from '@/lib/permissions';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductDetails } from './ProductDetails';

// Товар, добавленный в этой сессии: на сервере DummyJSON его нет, берём из store
export function LocalProduct({ id, role }: { id: number; role: Role | null }) {
  const product = useProductsStore((s) => s.created.find((p) => p.id === id));

  if (!product) {
    return (
      <div role="status" className="alert">
        <span>Товар не найден. Добавленные товары хранятся только до перезагрузки страницы.</span>
        <Link href="/products" className="link">
          К списку товаров
        </Link>
      </div>
    );
  }
  return <ProductDetails key={product.id} product={product} role={role} />;
}
