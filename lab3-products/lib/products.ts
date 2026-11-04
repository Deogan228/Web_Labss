// Слой работы с DummyJSON. Его вызывают и страницы, и Route Handler, и Server Functions,
// поэтому бизнес-логика (запросы, проверка данных) не дублируется.
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import { env } from './env';
import { productInputSchema, productSchema, productsPageSchema } from './schemas';
import type { Product, ProductFieldErrors, ProductsPage } from './schemas';

const API = `${env.DUMMYJSON_URL}/products`;
export const PAGE_SIZE = 12;
const LIST_FIELDS = 'title,price,category,brand,rating,stock,thumbnail';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Данные не прошли Zod-проверку на сервере
export class ValidationError extends Error {
  constructor(public fieldErrors: ProductFieldErrors) {
    super('Проверьте правильность заполнения полей');
  }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

// Запрос к DummyJSON: ответ проверяется Zod-схемой, а не принимается «на веру»
async function request<T>(url: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new ApiError(res.status, `DummyJSON ответил ошибкой ${res.status}`);
  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) throw new ApiError(502, 'DummyJSON вернул данные в неожиданном формате');
  return parsed.data;
}

// ---------- чтение (кэшируется) ----------

export async function getProducts(query: string, page: number): Promise<ProductsPage> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products');

  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
    select: LIST_FIELDS,
  });
  if (query) params.set('q', query);
  return request(`${API}${query ? '/search' : ''}?${params}`, productsPageSchema);
}

export async function getProduct(id: number): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', `product-${id}`);

  try {
    return await request(`${API}/${id}`, productSchema);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// ---------- изменение ----------

// Серверная проверка данных той же схемой, что и в форме
function validate(raw: unknown) {
  const parsed = productInputSchema.safeParse(raw);
  if (!parsed.success) throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  return parsed.data;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export async function createProduct(raw: unknown): Promise<Product> {
  return request(`${API}/add`, productSchema, jsonInit('POST', validate(raw)));
}

export async function updateProduct(id: number, raw: unknown): Promise<Product> {
  return request(`${API}/${id}`, productSchema, jsonInit('PUT', validate(raw)));
}

export async function deleteProduct(id: number): Promise<Product> {
  return request(`${API}/${id}`, productSchema, { method: 'DELETE' });
}
