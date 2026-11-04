// Типы получены из Zod-схем через z.infer (lib/schemas.ts)
import type { Product, ProductFieldErrors } from './schemas';

export type { LoginInput, Product, ProductFieldErrors, ProductInput, ProductsPage } from './schemas';

// Результат Server Function: ошибки возвращаем явно, а не бросаем
export type ActionResult =
  | { ok: true; product: Product }
  | { ok: false; status: 400 | 401 | 403 | 404 | 500; error: string; fieldErrors?: ProductFieldErrors };
