import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductActions } from '@/components/ProductActions';

describe('ProductActions', () => {
  it('анонимный пользователь не видит действий и получает ссылку на вход', () => {
    render(<ProductActions productId={1} role={null} onDelete={vi.fn()} />);

    expect(screen.queryByRole('link', { name: 'Редактировать' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Войдите' })).toHaveAttribute('href', '/login?callbackUrl=/products/1');
  });

  it('обычный пользователь может редактировать, но не видит удаление', () => {
    render(<ProductActions productId={1} role="user" onDelete={vi.fn()} />);

    expect(screen.getByRole('link', { name: 'Редактировать' })).toHaveAttribute('href', '/products/1/edit');
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
  });

  it('администратор видит удаление и может его вызвать', async () => {
    const onDelete = vi.fn();
    render(<ProductActions productId={1} role="admin" onDelete={onDelete} />);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Удалить' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('во время удаления кнопка недоступна', () => {
    render(<ProductActions productId={1} role="admin" onDelete={vi.fn()} deleting />);

    expect(screen.getByRole('button', { name: 'Удаление…' })).toBeDisabled();
  });
});
