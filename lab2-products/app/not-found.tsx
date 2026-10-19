import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="empty">
      <h1>Страница не найдена</h1>
      <Link href="/products">← К списку товаров</Link>
    </div>
  );
}
