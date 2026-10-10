import { createBrowserClient } from "@supabase/ssr";

// Client utilisé dans le navigateur (formulaire de connexion).
// NEXT_PUBLIC_* doit être lu littéralement pour être intégré au build.
export function creerClientNavigateur() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) return null;
  return createBrowserClient(url, cle);
}
