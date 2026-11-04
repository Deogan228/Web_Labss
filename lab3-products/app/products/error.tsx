'use client'; // error boundary всегда клиентский

export default function ProductsError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert" className="alert alert-error alert-soft flex-col items-start sm:flex-row sm:items-center">
      <div>
        <h2 className="font-bold">Не удалось загрузить данные</h2>
        <p className="text-sm">Сервер DummyJSON не ответил. Проверьте подключение к интернету.</p>
      </div>
      <button className="btn btn-sm" onClick={() => retry()}>
        Попробовать снова
      </button>
    </div>
  );
}
