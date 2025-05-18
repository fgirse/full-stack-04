import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
 
let locales = ['en-US', 'de', 'fr']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request: any) {
  // Example implementation: return the first locale from the list
  return locales[0];
}
 
export function middleware(request: { nextUrl: string | NextURL | URL; }) {
  // Check if there is any supported locale in the pathname
  const pathname = (request.nextUrl instanceof URL || request.nextUrl instanceof NextURL) ? request.nextUrl.pathname : new URL(request.nextUrl).pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  if (request.nextUrl instanceof URL || request.nextUrl instanceof NextURL) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
  } else {
    const url = new URL(request.nextUrl);
    url.pathname = `/${locale}${pathname}`;
    request.nextUrl = url;
  }
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}