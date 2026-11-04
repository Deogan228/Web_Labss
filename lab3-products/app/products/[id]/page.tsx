import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocalProduct } from '@/components/LocalProduct';
import { ProductDetails } from '@/components/ProductDetails';
import type { Role } from '@/lib/permissions';
import { getProduct } from '@/lib/products';
import { getCurrentUser } from '@/lib/session';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const role = (await getCurrentUser())?.role ?? null; // по роли показываются доступные действия

  return (
    <>
      <Link href="/products" className="link">
        ← К списку товаров
      </Link>
      <div className="mt-4">{id < 0 ? <LocalProduct id={id} role={role} /> : <ServerProduct id={id} role={role} />}</div>
    </>
  );
}

async function ServerProduct({ id, role }: { id: number; role: Role | null }) {
  const product = await getProduct(id);
  if (!product) notFound();
  // key сбрасывает состояние при переходе к другому товару
  return <ProductDetails key={product.id} product={product} role={role} />;
}
