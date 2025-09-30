import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/add-job', '/jobs(.*)', '/stats'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

// In my Jobify project I use Clerk middleware to protect certain routes. The idea is simple: some pages like /add-job, /jobs, and /stats should only be accessible to logged-in users. For this, I define a route matcher that marks these routes as protected.

// Then, inside the middleware, for every request I check: if the request matches a protected route, I call auth().protect(). That tells Clerk to enforce authentication—so if the user isn’t logged in, Clerk blocks the request and redirects them to the sign-in page.

// The config at the bottom ensures this middleware runs for all app routes and API routes, but skips static files.

// So in short, this middleware acts like a security guard. If a user tries to visit sensitive routes without being logged in, they’re stopped at the door and asked to sign in first.
