import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { EditProductForm } from '@/components/EditProductForm';
import { can } from '@/lib/permissions';
import { getProduct } from '@/lib/products';
import { requireUser } from '@/lib/session';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  // защита на сервере: аноним уходит на страницу входа
  const user = await requireUser(`/products/${id}/edit`);
  if (!can(user.role, 'update')) redirect(`/products/${id}`);

  return (
    <>
      <Link href={`/products/${id}`} className="link">
        ← К товару
      </Link>
      <h1 className="my-4 text-2xl font-bold">Редактирование товара</h1>
      {id < 0 ? <EditProductForm id={id} /> : <ServerEdit id={id} />}
    </>
  );
}

async function ServerEdit({ id }: { id: number }) {
  const product = await getProduct(id);
  if (!product) notFound();
  return <EditProductForm key={product.id} id={id} product={product} />;
}
