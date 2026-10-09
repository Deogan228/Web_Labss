import { useEffect, useState } from 'react';
import type { Product, ProductDraft } from '../types';
import { mockProducts } from '../data/mockProducts';

const STORAGE_KEY = 'products';

function loadProducts(): Product[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : mockProducts;
}

// Кастомный хук: хранит список товаров и даёт функции для его изменения
export function useProducts() {
  // ленивая инициализация — loadProducts вызовется только при первом рендере
  const [products, setProducts] = useState<Product[]>(loadProducts);

  // при каждом изменении списка сохраняем его в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (draft: ProductDraft) => {
    setProducts((prev) => [...prev, { ...draft, id: Date.now() }]);
  };

  const updateProduct = (id: number, draft: ProductDraft) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...draft, id } : p)));
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProducts = () => setProducts(mockProducts);

  return { products, addProduct, updateProduct, removeProduct, resetProducts };
}
