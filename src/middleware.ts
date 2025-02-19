import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Todos os cookies recebidos:", req.cookies.getAll());

  const token = req.cookies.get("token")?.value;
  const userRole = req.cookies.get("role")?.value;

  console.log("Middleware - Token recebido:", token);
  console.log("Middleware - Role recebida:", userRole);

  if (!token) {
    console.log("Redirecionando para /admin por falta de token");
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (!userRole || userRole !== "admin") {
    console.log("Redirecionando para /acesso-negado por role inválida");
    return NextResponse.redirect(new URL("/acesso-negado", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/votos", "/dashboard", "/times"],
};
