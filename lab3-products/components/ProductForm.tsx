'use client';
import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { DefaultValues } from 'react-hook-form';
import { CATEGORIES, categorySchema, productInputSchema } from '@/lib/schemas';
import type { Product, ProductFieldErrors, ProductInput } from '@/lib/schemas';

// Что может вернуть обработчик отправки: ошибки сервера показываются в форме
export type SubmitResult = { error?: string; fieldErrors?: ProductFieldErrors } | void;

interface ProductFormProps {
  defaultValues?: DefaultValues<ProductInput>;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<SubmitResult> | SubmitResult;
  onCancel?: () => void;
}

// Значения формы из товара; категорию берём, только если она есть в списке
export function productToFormValues(product: Product): DefaultValues<ProductInput> {
  return {
    title: product.title,
    description: product.description ?? '',
    category: categorySchema.safeParse(product.category).data,
    brand: product.brand ?? '',
    price: product.price,
    stock: product.stock,
  };
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="fieldset">
      <label htmlFor={id} className="fieldset-legend">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="label text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ProductForm({ defaultValues, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema), // проверка той же схемой, что и на сервере
    defaultValues: { title: '', description: '', brand: '', ...defaultValues },
  });

  async function submit(values: ProductInput) {
    const result = await onSubmit(values);
    if (!result) return;
    // ошибки серверной проверки показываем у тех же полей
    for (const field of productInputSchema.keyof().options) {
      const message = result.fieldErrors?.[field]?.[0];
      if (message) setError(field, { message });
    }
    if (result.error) setError('root', { message: result.error });
  }

  // общие атрибуты поля: подсветка и связь с текстом ошибки
  const invalid = (name: keyof ProductInput) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {};

  return (
    <form method="post" onSubmit={handleSubmit(submit)} noValidate className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <fieldset disabled={isSubmitting} className="grid gap-x-4 sm:grid-cols-2">
          <Field id="title" label="Название" error={errors.title?.message}>
            <input id="title" className={`input w-full ${errors.title ? 'input-error' : ''}`} {...invalid('title')} {...register('title')} />
          </Field>
          <Field id="brand" label="Бренд" error={errors.brand?.message}>
            <input id="brand" className={`input w-full ${errors.brand ? 'input-error' : ''}`} {...invalid('brand')} {...register('brand')} />
          </Field>
          <Field id="category" label="Категория" error={errors.category?.message}>
            <select id="category" className={`select w-full ${errors.category ? 'select-error' : ''}`} {...invalid('category')} {...register('category')}>
              <option value="">— выберите —</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field id="price" label="Цена, $" error={errors.price?.message}>
            <input id="price" type="number" step="0.01" className={`input w-full ${errors.price ? 'input-error' : ''}`} {...invalid('price')} {...register('price', { valueAsNumber: true })} />
          </Field>
          <Field id="stock" label="Количество, шт." error={errors.stock?.message}>
            <input id="stock" type="number" step="1" className={`input w-full ${errors.stock ? 'input-error' : ''}`} {...invalid('stock')} {...register('stock', { valueAsNumber: true })} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="description" label="Описание" error={errors.description?.message}>
              <textarea id="description" rows={3} className={`textarea w-full ${errors.description ? 'textarea-error' : ''}`} {...invalid('description')} {...register('description')} />
            </Field>
          </div>
        </fieldset>

        {errors.root && (
          <div role="alert" className="alert alert-error alert-soft">
            {errors.root.message}
          </div>
        )}

        <div className="card-actions mt-2">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <span className="loading loading-spinner loading-sm" />}
            {isSubmitting ? 'Сохранение…' : submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
              Отмена
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
