// Route Handler: HTTP API для одного товара. GET — прокси к DummyJSON, PUT — изменение товара.
import { revalidateTag } from 'next/cache';
import { ApiError, ValidationError, errorMessage, getProduct, updateProduct } from '@/lib/products';

type Context = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, { params }: Context) {
  const id = parseId((await params).id);
  const product = id ? await getProduct(id) : null;
  if (!product) return Response.json({ error: 'Товар не найден' }, { status: 404 });
  return Response.json(product);
}

export async function PUT(request: Request, { params }: Context) {
  const id = parseId((await params).id);
  if (!id) return Response.json({ error: 'Некорректный id' }, { status: 400 });

  // некорректный JSON превратится в null и не пройдёт проверку данных
  const body = await request.json().catch(() => null);
  try {
    const product = await updateProduct(id, body);
    // данные изменились — помечаем кэш списка и карточки устаревшим
    revalidateTag('products', 'max');
    revalidateTag(`product-${id}`, 'max');
    return Response.json(product);
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : error instanceof ApiError ? error.status : 500;
    return Response.json({ error: errorMessage(error) }, { status });
  }
}
