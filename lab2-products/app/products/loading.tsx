import { ProductGridSkeleton } from '@/components/Skeletons';

export default function ProductsLoading() {
  return (
    <>
      <div className="toolbar">
        <div className="skeleton line" style={{ width: 320, height: 36 }} />
      </div>
      <ProductGridSkeleton />
    </>
  );
}
