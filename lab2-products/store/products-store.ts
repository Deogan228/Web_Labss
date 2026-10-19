// Общее клиентское состояние (Zustand).
// DummyJSON только имитирует изменения и ничего не сохраняет, поэтому результаты
// добавления, изменения и удаления хранятся здесь и накладываются на данные с сервера.
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface ProductsState {
  created: Product[];               // добавленные в этой сессии (у них отрицательный id)
  updated: Record<number, Product>; // изменённые товары с сервера
  deletedIds: number[];             // удалённые товары
  pending: boolean;                 // идёт загрузка новой страницы или поиска

  addCreated: (product: Product) => void;
  saveUpdated: (product: Product) => void;
  clearUpdated: (id: number) => void;
  markDeleted: (id: number) => void;
  setPending: (pending: boolean) => void;
}

// Фабрика store. В Next.js его нельзя делать одним на весь модуль: на сервере такой store
// был бы общим для всех запросов. Поэтому store создаётся в ProductsStoreProvider.
export const createProductsStore = () =>
  createStore<ProductsState>()(
    devtools(
      (set) => ({
        created: [],
        updated: {},
        deletedIds: [],
        pending: false,

        addCreated: (product) => set((s) => ({ created: [product, ...s.created] })),
        saveUpdated: (product) =>
          set((s) =>
            product.id < 0
              ? { created: s.created.map((p) => (p.id === product.id ? product : p)) }
              : { updated: { ...s.updated, [product.id]: product } },
          ),
        clearUpdated: (id) =>
          set((s) => {
            const { [id]: _removed, ...rest } = s.updated;
            return { updated: rest };
          }),
        markDeleted: (id) => set((s) => ({ deletedIds: [...s.deletedIds, id] })),
        setPending: (pending) => set({ pending }),
      }),
      // Redux DevTools в браузере — только в режиме разработки
      { name: 'products-store', enabled: process.env.NODE_ENV === 'development' },
    ),
  );

export type ProductsStore = ReturnType<typeof createProductsStore>;
