import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CreateProductForm } from '@/components/CreateProductForm';
import { can } from '@/lib/permissions';
import { requireUser } from '@/lib/session';

export default async function NewProductPage() {
  // защита на сервере: аноним уходит на страницу входа (proxy.ts — только первый уровень)
  const user = await requireUser('/products/new');
  if (!can(user.role, 'create')) redirect('/products');

  return (
    <>
      <Link href="/products" className="link">
        ← К списку товаров
      </Link>
      <h1 className="my-4 text-2xl font-bold">Новый товар</h1>
      <CreateProductForm />
    </>
  );
}
