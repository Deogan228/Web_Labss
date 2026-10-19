// Модель товара по мотивам https://dummyjson.com/docs/products (взята часть полей)
export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  rating?: number;
  thumbnail?: string;
  images?: string[];
}

// То, что заполняется в форме добавления и редактирования
export interface ProductInput {
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
}

// Ответ DummyJSON на запрос списка
export interface ProductsPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Результат Server Function: ошибки возвращаем явно, а не бросаем
export type ActionResult = { ok: true; product: Product } | { ok: false; error: string };
