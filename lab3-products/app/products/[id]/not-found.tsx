import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body items-center text-center">
        <h1 className="card-title">Товар не найден</h1>
        <p className="text-base-content/70">Возможно, его удалили или в адресе ошибка.</p>
        <Link href="/products" className="link link-primary">
          ← К списку товаров
        </Link>
      </div>
    </div>
  );
}
