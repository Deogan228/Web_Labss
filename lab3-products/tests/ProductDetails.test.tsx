import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteProductAction } from '@/app/products/actions';
import { LocalProduct } from '@/components/LocalProduct';
import { ProductDetails } from '@/components/ProductDetails';
import { ProductsStoreProvider } from '@/store/ProductsStoreProvider';

// моки: Server Function и роутер Next.js заменяем на управляемые функции
const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/app/products/actions', () => ({ deleteProductAction: vi.fn(), createProductAction: vi.fn() }));

const product = { id: 2, title: 'Eyeshadow Palette with Mirror', category: 'beauty', brand: 'Glamour Beauty', price: 19.99, stock: 34, rating: 2.86, description: 'Палитра теней с зеркалом' };

function renderDetails(role: 'user' | 'admin' | null) {
  render(
    <ProductsStoreProvider>
      <ProductDetails product={product} role={role} />
    </ProductsStoreProvider>,
  );
  return userEvent.setup();
}

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true); // пользователь подтверждает удаление
  });

  it('показывает товар; обычному пользователю удаление недоступно', () => {
    renderDetails('user');

    expect(screen.getByRole('heading', { name: 'Eyeshadow Palette with Mirror' })).toBeInTheDocument();
    expect(screen.getByText('Палитра теней с зеркалом')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
  });

  it('администратор удаляет товар через Server Function', async () => {
    vi.mocked(deleteProductAction).mockResolvedValue({ ok: true, product });
    const user = renderDetails('admin');

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(deleteProductAction).toHaveBeenCalledWith(2);
    expect(await screen.findByText('Товар удалён.')).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith('/products');
  });

  it('показывает ошибку доступа, которую вернул сервер', async () => {
    vi.mocked(deleteProductAction).mockResolvedValue({ ok: false, status: 403, error: 'Удалять товары может только администратор' });
    const user = renderDetails('admin');

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось удалить: Удалять товары может только администратор');
    expect(screen.getByRole('heading', { name: 'Eyeshadow Palette with Mirror' })).toBeInTheDocument();
  });

  it('сообщает, что добавленного товара больше нет (после перезагрузки)', () => {
    render(
      <ProductsStoreProvider>
        <LocalProduct id={-1} role="user" />
      </ProductsStoreProvider>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Товар не найден');
    expect(screen.getByRole('link', { name: 'К списку товаров' })).toHaveAttribute('href', '/products');
  });
});
