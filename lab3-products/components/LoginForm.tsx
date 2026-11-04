'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/schemas';
import type { LoginInput } from '@/lib/schemas';

interface LoginFormProps {
  callbackUrl: string;
  // Server Function входа передаётся со страницы
  action: (input: LoginInput, callbackUrl: string) => Promise<{ error: string } | undefined>;
}

export function LoginForm({ callbackUrl, action }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function submit(values: LoginInput) {
    const result = await action(values, callbackUrl);
    if (result?.error) setError('root', { message: result.error });
  }

  return (
    // method="post": даже если форму отправят до загрузки JS, пароль не попадёт в адрес страницы
    <form method="post" onSubmit={handleSubmit(submit)} noValidate className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <fieldset className="fieldset">
          <label htmlFor="username" className="fieldset-legend">
            Логин
          </label>
          <input id="username" autoComplete="username" className={`input w-full ${errors.username ? 'input-error' : ''}`} {...register('username')} />
          {errors.username && <p className="label text-error">{errors.username.message}</p>}

          <label htmlFor="password" className="fieldset-legend">
            Пароль
          </label>
          <input id="password" type="password" autoComplete="current-password" className={`input w-full ${errors.password ? 'input-error' : ''}`} {...register('password')} />
          {errors.password && <p className="label text-error">{errors.password.message}</p>}
        </fieldset>

        {errors.root && (
          <div role="alert" className="alert alert-error alert-soft">
            {errors.root.message}
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
          {isSubmitting && <span className="loading loading-spinner loading-sm" />}
          Войти
        </button>
      </div>
    </form>
  );
}
