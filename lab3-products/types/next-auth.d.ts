// Добавляем роль в типы пользователя, сессии и токена Auth.js
import type { DefaultSession } from 'next-auth';
import type { Role } from '@/lib/permissions';

declare module 'next-auth' {
  interface User {
    role: Role;
  }
  interface Session {
    user: { id: string; role: Role } & DefaultSession['user'];
  }
}

// интерфейс JWT объявлен в @auth/core (next-auth/jwt его только переэкспортирует)
declare module '@auth/core/jwt' {
  interface JWT {
    role?: Role;
  }
}
