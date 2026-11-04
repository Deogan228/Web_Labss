import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Pagination } from '@/components/Pagination';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchBar } from '@/components/SearchBar';
import { ProductsStoreProvider } from '@/store/ProductsStoreProvider';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const products = [
  { id: 1, title: 'Essence Mascara Lash Princess', category: 'beauty', brand: 'Essence', price: 9.99, stock: 99, rating: 2.56 },
  { id: 3, title: 'Powder Canister', category: 'beauty', brand: 'Velvet Touch', price: 14.99, stock: 89, rating: 4.64 },
];

const withStore = (ui: React.ReactNode) => render(<ProductsStoreProvider>{ui}</ProductsStoreProvider>);

describe('Список товаров', () => {
  beforeEach(() => push.mockClear());

  it('ProductGrid показывает карточки и количество', () => {
    withStore(<ProductGrid products={products} total={194} query="" page={1} />);

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByText('Найдено товаров: 194')).toBeInTheDocument();
  });

  it('ProductGrid отличает пустой результат от ошибки', () => {
    withStore(<ProductGrid products={[]} total={0} query="zzz" page={1} />);

    expect(screen.getByRole('status')).toHaveTextContent('По запросу «zzz» ничего не найдено');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('SearchBar переходит на страницу с результатами поиска', async () => {
    const user = userEvent.setup();
    withStore(<SearchBar query="" />);

    await user.type(screen.getByRole('searchbox', { name: 'Поиск товаров' }), 'phone');
    await user.click(screen.getByRole('button', { name: 'Найти' }));

    expect(push).toHaveBeenCalledWith('/products?q=phone');
  });

  it('Pagination переходит на следующую страницу и блокирует «Назад» на первой', async () => {
    const user = userEvent.setup();
    withStore(<Pagination page={1} totalPages={17} query="" />);

    expect(screen.getByRole('button', { name: '← Назад' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Вперёд →' }));

    expect(push).toHaveBeenCalledWith('/products?page=2');
  });
});
