// Плейсхолдеры на время первой загрузки (серверные компоненты)
export function ProductGridSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card">
          <div className="card-image skeleton" />
          <div className="card-body">
            <div className="skeleton line" />
            <div className="skeleton line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <section className="details">
      <div className="details-image skeleton" />
      <div className="details-info">
        <div className="skeleton line" />
        <div className="skeleton line short" />
        <div className="skeleton line" />
      </div>
    </section>
  );
}
