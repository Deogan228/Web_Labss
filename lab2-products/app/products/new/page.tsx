import Link from 'next/link';
import { CreateProductForm } from '@/components/CreateProductForm';

export default function NewProductPage() {
  return (
    <>
      <Link href="/products">← К списку товаров</Link>
      <h1>Новый товар</h1>
      <CreateProductForm />
    </>
  );
}
