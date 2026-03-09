import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require auth
const PROTECTED_PREFIXES = ['/dashboard'];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for auth token in cookies
    const token = request.cookies.get('token')?.value;

    const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);

    // If accessing a protected route without a token, redirect to login
    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
