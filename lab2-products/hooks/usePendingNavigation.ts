import { useCallback, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useProductsStore } from '@/store/ProductsStoreProvider';

// Переход по ссылке внутри transition: пока грузится новая страница,
// старые данные остаются на экране, а в store выставляется флаг pending.
export function usePendingNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const setPending = useProductsStore((s) => s.setPending);

  useEffect(() => {
    setPending(isPending);
    return () => setPending(false);
  }, [isPending, setPending]);

  return useCallback((url: string) => startTransition(() => router.push(url)), [router]);
}
