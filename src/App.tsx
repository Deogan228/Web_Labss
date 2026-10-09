import { useState } from 'react';
import type { Product, ProductDraft } from './types';
import { useProducts } from './hooks/useProducts';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

export default function App() {
  const { products, addProduct, updateProduct, removeProduct, resetProducts } = useProducts();
  // товар, который сейчас редактируется (null — форма в режиме добавления)
  const [editing, setEditing] = useState<Product | null>(null);

  const handleSubmit = (draft: ProductDraft) => {
    if (editing) {
      updateProduct(editing.id, draft);
      setEditing(null);
    } else {
      addProduct(draft);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Удалить товар?')) return;
    removeProduct(id);
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="container">
      <h1>Товары</h1>

      {/* key пересоздаёт форму при смене редактируемого товара, чтобы сбросить её состояние */}
      <ProductForm
        key={editing?.id ?? 'new'}
        product={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />

      <div className="list-header">
        <h2>Список товаров ({products.length})</h2>
        <button className="secondary" onClick={resetProducts}>
          Сбросить данные
        </button>
      </div>

      <ProductList products={products} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
