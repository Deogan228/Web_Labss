'use server';
// Server Functions для добавления и удаления товара. Перед мутацией повторно проверяются
// права пользователя и данные (Zod) — проверке в браузере сервер не доверяет.
import { updateTag } from 'next/cache';
import { z } from 'zod';
import { ApiError, ValidationError, createProduct, deleteProduct, errorMessage } from '@/lib/products';
import { checkAccess } from '@/lib/session';
import type { ActionResult } from '@/lib/types';

function toErrorResult(error: unknown): ActionResult {
  if (error instanceof ValidationError) {
    return { ok: false, status: 400, error: error.message, fieldErrors: error.fieldErrors };
  }
  if (error instanceof ApiError && error.status === 404) return { ok: false, status: 404, error: 'Товар не найден' };
  return { ok: false, status: 500, error: errorMessage(error) };
}

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const access = await checkAccess('create');
  if (!access.ok) return { ok: false, status: access.status, error: access.error };
  try {
    const product = await createProduct(input);
    updateTag('products');
    return { ok: true, product };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteProductAction(id: unknown): Promise<ActionResult> {
  const access = await checkAccess('delete'); // удаление — только администратор
  if (!access.ok) return { ok: false, status: access.status, error: access.error };
  const parsedId = z.number().int().positive().safeParse(id);
  if (!parsedId.success) return { ok: false, status: 400, error: 'Некорректный id товара' };
  try {
    const product = await deleteProduct(parsedId.data);
    updateTag('products');
    return { ok: true, product };
  } catch (error) {
    return toErrorResult(error);
  }
}
