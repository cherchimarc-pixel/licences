import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protège /app : sans session valide, retour à la connexion.
// Ne s'applique qu'à /app pour ne pas ralentir la page d'accueil.
export async function middleware(requete: NextRequest) {
  let reponse = NextResponse.next({ request: requete });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) {
    return NextResponse.redirect(new URL("/connexion?erreur=configuration", requete.url));
  }

  const supabase = createServerClient(url, cle, {
    cookies: {
      getAll() {
        return requete.cookies.getAll();
      },
      setAll(aEcrire) {
        aEcrire.forEach(({ name, value }) => requete.cookies.set(name, value));
        reponse = NextResponse.next({ request: requete });
        aEcrire.forEach(({ name, value, options }) =>
          reponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() vérifie le jeton auprès de Supabase : on ne se fie pas au seul cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/connexion", requete.url));
  }

  return reponse;
}

export const config = {
  matcher: ["/app/:path*"],
};
