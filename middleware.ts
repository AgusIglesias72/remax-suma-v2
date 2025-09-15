import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/propiedades/nueva(.*)',
  '/perfil(.*)',
  '/favorites(.*)',
  '/agenda(.*)',
  '/mensajes(.*)',
  '/api/auth/(.*)',
  '/admin(.*)',

]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};