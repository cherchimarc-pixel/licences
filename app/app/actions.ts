"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { entrepriseDe } from "@/lib/espace";
import { estUneFonction } from "@/lib/outils";
import { creerClientServeur } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

async function contexte() {
  const supabase = await creerClientServeur();
  if (!supabase) redirect("/connexion?erreur=configuration");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const entreprise = await entrepriseDe(supabase, user);
  if (!entreprise) redirect("/app?erreur=enregistrement");
  return { supabase, entreprise };
}

export async function ajouterOutil(formData: FormData) {
  const { supabase, entreprise } = await contexte();

  const nom = String(formData.get("nom") ?? "").trim();
  const fonction = String(formData.get("fonction") ?? "");
  const periode = String(formData.get("periode") ?? "");
  const montantBrut = String(formData.get("montant") ?? "").trim().replace(",", ".");
  const dateBrute = String(formData.get("date_renouvellement") ?? "").trim();

  if (nom.length < 1 || nom.length > 120) redirect("/app?erreur=nom");
  if (!estUneFonction(fonction)) redirect("/app?erreur=fonction");
  if (periode !== "mois" && periode !== "an") redirect("/app?erreur=periode");

  const montant = Number(montantBrut);
  if (montantBrut === "" || !Number.isFinite(montant) || montant < 0 || montant > 100_000) {
    redirect("/app?erreur=montant");
  }
  const coutAnnuel = Math.round((periode === "mois" ? montant * 12 : montant) * 100) / 100;

  let dateRenouvellement: string | null = null;
  if (dateBrute !== "") {
    if (!DATE_ISO.test(dateBrute) || Number.isNaN(new Date(`${dateBrute}T00:00:00`).getTime())) {
      redirect("/app?erreur=date");
    }
    dateRenouvellement = dateBrute;
  }

  const { error } = await supabase.from("outils").insert({
    entreprise_id: entreprise.id,
    nom,
    fonction,
    cout_annuel: coutAnnuel,
    date_renouvellement: dateRenouvellement,
  });
  if (error) redirect("/app?erreur=enregistrement");

  revalidatePath("/app");
  redirect("/app?ajoute=1");
}

export async function supprimerOutil(formData: FormData) {
  const { supabase, entreprise } = await contexte();

  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) redirect("/app?erreur=enregistrement");

  const { error } = await supabase
    .from("outils")
    .delete()
    .eq("id", id)
    .eq("entreprise_id", entreprise.id);
  if (error) redirect("/app?erreur=enregistrement");

  revalidatePath("/app");
  redirect("/app");
}
