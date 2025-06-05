import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value;
  const userRole = req.cookies.get("role")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (!userRole || userRole !== "admin") {
    return NextResponse.redirect(new URL("/acesso-negado", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/times", "/notas", "/votos"],
};
