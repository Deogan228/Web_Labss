import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchBar } from '@/components/SearchBar';
import { can } from '@/lib/permissions';
import { PAGE_SIZE, getProducts } from '@/lib/products';
import { productsSearchSchema } from '@/lib/schemas';
import { getCurrentUser } from '@/lib/session';
import { productsUrl } from '@/lib/urls';

type SearchParams = Record<string, string | string[] | undefined>;

// параметр может прийти несколько раз (?q=a&q=b) — берём первый
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  // параметры адреса — внешние данные, проверяем их Zod-схемой
  const { q: query, page } = productsSearchSchema.parse({ q: first(params.q), page: first(params.page) });

  const [data, user] = await Promise.all([getProducts(query, page), getCurrentUser()]);
  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  if (page > totalPages) redirect(productsUrl(query, totalPages));

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SearchBar query={query} />
        {/* кнопка видна только тем, кому можно добавлять товары */}
        {can(user?.role, 'create') && (
          <Link href="/products/new" className="btn btn-primary">
            + Добавить товар
          </Link>
        )}
      </div>
      <ProductGrid products={data.products} total={data.total} query={query} page={page} />
      <Pagination page={page} totalPages={totalPages} query={query} />
    </>
  );
}
