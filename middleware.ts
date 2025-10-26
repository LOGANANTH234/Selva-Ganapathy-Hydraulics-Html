import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply middleware to /admin routes (but not /admin/login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // This is a client-side check, so we'll let the page handle authentication
    // The actual authentication check happens in the admin page component
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
