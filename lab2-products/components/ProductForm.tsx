'use client';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { ProductInput } from '@/lib/types';

const emptyInput: ProductInput = { title: '', description: '', category: '', brand: '', price: 0, stock: 0 };

interface ProductFormProps {
  initial?: ProductInput;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void> | void;
  onCancel?: () => void;
}

export function ProductForm({ initial = emptyInput, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  }

  // Обработчик вызывается без startTransition: иначе изменения состояния внутри onSubmit
  // (например, оптимистичное обновление) ждали бы окончания запроса.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(values);
      // при успехе форма закрывается или происходит переход на другую страницу
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <fieldset disabled={submitting}>
        <label>
          Название
          <input name="title" value={values.title} onChange={handleChange} required />
        </label>
        <label>
          Бренд
          <input name="brand" value={values.brand} onChange={handleChange} />
        </label>
        <label>
          Категория
          <input name="category" value={values.category} onChange={handleChange} required />
        </label>
        <label>
          Цена, $
          <input name="price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} />
        </label>
        <label>
          Количество
          <input name="stock" type="number" min="0" step="1" value={values.stock} onChange={handleChange} />
        </label>
        <label className="wide">
          Описание
          <textarea name="description" rows={3} value={values.description} onChange={handleChange} />
        </label>

        <div className="actions wide">
          <button type="submit">{submitting ? 'Сохранение…' : submitLabel}</button>
          {onCancel && (
            <button type="button" className="secondary" onClick={onCancel}>
              Отмена
            </button>
          )}
        </div>
        {error && <p className="error wide">{error}</p>}
      </fieldset>
    </form>
  );
}
