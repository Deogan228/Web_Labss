// Слой работы с DummyJSON. Его вызывают и страницы, и Route Handler, и Server Functions,
// поэтому бизнес-логика (запросы, проверка данных) не дублируется.
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import type { Product, ProductInput, ProductsPage } from './types';

// Адрес API можно переопределить переменной окружения. Без префикса NEXT_PUBLIC_
// она доступна только на сервере и не попадает в браузер.
const API = `${process.env.DUMMYJSON_URL ?? 'https://dummyjson.com'}/products`;
export const PAGE_SIZE = 12;
const LIST_FIELDS = 'title,price,category,brand,rating,stock,thumbnail';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export class ValidationError extends Error {}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new ApiError(res.status, `DummyJSON ответил ошибкой ${res.status}`);
  return res.json();
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
  return request<ProductsPage>(`${API}${query ? '/search' : ''}?${params}`);
}

export async function getProduct(id: number): Promise<Product | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('products', `product-${id}`);

  const res = await fetch(`${API}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, `DummyJSON ответил ошибкой ${res.status}`);
  return res.json();
}

// ---------- изменение ----------

// Общая проверка данных формы — для Route Handler и Server Function
export function parseProductInput(raw: unknown): ProductInput {
  const data = (raw ?? {}) as Record<string, unknown>;
  const input: ProductInput = {
    title: String(data.title ?? '').trim(),
    description: String(data.description ?? '').trim(),
    category: String(data.category ?? '').trim(),
    brand: String(data.brand ?? '').trim(),
    price: Number(data.price),
    stock: Number(data.stock),
  };
  if (!input.title) throw new ValidationError('Укажите название');
  if (!input.category) throw new ValidationError('Укажите категорию');
  if (!(input.price >= 0)) throw new ValidationError('Цена должна быть неотрицательным числом');
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new ValidationError('Количество должно быть целым неотрицательным числом');
  }
  return input;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export async function createProduct(raw: unknown): Promise<Product> {
  return request<Product>(`${API}/add`, jsonInit('POST', parseProductInput(raw)));
}

export async function updateProduct(id: number, raw: unknown): Promise<Product> {
  return request<Product>(`${API}/${id}`, jsonInit('PUT', parseProductInput(raw)));
}

export async function deleteProduct(id: number): Promise<Product> {
  return request<Product>(`${API}/${id}`, { method: 'DELETE' });
}
