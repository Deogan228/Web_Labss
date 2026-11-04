import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductCard } from '@/components/ProductCard';

const product = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  category: 'beauty',
  brand: 'Essence',
  price: 9.99,
  stock: 99,
  rating: 2.56,
  thumbnail: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
};

describe('ProductCard', () => {
  it('показывает переданные данные товара', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: 'Essence Mascara Lash Princess' })).toBeInTheDocument();
    expect(screen.getByText('Essence · beauty')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('★ 2.56')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Essence Mascara Lash Princess' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/1');
  });

  it('отмечает товар, добавленный в этой сессии', () => {
    render(<ProductCard product={{ ...product, id: -1, rating: undefined }} />);

    expect(screen.getByText('новый')).toBeInTheDocument();
  });
});
