'use client';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useStore } from 'zustand';
import { createProductsStore } from './products-store';
import type { ProductsState, ProductsStore } from './products-store';

const ProductsStoreContext = createContext<ProductsStore | null>(null);

// Store создаётся один раз на вкладку браузера и отдельно на каждый запрос на сервере,
// поэтому данные разных пользователей не смешиваются. Провайдер стоит в корневом layout,
// так что store живёт при переходах между страницами.
export function ProductsStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createProductsStore);
  return <ProductsStoreContext value={store}>{children}</ProductsStoreContext>;
}

// Чтение store через селектор: компонент перерисуется, только когда изменится выбранная часть
export function useProductsStore<T>(selector: (state: ProductsState) => T): T {
  const store = useContext(ProductsStoreContext);
  if (!store) throw new Error('useProductsStore нужно вызывать внутри ProductsStoreProvider');
  return useStore(store, selector);
}
