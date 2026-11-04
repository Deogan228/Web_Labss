'use client';
import { useRouter } from 'next/navigation';
import { createProductAction } from '@/app/products/actions';
import type { ProductInput } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductForm } from './ProductForm';
import type { SubmitResult } from './ProductForm';

export function CreateProductForm() {
  const router = useRouter();
  const addCreated = useProductsStore((s) => s.addCreated);

  async function handleCreate(input: ProductInput): Promise<SubmitResult> {
    const result = await createProductAction(input); // Server Function: сервер проверит права и данные
    if (!result.ok) return { error: result.error, fieldErrors: result.fieldErrors };
    // DummyJSON всегда возвращает id 195, поэтому даём свой уникальный отрицательный id
    addCreated({ ...result.product, id: -Date.now() });
    router.push('/products');
  }

  return <ProductForm submitLabel="Добавить" onSubmit={handleCreate} onCancel={() => router.push('/products')} />;
}
