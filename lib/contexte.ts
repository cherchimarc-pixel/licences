import { redirect } from "next/navigation";
import { entrepriseDe } from "./espace";
import { creerClientServeur } from "./supabase/server";

// Vérifie la session et retourne le client, l'utilisateur et son entreprise.
// Sans session valide, redirige vers la connexion.
export async function contexteEspace() {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const entreprise = await entrepriseDe(supabase, user);
  if (!entreprise) redirect("/connexion?erreur=configuration");

  return { supabase, user, entreprise };
}
