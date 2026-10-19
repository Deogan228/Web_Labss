import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{product.title}</h3>
        <span className="price">${product.price}</span>
      </div>

      <p className="meta">
        {product.brand && `${product.brand} · `}
        {product.category}
      </p>
      <p>{product.description}</p>
      <p className="meta">
        ★ {product.rating} ·{' '}
        {product.stock > 0 ? `в наличии: ${product.stock} шт.` : <span className="out">нет в наличии</span>}
      </p>

      <div className="actions">
        <button onClick={() => onEdit(product)}>Изменить</button>
        <button className="danger" onClick={() => onDelete(product.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}
