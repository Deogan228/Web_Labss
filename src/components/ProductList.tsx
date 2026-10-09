import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return <p className="empty">Товаров пока нет</p>;
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
