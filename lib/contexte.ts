import { redirect } from "next/navigation";
import { aUnAbonnementActif } from "./abonnement";
import { entrepriseDe } from "./espace";
import { creerClientServeur } from "./supabase/server";

// Vérifie la session et retourne le client, l'utilisateur et son entreprise.
// Sans session valide, redirige vers la connexion.
// Sans abonnement actif, redirige vers l'offre.
export async function contexteEspace() {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  if (!(await aUnAbonnementActif(user.email))) {
    redirect("/offre?acces=abonnement");
  }

  const entreprise = await entrepriseDe(supabase, user);
  if (!entreprise) redirect("/connexion?erreur=configuration");

  return { supabase, user, entreprise };
}
