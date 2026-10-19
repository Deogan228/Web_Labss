'use client'; // error boundary всегда клиентский

export default function ProductsError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="error-box">
      <h2>Не удалось загрузить данные</h2>
      <p>Сервер DummyJSON не ответил. Проверьте подключение к интернету.</p>
      <button onClick={() => retry()}>Попробовать снова</button>
    </div>
  );
}
