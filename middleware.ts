import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionToken = request.cookies.get("session_token")?.value;
    const activeProfileId = request.cookies.get("active_profile_id")?.value;

    const isLoggedIn = Boolean(sessionToken);
    const hasActiveProfile = Boolean(activeProfileId);

    console.log(
        `Middleware - Path: ${pathname} | Auth: ${isLoggedIn} | Profile: ${hasActiveProfile}`
    );

    // 1. Definizione delle rotte
    const isProtectedRoute = pathname.startsWith("/browse") || pathname.startsWith("/watch") || pathname.startsWith("/account");
    const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register";

    // 2. Utente NON autenticato che tenta l'accesso a route protette -> /login
    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Utente autenticato
    if (isLoggedIn) {
        // Impedisce di tornare su root, login o register
        if (isPublicRoute) {
            return NextResponse.redirect(new URL("/browse", request.url));
        }

        // Se non ha un profilo attivo e tenta di accedere a contenuti specifici
        // (es: /watch/123 o /browse/my-list), forziamo il reindirizzamento alla 
        // pagina principale /browse dove avviene la selezione del profilo.
        if (!hasActiveProfile && isProtectedRoute && pathname !== "/browse") {
            return NextResponse.redirect(new URL("/browse", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Applica il middleware a tutte le route tranne:
         * - api (rotte API)
         * - _next/static (file statici)
         * - _next/image (ottimizzazione immagini)
         * - favicon.ico, file multimediali e icone
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};