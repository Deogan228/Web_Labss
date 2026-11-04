import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body items-center text-center">
        <h1 className="card-title">Страница не найдена</h1>
        <Link href="/products" className="link link-primary">
          ← К списку товаров
        </Link>
      </div>
    </div>
  );
}
