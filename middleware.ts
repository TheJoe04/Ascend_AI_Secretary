import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Protect main app routes
    "/dashboard/:path*",
    "/calls/:path*",
    "/leads/:path*",
    "/messages/:path*",
    "/settings/:path*",
    
    // Protect API routes
    "/api/calls/:path*",
    "/api/leads/:path*",
    "/api/messages/:path*",
    "/api/agent/:path*",
    "/api/analytics/:path*",
    "/api/integrations/:path*",
  ]
}
