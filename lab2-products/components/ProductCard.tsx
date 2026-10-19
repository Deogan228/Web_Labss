import Link from 'next/link';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="card">
      {product.thumbnail ? (
        <img src={product.thumbnail} alt={product.title} className="card-image" loading="lazy" />
      ) : (
        <div className="card-image card-image-empty">Нет фото</div>
      )}
      <div className="card-body">
        <h3>{product.title}</h3>
        <p className="muted">
          {product.brand && `${product.brand} · `}
          {product.category}
        </p>
        <div className="card-footer">
          <span className="price">${product.price}</span>
          {product.id < 0 ? <span className="badge">новый</span> : <span className="muted">★ {product.rating}</span>}
        </div>
      </div>
    </Link>
  );
}
