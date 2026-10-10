// Les deux valeurs sont publiques par conception (adresse du projet et clé publiable).
// Les données restent protégées par les règles de sécurité de la base (RLS).
export function configurationSupabase(): { url: string; cle: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) return null;
  return { url, cle };
}
