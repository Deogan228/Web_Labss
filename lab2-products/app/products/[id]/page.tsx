import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocalProduct } from '@/components/LocalProduct';
import { ProductDetails } from '@/components/ProductDetails';
import { getProduct } from '@/lib/products';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  return (
    <>
      <Link href="/products">← К списку товаров</Link>
      {id < 0 ? <LocalProduct id={id} /> : <ServerProduct id={id} />}
    </>
  );
}

async function ServerProduct({ id }: { id: number }) {
  const product = await getProduct(id);
  if (!product) notFound();
  // key сбрасывает состояние (например, открытую форму) при переходе к другому товару
  return <ProductDetails key={product.id} product={product} />;
}
