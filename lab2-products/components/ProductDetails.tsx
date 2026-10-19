'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProductAction } from '@/app/products/actions';
import type { Product, ProductInput } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductForm } from './ProductForm';

export function ProductDetails({ product: initial }: { product: Product }) {
  const router = useRouter();
  const updated = useProductsStore((s) => s.updated[initial.id]);
  const isDeleted = useProductsStore((s) => s.deletedIds.includes(initial.id));
  const saveUpdated = useProductsStore((s) => s.saveUpdated);
  const clearUpdated = useProductsStore((s) => s.clearUpdated);
  const markDeleted = useProductsStore((s) => s.markDeleted);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const product = updated ? { ...initial, ...updated } : initial;
  const isLocal = product.id < 0; // добавлен в этой сессии, на сервере его нет

  if (isDeleted) {
    return (
      <div className="empty">
        <p>Товар удалён.</p>
        <Link href="/products">← К списку товаров</Link>
      </div>
    );
  }

  // Изменение через Route Handler с оптимистичным обновлением:
  // новые данные показываем сразу, а при ошибке возвращаем старые.
  function handleSave(input: ProductInput) {
    const previous = updated;
    setError('');
    setEditing(false);
    saveUpdated({ ...product, ...input });
    if (isLocal) return;

    startSaving(async () => {
      try {
        const res = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `ошибка ${res.status}`);
        }
      } catch (err) {
        // откат: возвращаем то, что было до изменения
        if (previous) saveUpdated(previous);
        else clearUpdated(product.id);
        setError(`Изменения не сохранены: ${err instanceof Error ? err.message : 'нет связи с сервером'}`);
      }
    });
  }

  // Удаление через Server Function
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

  if (editing) {
    return (
      <section className="details">
        <h1>Редактирование</h1>
        <ProductForm
          initial={{
            title: product.title,
            description: product.description ?? '',
            category: product.category,
            brand: product.brand ?? '',
            price: product.price,
            stock: product.stock,
          }}
          submitLabel="Сохранить"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </section>
    );
  }

  const image = product.images?.[0] ?? product.thumbnail;

  return (
    <section className="details">
      {image ? <img src={image} alt={product.title} className="details-image" /> : <div className="details-image card-image-empty">Нет фото</div>}
      <div className="details-info">
        <h1>
          {product.title} {isLocal && <span className="badge">новый</span>}
        </h1>
        <p className="muted">
          {product.brand && `${product.brand} · `}
          {product.category}
        </p>
        <p className="price big">${product.price}</p>
        <p>{product.description || 'Описание не указано'}</p>
        <p className="muted">
          {product.rating !== undefined && `★ ${product.rating} · `}
          {product.stock > 0 ? `в наличии: ${product.stock} шт.` : 'нет в наличии'}
        </p>

        <div className="actions">
          <button onClick={() => setEditing(true)} disabled={isDeleting || isSaving}>
            Редактировать
          </button>
          <button className="danger" onClick={handleDelete} disabled={isDeleting || isSaving}>
            {isDeleting ? 'Удаление…' : 'Удалить'}
          </button>
          {isSaving && <span className="status">Сохранение…</span>}
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
