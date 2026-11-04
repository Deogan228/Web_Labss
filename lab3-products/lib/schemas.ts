// Zod-схемы предметной области. Файл общий для браузера и сервера:
// форма проверяет данные для удобства, сервер — повторно перед мутацией.
import { z } from 'zod';

// Категории товаров DummyJSON (GET /products/category-list)
export const CATEGORIES = [
  'beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration', 'kitchen-accessories',
  'laptops', 'mens-shirts', 'mens-shoes', 'mens-watches', 'mobile-accessories', 'motorcycle',
  'skin-care', 'smartphones', 'sports-accessories', 'sunglasses', 'tablets', 'tops', 'vehicle',
  'womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches',
] as const;

// Правило предметной области: у электроники и часов бренд обязателен
export const BRAND_REQUIRED_CATEGORIES: readonly string[] = [
  'laptops', 'smartphones', 'tablets', 'mobile-accessories', 'mens-watches', 'womens-watches',
];

export const categorySchema = z.enum(CATEGORIES, { error: 'Выберите категорию из списка' });

// ---------- создание и изменение товара ----------

export const productInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Название должно быть не короче 2 символов')
      .max(100, 'Название должно быть не длиннее 100 символов'),
    description: z.string().trim().max(500, 'Описание должно быть не длиннее 500 символов'),
    category: categorySchema,
    brand: z.string().trim().max(50, 'Бренд должен быть не длиннее 50 символов'),
    price: z
      .number({ error: 'Укажите цену числом' })
      .positive('Цена должна быть больше 0')
      .max(100_000, 'Цена не может быть больше 100 000 $'),
    stock: z
      .number({ error: 'Укажите количество числом' })
      .int('Количество должно быть целым числом')
      .min(0, 'Количество не может быть отрицательным'),
  })
  .refine((p) => !BRAND_REQUIRED_CATEGORIES.includes(p.category) || p.brand.length > 0, {
    message: 'Для электроники и часов укажите бренд',
    path: ['brand'],
  });

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductFieldErrors = Partial<Record<keyof ProductInput, string[]>>;

// ---------- ответы DummyJSON (внешняя граница) ----------

export const productSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  brand: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  rating: z.number().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof productSchema>;

export const productsPageSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int(),
  limit: z.number().int(),
});

export type ProductsPage = z.infer<typeof productsPageSchema>;

// ---------- параметры адреса списка (внешняя граница) ----------

// неверные значения не ломают страницу, а заменяются значениями по умолчанию
export const productsSearchSchema = z.object({
  q: z.string().trim().max(100).catch(''),
  page: z.coerce.number().int().min(1).catch(1),
});

// ---------- ответ Route Handler с ошибкой (проверяется в браузере) ----------

export const apiErrorSchema = z.object({
  error: z.string(),
  fieldErrors: z.partialRecord(productInputSchema.keyof(), z.array(z.string())).optional(),
});

// ---------- вход ----------

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// адрес возврата после входа: только путь внутри сайта, чтобы не было открытого редиректа
export const callbackUrlSchema = z
  .string()
  .startsWith('/')
  .refine((url) => !url.startsWith('//'))
  .catch('/products');
