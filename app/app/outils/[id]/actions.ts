"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { contexteEspace } from "@/lib/contexte";
import { UUID_REGEX, dateIsoValide } from "@/lib/outils";

export async function ajouterCompte(formData: FormData) {
  const { supabase, entreprise } = await contexteEspace();

  const outilId = String(formData.get("outil_id") ?? "");
  if (!UUID_REGEX.test(outilId)) redirect("/app");
  const retour = `/app/outils/${outilId}`;

  const personneId = String(formData.get("personne_id") ?? "");
  if (!UUID_REGEX.test(personneId)) redirect(`${retour}?erreur=personne`);

  const dateBrute = String(formData.get("derniere_utilisation") ?? "").trim();
  let derniereUtilisation: string | null = null;
  if (dateBrute !== "") {
    if (!dateIsoValide(dateBrute)) redirect(`${retour}?erreur=date`);
    derniereUtilisation = dateBrute;
  }

  // L'outil et la personne doivent appartenir à l'entreprise.
  const { data: outil } = await supabase
    .from("outils")
    .select("id")
    .eq("id", outilId)
    .eq("entreprise_id", entreprise.id)
    .maybeSingle();
  const { data: personne } = await supabase
    .from("personnes")
    .select("id")
    .eq("id", personneId)
    .eq("entreprise_id", entreprise.id)
    .maybeSingle();
  if (!outil || !personne) redirect(`${retour}?erreur=personne`);

  const { data: existant } = await supabase
    .from("licences")
    .select("id")
    .eq("outil_id", outilId)
    .eq("personne_id", personneId)
    .limit(1)
    .maybeSingle();
  if (existant) redirect(`${retour}?erreur=doublon`);

  const { error } = await supabase.from("licences").insert({
    outil_id: outilId,
    personne_id: personneId,
    derniere_utilisation: derniereUtilisation,
  });
  if (error) redirect(`${retour}?erreur=enregistrement`);

  revalidatePath(retour);
  redirect(`${retour}?ajoute=1`);
}

export async function supprimerCompte(formData: FormData) {
  const { supabase } = await contexteEspace();

  const outilId = String(formData.get("outil_id") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!UUID_REGEX.test(outilId)) redirect("/app");
  const retour = `/app/outils/${outilId}`;
  if (!UUID_REGEX.test(id)) redirect(`${retour}?erreur=enregistrement`);

  // La règle de sécurité de la base limite déjà la suppression aux comptes de l'entreprise.
  const { error } = await supabase.from("licences").delete().eq("id", id).eq("outil_id", outilId);
  if (error) redirect(`${retour}?erreur=enregistrement`);

  revalidatePath(retour);
  redirect(retour);
}
