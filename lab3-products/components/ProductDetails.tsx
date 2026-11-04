'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProductAction } from '@/app/products/actions';
import type { Role } from '@/lib/permissions';
import type { Product } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductActions } from './ProductActions';

export function ProductDetails({ product: initial, role }: { product: Product; role: Role | null }) {
  const router = useRouter();
  const updated = useProductsStore((s) => s.updated[initial.id]);
  const isDeleted = useProductsStore((s) => s.deletedIds.includes(initial.id));
  const markDeleted = useProductsStore((s) => s.markDeleted);
  const [error, setError] = useState('');
  const [isDeleting, startDeleting] = useTransition();

  const product = updated ? { ...initial, ...updated } : initial;
  const isLocal = product.id < 0; // добавлен в этой сессии, на сервере его нет

  if (isDeleted) {
    return (
      <div role="status" className="alert">
        <span>Товар удалён.</span>
        <Link href="/products" className="link">
          К списку товаров
        </Link>
      </div>
    );
  }

  // Удаление через Server Function; сервер ещё раз проверяет, что это администратор
  function handleDelete() {
    if (!confirm(`Удалить «${product.title}»?`)) return;
    setError('');
    if (isLocal) {
      markDeleted(product.id);
      router.push('/products');
      return;
    }
    startDeleting(async () => {
      try {
        const result = await deleteProductAction(product.id);
        if (!result.ok) throw new Error(result.error);
        markDeleted(product.id);
        router.push('/products');
      } catch (err) {
        setError(`Не удалось удалить: ${err instanceof Error ? err.message : 'нет связи с сервером'}`);
      }
    });
  }

  const image = product.images?.[0] ?? product.thumbnail;

  return (
    <section className="card bg-base-100 shadow-sm lg:card-side">
      <figure className="bg-base-200 lg:w-2/5">
        {image ? (
          <img src={image} alt={product.title} className="aspect-square w-full object-contain" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-base-content/50">Нет фото</div>
        )}
      </figure>
      <div className="card-body">
        <h1 className="card-title text-2xl">
          {product.title}
          {isLocal && <span className="badge badge-soft badge-primary">новый</span>}
        </h1>
        <p className="text-sm text-base-content/70">
          {product.brand && `${product.brand} · `}
          {product.category}
        </p>
        <p className="text-2xl font-bold text-success">${product.price}</p>
        <p>{product.description || 'Описание не указано'}</p>
        <p className="text-sm text-base-content/70">
          {product.rating !== undefined && `★ ${product.rating} · `}
          {product.stock > 0 ? `в наличии: ${product.stock} шт.` : 'нет в наличии'}
        </p>
        <ProductActions productId={product.id} role={role} onDelete={handleDelete} deleting={isDeleting} />
        {error && (
          <div role="alert" className="alert alert-error alert-soft">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
