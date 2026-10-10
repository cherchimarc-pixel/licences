import { creerClientAdmin } from "./supabase/admin";

// Tant que ACCES_PAYANT n'est pas « oui », l'espace reste ouvert à tous
// (phase de test). Une fois activé, seul un abonnement actif donne accès.
export function accesPayantActif(): boolean {
  return process.env.ACCES_PAYANT === "oui";
}

export async function aUnAbonnementActif(email: string | undefined): Promise<boolean> {
  if (!email) return false;
  const admin = creerClientAdmin();
  if (!admin) return false;

  const { data, error } = await admin
    .from("abonnements")
    .select("id")
    .eq("email_client", email.trim().toLowerCase())
    .eq("statut", "actif")
    .limit(1);

  if (error) {
    console.error("Vérification de l'abonnement impossible", error.message);
    return false;
  }
  return (data ?? []).length > 0;
}
