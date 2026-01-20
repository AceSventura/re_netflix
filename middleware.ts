// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Recupera il cookie 'userToken'
    const cookie = request.cookies.get('isLoggedIn');

    // 2. Verifica se il valore è 'true' (o semplicemente se il cookie esiste)
    const isLoggedIn = cookie?.value === 'true';
    const { pathname } = request.nextUrl;

    // LOG DI DEBUG: Appare nel terminale di VS Code ad ogni richiesta
    console.log(`Middleware - Path: ${pathname} | Auth: ${isLoggedIn}`);

    // 3. LOGICA DI PROTEZIONE

    // Se l'utente NON è loggato e tenta di accedere a una pagina protetta
    if (!isLoggedIn && pathname !== '/login') {
        console.log("Middleware -> Log in ");
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se l'utente è loggato e prova a tornare alla pagina di Login
    if (isLoggedIn && pathname === '/login') {
        // Reindirizza alla browse
        return NextResponse.redirect(new URL('/browse', request.url));
    }

    if (isLoggedIn && pathname === '/') {
        return NextResponse.redirect(new URL('/browse', request.url));
    }

    return NextResponse.next();
}

// 4. CONFIGURAZIONE MATCHER
export const config = {
    /*
     * Applica il middleware a tutte le rotte tranne:
     * - api (rotte API)
     * - _next/static (file statici come CSS/JS)
     * - _next/image (ottimizzazione immagini)
     * - favicon.ico e immagini nelle cartelle public (es. images, assets)
     */
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)'],
};