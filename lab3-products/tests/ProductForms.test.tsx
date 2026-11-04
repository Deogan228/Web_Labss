import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createProductAction } from '@/app/products/actions';
import { CreateProductForm } from '@/components/CreateProductForm';
import { EditProductForm } from '@/components/EditProductForm';
import { ProductsStoreProvider } from '@/store/ProductsStoreProvider';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/app/products/actions', () => ({ deleteProductAction: vi.fn(), createProductAction: vi.fn() }));

const product = { id: 1, title: 'Essence Mascara Lash Princess', category: 'beauty', brand: 'Essence', price: 9.99, stock: 99 };

// стаб fetch: всегда отвечает заранее заданным ответом
function stubFetch(status: number, body: unknown) {
  const fetchStub = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchStub);
  return fetchStub;
}

afterEach(() => {
  vi.unstubAllGlobals();
  push.mockClear();
});

describe('EditProductForm', () => {
  it('показывает у полей ошибки серверной проверки (400)', async () => {
    stubFetch(400, { error: 'Проверьте правильность заполнения полей', fieldErrors: { price: ['Цена должна быть больше 0'] } });
    render(<ProductsStoreProvider><EditProductForm id={1} product={product} /></ProductsStoreProvider>);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByText('Цена должна быть больше 0')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('отправляет PUT в Route Handler и возвращается к товару', async () => {
    const fetchStub = stubFetch(200, product);
    const user = userEvent.setup();
    render(<ProductsStoreProvider><EditProductForm id={1} product={product} /></ProductsStoreProvider>);

    await user.clear(screen.getByLabelText('Цена, $'));
    await user.type(screen.getByLabelText('Цена, $'), '7.49');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(fetchStub).toHaveBeenCalledWith('/api/products/1', expect.objectContaining({ method: 'PUT' }));
    expect(JSON.parse(fetchStub.mock.calls[0][1].body)).toMatchObject({ price: 7.49 });
    expect(push).toHaveBeenCalledWith('/products/1');
  });
});

describe('CreateProductForm', () => {
  it('показывает ошибку доступа, если сервер ответил 401', async () => {
    vi.mocked(createProductAction).mockResolvedValue({ ok: false, status: 401, error: 'Войдите в систему, чтобы выполнить это действие' });
    const user = userEvent.setup();
    render(<ProductsStoreProvider><CreateProductForm /></ProductsStoreProvider>);

    await user.type(screen.getByLabelText('Название'), 'Шапка зимняя');
    await user.selectOptions(screen.getByLabelText('Категория'), 'tops');
    await user.type(screen.getByLabelText('Цена, $'), '25');
    await user.type(screen.getByLabelText('Количество, шт.'), '40');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(createProductAction).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('alert')).toHaveTextContent('Войдите в систему, чтобы выполнить это действие');
    expect(push).not.toHaveBeenCalled();
  });
});
