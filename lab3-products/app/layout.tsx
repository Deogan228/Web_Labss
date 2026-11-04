import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { ProductsStoreProvider } from '@/store/ProductsStoreProvider';
import { UserMenu } from './UserMenu';
import './globals.css';

export const metadata: Metadata = {
  title: 'Товары',
  description: 'Лабораторная работа №3: валидация, аутентификация, роли и тесты',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body className="min-h-screen bg-base-200">
        <header className="navbar mb-6 bg-base-100 shadow-sm">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
            <Link href="/products" className="text-xl font-bold">
              Товары
            </Link>
            {/* сессия читается при каждом запросе, поэтому меню грузится отдельно от страницы */}
            <Suspense fallback={<span className="loading loading-spinner loading-sm" />}>
              <UserMenu />
            </Suspense>
          </div>
        </header>
        {/* клиентский провайдер store; страницы внутри него остаются серверными компонентами */}
        <ProductsStoreProvider>
          <main className="mx-auto max-w-6xl px-4 pb-10">{children}</main>
        </ProductsStoreProvider>
      </body>
    </html>
  );
}
