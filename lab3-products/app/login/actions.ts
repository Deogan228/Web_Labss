'use server';
// Вход и выход через Auth.js
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { callbackUrlSchema, loginSchema } from '@/lib/schemas';

export async function loginAction(input: unknown, callbackUrl: unknown): Promise<{ error: string } | undefined> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: 'Введите логин и пароль' };
  try {
    // при успехе signIn выполняет редирект — он передаётся дальше как исключение
    await signIn('credentials', { ...parsed.data, redirectTo: callbackUrlSchema.parse(callbackUrl) });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type === 'CredentialsSignin' ? 'Неверный логин или пароль' : 'Не удалось войти, попробуйте позже' };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/products' });
}
