import { NextResponse } from 'next/server';
import { verifyAdminTokenEdge } from './src/lib/adminAuth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const token = req.cookies.get('admin_session')?.value;
    const valid = token && (await verifyAdminTokenEdge(token));

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