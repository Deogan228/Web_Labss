'use client';
import { useRouter } from 'next/navigation';
import { createProductAction } from '@/app/products/actions';
import type { ProductInput } from '@/lib/types';
import { useProductsStore } from '@/store/ProductsStoreProvider';
import { ProductForm } from './ProductForm';

export function CreateProductForm() {
  const router = useRouter();
  const addCreated = useProductsStore((s) => s.addCreated);

  async function handleCreate(input: ProductInput) {
    const result = await createProductAction(input); // Server Function
    if (!result.ok) throw new Error(result.error);
    // DummyJSON всегда возвращает id 195, поэтому даём свой уникальный отрицательный id
    addCreated({ ...result.product, id: -Date.now() });
    router.push('/products');
  }

  return <ProductForm submitLabel="Добавить" onSubmit={handleCreate} onCancel={() => router.push('/products')} />;
}
