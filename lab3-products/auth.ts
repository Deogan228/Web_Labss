// Настройка Auth.js: вход по логину и паролю, сессия в зашифрованном JWT в httpOnly-cookie
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { env } from '@/lib/env';
import { loginSchema } from '@/lib/schemas';
import { verifyUser } from '@/lib/users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  // приложение запускается локально (не на Vercel), поэтому разрешаем текущий хост
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 }, // 8 часов
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        // данные с формы — внешняя граница, проверяем их Zod-схемой
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        return verifyUser(parsed.data);
      },
    }),
  ],
  callbacks: {
    // роль кладём в токен при входе…
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // …и отдаём её в сессию, чтобы сервер и интерфейс знали права пользователя
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role;
      return session;
    },
  },
});
