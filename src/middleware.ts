// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token');
  
//   // Se o token não existir, redireciona para /admin (login)
//   if (!token) {
//     return NextResponse.redirect(new URL('/admin', req.url));
//   }

//   const userRole = getUserRoleFromToken(token.value);

//   function getUserRoleFromToken(token: string): string {
//     const decodedToken = JSON.parse(atob(token.split('.')[1]));
//     return decodedToken.role;
//   }

//   // Se o usuário não for admin, redireciona para /acesso-negado
//   if (userRole !== 'admin') {
//     return NextResponse.redirect(new URL('/acesso-negado', req.url));
//   }

//   // Se for admin, permite o acesso às rotas
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/votos', '/dashboard'], // Protege as rotas de votos e dashboard
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  const userRole = req.cookies.get('role')?.value; 
  if (userRole !== 'user') {
    return NextResponse.redirect(new URL('/acesso-negado', req.url));
  } 

  return NextResponse.next();
}

export const config = {
  matcher: ['/votos', '/dashboard'], // Protege as rotas de votos e dashboard
};
//------------------------------------------
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token');
//   const role = req.cookies.get('role');  // Pegando o role diretamente do cookie

//   // Se não houver token, redireciona para /admin (login)
//   if (!token) {
//     return NextResponse.redirect(new URL('/admin', req.url));
//   }

//   // Se o role for admin, permite o acesso ao /dashboard
//   if (role?.value === 'admin') {
//     return NextResponse.next();
//   }

//   // Se o usuário não for admin, redireciona para /acesso-negado
//   return NextResponse.redirect(new URL('/acesso-negado', req.url));
// }

// export const config = {
//   matcher: ['/votos', '/dashboard'],  // Protege as rotas de votos e dashboard
// };
