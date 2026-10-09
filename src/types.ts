// Модель по мотивам https://dummyjson.com/docs/products (взята часть полей)
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
}

// Данные товара без id — то, что заполняется в форме
export type ProductDraft = Omit<Product, 'id'>;
