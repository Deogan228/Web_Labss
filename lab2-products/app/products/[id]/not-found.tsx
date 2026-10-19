import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="empty">
      <h1>Товар не найден</h1>
      <p>Возможно, его удалили или в адресе ошибка.</p>
      <Link href="/products">← К списку товаров</Link>
    </div>
  );
}
