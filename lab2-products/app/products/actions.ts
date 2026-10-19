'use server';
// Server Functions для добавления и удаления товара. Вызывают те же функции из lib, что и Route Handler.
import { updateTag } from 'next/cache';
import { createProduct, deleteProduct, errorMessage } from '@/lib/products';
import type { ActionResult, ProductInput } from '@/lib/types';

export async function createProductAction(input: ProductInput): Promise<ActionResult> {
  try {
    const product = await createProduct(input);
    // данные изменились — сбрасываем кэш списка (updateTag работает только в Server Actions)
    updateTag('products');
    return { ok: true, product };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function deleteProductAction(id: number): Promise<ActionResult> {
  // Server Function можно вызвать запросом извне, поэтому входные данные проверяем
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: 'Некорректный id' };
  try {
    const product = await deleteProduct(id);
    updateTag('products');
    return { ok: true, product };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
