import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchBar } from '@/components/SearchBar';
import { PAGE_SIZE, getProducts } from '@/lib/products';
import { productsUrl } from '@/lib/urls';

type SearchParams = Record<string, string | string[] | undefined>;

// параметр может прийти несколько раз (?q=a&q=b) — берём первый
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

// Серверный компонент: сам получает данные и передаёт их клиентским компонентам
export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = first(params.q).trim();
  const page = Math.max(1, Math.floor(Number(first(params.page))) || 1);

  const data = await getProducts(query, page);
  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  // номер страницы за концом списка — переходим на последнюю
  if (page > totalPages) redirect(productsUrl(query, totalPages));

  return (
    <>
      <div className="toolbar">
        <SearchBar query={query} />
        <Link href="/products/new" className="button">
          + Добавить товар
        </Link>
      </div>
      <ProductGrid products={data.products} total={data.total} query={query} page={page} />
      <Pagination page={page} totalPages={totalPages} query={query} />
    </>
  );
}
