import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request); // Always run this first

  // Skip session checks for public or internal routes
  const publicPaths = ['/', '/auth', '/auth/', '/favicon.ico'];
  const isPublic = publicPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path));

  if (isPublic) {
    return authRes;
  }

  const session = await auth0.getSession();
  if (!session) {
    const returnTo = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?returnTo=${returnTo}`);
  }

  return authRes;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon\\.[ico|png]|sitemap.xml|robots.txt).*)',
  ],
};
