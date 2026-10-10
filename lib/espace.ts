import type { SupabaseClient, User } from "@supabase/supabase-js";

export type Entreprise = { id: string; nom: string };

// Retourne l'entreprise de l'utilisateur, en la créant à la première visite.
// La sécurité (RLS) garantit qu'on ne lit et n'écrit que ses propres lignes.
export async function entrepriseDe(
  supabase: SupabaseClient,
  utilisateur: User,
): Promise<Entreprise | null> {
  const { data: existante } = await supabase
    .from("entreprises")
    .select("id, nom")
    .eq("proprietaire_id", utilisateur.id)
    .limit(1)
    .maybeSingle();
  if (existante) return existante as Entreprise;

  const { data: creee } = await supabase
    .from("entreprises")
    .insert({ nom: "Mon entreprise", proprietaire_id: utilisateur.id })
    .select("id, nom")
    .single();
  return (creee as Entreprise | null) ?? null;
}
