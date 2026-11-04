// Проверка логина и пароля через DummyJSON (POST /auth/login) и получение роли пользователя.
// Ответы API проверяются Zod-схемами. Токен DummyJSON нигде не сохраняется.
import 'server-only';
import { z } from 'zod';
import { env } from './env';
import type { Role } from './permissions';
import type { LoginInput } from './schemas';

const loginResponseSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().optional(),
});

// в DummyJSON три роли; модератор у нас получает права обычного пользователя
const userRoleSchema = z.object({ role: z.enum(['admin', 'moderator', 'user']) });

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
}

export async function loginWithDummyJson({ username, password }: LoginInput): Promise<AuthUser | null> {
  const res = await fetch(`${env.DUMMYJSON_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 400) return null; // неверный логин или пароль
  if (!res.ok) throw new Error(`DummyJSON ответил ошибкой ${res.status}`);
  const user = loginResponseSchema.parse(await res.json());

  const roleRes = await fetch(`${env.DUMMYJSON_URL}/users/${user.id}?select=role`);
  if (!roleRes.ok) throw new Error(`DummyJSON ответил ошибкой ${roleRes.status}`);
  const { role } = userRoleSchema.parse(await roleRes.json());

  return {
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    image: user.image,
    role: role === 'admin' ? 'admin' : 'user',
  };
}
