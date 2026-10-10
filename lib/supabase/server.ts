import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { configurationSupabase } from "./env";

// Client utilisé côté serveur (pages, routes). Lit et écrit la session dans les cookies.
export async function creerClientServeur() {
  const config = configurationSupabase();
  if (!config) return null;

  const magasinCookies = await cookies();

  return createServerClient(config.url, config.cle, {
    cookies: {
      getAll() {
        return magasinCookies.getAll();
      },
      setAll(aEcrire) {
        try {
          aEcrire.forEach(({ name, value, options }) =>
            magasinCookies.set(name, value, options),
          );
        } catch {
          // Appelé depuis une page : l'écriture est faite par le middleware.
        }
      },
    },
  });
}
