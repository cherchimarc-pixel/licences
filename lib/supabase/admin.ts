import { createClient } from "@supabase/supabase-js";

// Client avec la clé de service : il contourne les règles de sécurité de la base.
// À utiliser UNIQUEMENT côté serveur (webhook Stripe, vérification d'accès).
// La clé ne doit jamais commencer par NEXT_PUBLIC_ ni être envoyée au navigateur.
export function creerClientAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) return null;
  return createClient(url, cle, { auth: { persistSession: false, autoRefreshToken: false } });
}
