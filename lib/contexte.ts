import { redirect } from "next/navigation";
import { accesPayantActif, aUnAbonnementActif } from "./acces";
import { entrepriseDe } from "./espace";
import { creerClientServeur } from "./supabase/server";

// Vérifie la session et retourne le client, l'utilisateur et son entreprise.
// Sans session valide, redirige vers la connexion.
// Quand l'accès payant est activé, sans abonnement actif, redirige vers l'offre.
export async function contexteEspace() {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  if (accesPayantActif() && !(await aUnAbonnementActif(user.email))) {
    redirect("/offre?acces=requis");
  }

  const entreprise = await entrepriseDe(supabase, user);
  if (!entreprise) redirect("/connexion?erreur=configuration");

  return { supabase, user, entreprise };
}
