import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
]);

const authMiddleware = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Allow public routes
  if (isPublicRoute(req)) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // If not authenticated, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Email whitelist check is handled in server components (see components/EmailGuard.tsx)
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
});

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return authMiddleware(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

