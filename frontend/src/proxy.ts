import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/hotel": "HOTEL",
  "/lab": "LAB",
  "/supplier": "SUPPLIER",
  "/admin": "ADMIN",
};

function dashboardPathForRole(role: string): string {
  switch (role) {
    case "HOTEL":
      return "/hotel/dashboard";
    case "LAB":
      return "/lab/dashboard";
    case "SUPPLIER":
      return "/supplier/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((p) => pathname.startsWith(p));
  if (!matchedPrefix) return NextResponse.next();

  const role = request.cookies.get("jp_role")?.value;
  const approval = request.cookies.get("jp_approval")?.value;

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = ROLE_PREFIXES[matchedPrefix];
  if (role !== requiredRole && role !== "ADMIN") {
    return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url));
  }

  if ((role === "SUPPLIER" || role === "LAB") && approval && approval !== "APPROVED") {
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hotel/:path*", "/lab/:path*", "/supplier/:path*", "/admin/:path*"],
};
