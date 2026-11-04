// Route Handler: HTTP API для одного товара. GET — открытый прокси к DummyJSON,
// PUT — изменение товара, DELETE — удаление (только администратор).
// Перед мутацией на сервере проверяются права (401/403) и данные (Zod, 400).
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ApiError, ValidationError, deleteProduct, errorMessage, getProduct, updateProduct } from '@/lib/products';
import { checkAccess } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

const idSchema = z.coerce.number().int().positive();

export async function GET(_request: Request, { params }: Context) {
  const id = idSchema.safeParse((await params).id);
  const product = id.success ? await getProduct(id.data) : null;
  if (!product) return Response.json({ error: 'Товар не найден' }, { status: 404 });
  return Response.json(product);
}

export async function PUT(request: Request, { params }: Context) {
  const access = await checkAccess('update');
  if (!access.ok) return Response.json({ error: access.error }, { status: access.status });

  const id = idSchema.safeParse((await params).id);
  if (!id.success) return Response.json({ error: 'Некорректный id товара' }, { status: 400 });

  // некорректный JSON превратится в null и не пройдёт Zod-проверку
  const body = await request.json().catch(() => null);
  try {
    const product = await updateProduct(id.data, body);
    revalidateTag('products', 'max');
    revalidateTag(`product-${id.data}`, 'max');
    return Response.json(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message, fieldErrors: error.fieldErrors }, { status: 400 });
    }
    const status = error instanceof ApiError ? error.status : 500;
    return Response.json({ error: errorMessage(error) }, { status });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const access = await checkAccess('delete'); // 401 — не вошёл, 403 — не администратор
  if (!access.ok) return Response.json({ error: access.error }, { status: access.status });

  const id = idSchema.safeParse((await params).id);
  if (!id.success) return Response.json({ error: 'Некорректный id товара' }, { status: 400 });
  try {
    const product = await deleteProduct(id.data);
    revalidateTag('products', 'max');
    return Response.json(product);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return Response.json({ error: errorMessage(error) }, { status });
  }
}
