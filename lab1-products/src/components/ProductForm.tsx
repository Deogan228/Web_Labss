import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Product, ProductDraft } from '../types';

const emptyDraft: ProductDraft = {
  title: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  rating: 0,
};

interface ProductFormProps {
  product: Product | null; // null — добавление нового товара
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(product ?? emptyDraft);
  const titleRef = useRef<HTMLInputElement>(null);

  // при начале редактирования ставим фокус в поле названия
  useEffect(() => {
    if (product) titleRef.current?.focus();
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDraft((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
    if (!product) setDraft(emptyDraft);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{product ? 'Редактирование товара' : 'Новый товар'}</h2>

      <label>
        Название
        <input ref={titleRef} name="title" value={draft.title} onChange={handleChange} required />
      </label>
      <label>
        Бренд
        <input name="brand" value={draft.brand} onChange={handleChange} />
      </label>
      <label>
        Категория
        <input name="category" value={draft.category} onChange={handleChange} required />
      </label>
      <label>
        Цена, $
        <input name="price" type="number" min="0" step="0.01" value={draft.price} onChange={handleChange} />
      </label>
      <label>
        Количество
        <input name="stock" type="number" min="0" value={draft.stock} onChange={handleChange} />
      </label>
      <label>
        Рейтинг (0–5)
        <input name="rating" type="number" min="0" max="5" step="0.01" value={draft.rating} onChange={handleChange} />
      </label>
      <label className="wide">
        Описание
        <textarea name="description" rows={2} value={draft.description} onChange={handleChange} />
      </label>

      <div className="actions wide">
        <button type="submit">{product ? 'Сохранить' : 'Добавить'}</button>
        {product && (
          <button type="button" className="secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
