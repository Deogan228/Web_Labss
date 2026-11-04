// Плейсхолдеры на время загрузки (серверные компоненты)
export function ProductGridSkeleton() {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm">
          <div className="skeleton aspect-[4/3] w-full rounded-b-none" />
          <div className="card-body gap-2 p-4">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="card bg-base-100 shadow-sm lg:card-side">
      <div className="skeleton aspect-square w-full lg:w-2/5" />
      <div className="card-body gap-3">
        <div className="skeleton h-7 w-3/4" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return <div className="skeleton h-80 w-full" />;
}
