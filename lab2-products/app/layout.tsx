import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ProductsStoreProvider } from '@/store/ProductsStoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Товары',
  description: 'Лабораторная работа №2: Next.js App Router + DummyJSON',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/products" className="logo">
              Товары
            </Link>
            <span className="muted">Next.js · DummyJSON</span>
          </div>
        </header>
        {/* клиентский провайдер store; страницы внутри него остаются серверными компонентами */}
        <ProductsStoreProvider>
          <main className="container">{children}</main>
        </ProductsStoreProvider>
      </body>
    </html>
  );
}
