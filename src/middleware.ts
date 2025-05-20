import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { routeAccessMap } from "@/lib/settings";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

// Setup route matchers for role-based access
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

// Function to chain middlewares
function chainMiddleware(req: NextRequest, middlewares: Array<(req: NextRequest) => Promise<NextResponse | undefined> | NextResponse | undefined>) {
  return async () => {
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result) {
        return result;
      }
    }
    return undefined;
  };
}

// Export the middleware
export default clerkMiddleware(async (auth, req) => {
  // First apply Clerk's authentication logic
  const { sessionClaims } =  await auth();  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Check role-based access
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && role && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  // Then apply the internationalization middleware
  return intlMiddleware(req);
});

// Combine the matchers from both middlewares
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};