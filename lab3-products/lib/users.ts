// Учётные записи приложения. Пароли хранятся только в виде bcrypt-хешей.
import 'server-only';
import bcrypt from 'bcryptjs';
import type { Role } from './permissions';
import type { LoginInput } from './schemas';

interface StoredUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  passwordHash: string;
}

const USERS: StoredUser[] = [
  { id: '1', username: 'ruslan', name: 'ruslan', role: 'admin', passwordHash: '$2b$10$atwDNwTuMDHUqDoDzvSWMecMB/MpyapxvJODttnzLz775MfddpO/G' },
  { id: '2', username: 'maximka', name: 'maximka', role: 'user', passwordHash: '$2b$10$uB8pgV8cgdFK3me1A2V2XOCtQLyttoG6K/UEY2FQYUTTBcZwqWJHi' },
];

// хеш-заглушка: пароль сравнивается и для несуществующего логина,
// чтобы по времени ответа нельзя было понять, есть ли такой пользователь
const DUMMY_HASH = '$2b$10$mKAJkVVP19RqKwV5sIUwJ.2MsjXQspB0kZ2iHDSw617faseFpSKdS';

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

export async function verifyUser({ username, password }: LoginInput): Promise<AuthUser | null> {
  const user = USERS.find((u) => u.username === username);
  const passwordOk = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !passwordOk) return null;
  return { id: user.id, name: user.name, role: user.role };
}
