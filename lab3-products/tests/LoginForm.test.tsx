import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/components/LoginForm';

describe('LoginForm', () => {
  it('не отправляет пустую форму и показывает сообщения Zod', async () => {
    const action = vi.fn();
    render(<LoginForm callbackUrl="/products" action={action} />);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Введите логин')).toBeInTheDocument();
    expect(screen.getByText('Введите пароль')).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it('передаёт логин и пароль и показывает ошибку входа', async () => {
    const action = vi.fn().mockResolvedValue({ error: 'Неверный логин или пароль' });
    const user = userEvent.setup();
    render(<LoginForm callbackUrl="/products/new" action={action} />);

    await user.type(screen.getByLabelText('Логин'), 'ruslan');
    await user.type(screen.getByLabelText('Пароль'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(action).toHaveBeenCalledWith({ username: 'ruslan', password: 'wrong' }, '/products/new');
    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный логин или пароль');
  });
});
