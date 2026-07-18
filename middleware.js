import { NextResponse } from 'next/server';
import { verifyAdminToken } from './src/lib/adminAuth';  // ← diubah dari './lib/adminAuth'

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const token = req.cookies.get('admin_session')?.value;
    const valid = token && verifyAdminToken(token);

    if (!valid) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};