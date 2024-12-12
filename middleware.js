import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = ["/cashier", "/manager"];
const managerEmails = ['davxgnu@tamu.edu', 'djw9699@tamu.edu', 'oscartsai26@tamu.edu', 'yxn5165@tamu.edu'];

/**
 * Middleware to protect routes that require authentication.
 * @param {Request} req The incoming request
 * @returns {Response} The response to return
 */
export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get session token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url); // Preserve the user's destination
      return NextResponse.redirect(loginUrl);
    }

    // Check if the user is trying to access the manager page (EDIT THIS WHEN TESTING TO ACCESS MANAGER PAGE)
    if (pathname.startsWith("/manager") && !managerEmails.includes(token.email)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cashier/:path*", "/manager/:path*"], // Apply middleware to specific routes
};