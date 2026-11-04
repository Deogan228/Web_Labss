import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { callbackUrlSchema } from '@/lib/schemas';
import { getCurrentUser } from '@/lib/session';
import { loginAction } from './actions';

type SearchParams = Record<string, string | string[] | undefined>;

// учётные записи для проверки (хранятся в lib/users.ts)
const DEMO_ACCOUNTS = [
  { username: 'ruslan', password: 'ruslanpass', role: 'администратор' },
  { username: 'maximka', password: 'maximkapass', role: 'пользователь' },
];

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const callbackUrl = callbackUrlSchema.parse((await searchParams).callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl); // уже вошёл

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Вход</h1>
      <LoginForm callbackUrl={callbackUrl} action={loginAction} />

      <div className="mt-6 overflow-x-auto rounded-box bg-base-100 shadow-sm">
        <table className="table table-sm">
          <caption className="p-3 text-left text-sm text-base-content/70">Учётные записи для проверки</caption>
          <thead>
            <tr>
              <th>Логин</th>
              <th>Пароль</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACCOUNTS.map((account) => (
              <tr key={account.username}>
                <td className="font-mono">{account.username}</td>
                <td className="font-mono">{account.password}</td>
                <td>{account.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
