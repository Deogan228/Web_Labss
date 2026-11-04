import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductForm } from '@/components/ProductForm';

function renderForm(onSubmit = vi.fn()) {
  render(<ProductForm submitLabel="Добавить" onSubmit={onSubmit} />);
  return { user: userEvent.setup(), onSubmit };
}

describe('ProductForm', () => {
  it('показывает сообщение Zod при неверном вводе и не отправляет форму', async () => {
    const { user, onSubmit } = renderForm();

    await user.type(screen.getByLabelText('Название'), 'A');
    await user.type(screen.getByLabelText('Цена, $'), '-5');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Название должно быть не короче 2 символов')).toBeInTheDocument();
    expect(screen.getByText('Цена должна быть больше 0')).toBeInTheDocument();
    expect(screen.getByText('Выберите категорию из списка')).toBeInTheDocument();
    expect(screen.getByLabelText('Название')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('требует бренд для электроники (правило предметной области)', async () => {
    const { user, onSubmit } = renderForm();

    await user.type(screen.getByLabelText('Название'), 'iPhone 15');
    await user.selectOptions(screen.getByLabelText('Категория'), 'smartphones');
    await user.type(screen.getByLabelText('Цена, $'), '999');
    await user.type(screen.getByLabelText('Количество, шт.'), '3');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Для электроники и часов укажите бренд')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('вызывает обработчик с данными при корректном вводе', async () => {
    const { user, onSubmit } = renderForm();

    await user.type(screen.getByLabelText('Название'), '  Солнцезащитные очки  ');
    await user.type(screen.getByLabelText('Бренд'), 'Ray-Ban');
    await user.selectOptions(screen.getByLabelText('Категория'), 'sunglasses');
    await user.type(screen.getByLabelText('Цена, $'), '120.5');
    await user.type(screen.getByLabelText('Количество, шт.'), '7');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Солнцезащитные очки', // пробелы по краям убрала схема
      description: '',
      category: 'sunglasses',
      brand: 'Ray-Ban',
      price: 120.5,
      stock: 7,
    });
  });

  it('показывает у полей ошибки, которые вернул сервер', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      error: 'Проверьте правильность заполнения полей',
      fieldErrors: { title: ['Название должно быть не короче 2 символов'] },
    });
    render(
      <ProductForm
        submitLabel="Сохранить"
        onSubmit={onSubmit}
        defaultValues={{ title: 'Тушь', category: 'beauty', price: 9.99, stock: 99 }}
      />,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Проверьте правильность заполнения полей');
    expect(screen.getByText('Название должно быть не короче 2 символов')).toBeInTheDocument();
  });
});
