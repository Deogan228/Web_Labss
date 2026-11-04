// Удобный редирект анонимного пользователя со страниц создания и изменения.
// Это только первый уровень: страницы, Server Functions и Route Handler проверяют доступ сами.
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((request) => {
  if (!request.auth) {
    const url = new URL('/login', request.nextUrl.origin);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ['/products/new', '/products/:id/edit'],
};
