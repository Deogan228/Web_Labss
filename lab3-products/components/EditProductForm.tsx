'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiErrorSchema } from '@/lib/schemas';
import type { Product, ProductInput } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductForm, productToFormValues } from './ProductForm';
import type { SubmitResult } from './ProductForm';

// Изменение товара через Route Handler PUT /api/products/[id].
// product — товар с сервера; если его нет (id < 0), товар берётся из store.
export function EditProductForm({ id, product }: { id: number; product?: Product }) {
  const router = useRouter();
  const local = useProductsStore((s) => s.created.find((p) => p.id === id));
  const updated = useProductsStore((s) => s.updated[id]);
  const saveUpdated = useProductsStore((s) => s.saveUpdated);

  const current = product ? { ...product, ...updated } : local;
  if (!current) {
    return (
      <div role="status" className="alert">
        <span>Товар не найден. Добавленные товары хранятся только до перезагрузки страницы.</span>
        <Link href="/products" className="link">
          К списку товаров
        </Link>
      </div>
    );
  }
  const base = current;

  async function handleSave(input: ProductInput): Promise<SubmitResult> {
    if (base.id > 0) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        // ответ с ошибкой тоже проверяем схемой: 400 — ошибки полей, 401/403 — нет доступа
        const body = apiErrorSchema.safeParse(await res.json().catch(() => null));
        return body.success ? body.data : { error: `Ошибка сервера (${res.status})` };
      }
    }
    // DummyJSON изменения не сохраняет, поэтому результат храним в store
    saveUpdated({ ...base, ...input });
    router.push(`/products/${id}`);
  }

  return (
    <ProductForm
      defaultValues={productToFormValues(base)}
      submitLabel="Сохранить"
      onSubmit={handleSave}
      onCancel={() => router.push(`/products/${id}`)}
    />
  );
}
