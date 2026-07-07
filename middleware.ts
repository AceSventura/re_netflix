// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route accessibili senza sessione attiva
const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionToken = request.cookies.get("session_token")?.value;
    const activeProfileId = request.cookies.get("active_profile_id")?.value;

    const isLoggedIn = Boolean(sessionToken);
    const hasActiveProfile = Boolean(activeProfileId);

    console.log(
        `Middleware - Path: ${pathname} | Auth: ${isLoggedIn} | Profile: ${hasActiveProfile}`
    );

    // 1. Non loggato e prova ad accedere a una route protetta -> /login
    if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Loggato ma prova a tornare al login -> /browse
    if (isLoggedIn && pathname === "/login") {
        return NextResponse.redirect(new URL("/browse", request.url));
    }

    // 3. Root -> redirect a seconda dello stato
    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(isLoggedIn ? "/browse" : "/login", request.url)
        );
    }

    // 4. Loggato ma senza profilo attivo e prova ad accedere a contenuti
    //    (tutto ciò che sta sotto /browse tranne la pagina di selezione stessa)
    const isProfileSelectionPage = pathname === "/browse";
    if (isLoggedIn && !hasActiveProfile && pathname.startsWith("/browse/") && !isProfileSelectionPage) {
        return NextResponse.redirect(new URL("/browse", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/browse/:path*"],
};