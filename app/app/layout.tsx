import { redirect } from "next/navigation";
import { aUnAbonnementActif } from "@/lib/abonnement";
import { creerClientServeur } from "@/lib/supabase/server";

// Accès réservé aux abonnés : l'adresse e-mail du compte doit être celle utilisée au paiement.
export default async function LayoutEspace({ children }: { children: React.ReactNode }) {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  if (!(await aUnAbonnementActif(user.email))) redirect("/offre?acces=abonnement");

  return children;
}
