// Адрес списка товаров с поиском и номером страницы
export function productsUrl(query: string, page = 1) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `/products?${search}` : '/products';
}
