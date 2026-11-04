import { ProductGridSkeleton } from '@/components/Skeletons';

export default function ProductsLoading() {
  return (
    <>
      <div className="skeleton mb-3 h-10 w-80" />
      <ProductGridSkeleton />
    </>
  );
}
