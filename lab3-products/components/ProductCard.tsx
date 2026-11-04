import Link from 'next/link';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="card bg-base-100 shadow-sm transition hover:shadow-md">
      <figure className="bg-base-200">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} loading="lazy" className="aspect-[4/3] w-full object-contain" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center text-base-content/50">Нет фото</div>
        )}
      </figure>
      <div className="card-body gap-1 p-4">
        <h3 className="card-title text-base">{product.title}</h3>
        <p className="text-sm text-base-content/70">
          {product.brand && `${product.brand} · `}
          {product.category}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-success">${product.price}</span>
          {product.id < 0 ? (
            <span className="badge badge-soft badge-primary badge-sm">новый</span>
          ) : (
            <span className="text-sm text-base-content/70">★ {product.rating}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
