// Проверка переменных окружения (внешняя граница). Ошибка видна сразу при запуске,
// а не при первом запросе. Переменные без NEXT_PUBLIC_ не попадают в браузер.
import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET должен быть не короче 32 символов (см. .env.example)'),
  DUMMYJSON_URL: z.url().default('https://dummyjson.com'),
});

export const env = envSchema.parse(process.env);
