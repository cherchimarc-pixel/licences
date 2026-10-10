"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { contexteEspace } from "@/lib/contexte";
import { UUID_REGEX } from "@/lib/outils";

export async function ajouterPersonne(formData: FormData) {
  const { supabase, entreprise } = await contexteEspace();

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (nom.length < 1 || nom.length > 120) redirect("/app/personnes?erreur=nom");
  if (email !== "" && (email.length > 254 || !email.includes("@"))) {
    redirect("/app/personnes?erreur=email");
  }

  const { error } = await supabase.from("personnes").insert({
    entreprise_id: entreprise.id,
    nom,
    email: email === "" ? null : email,
  });
  if (error) redirect("/app/personnes?erreur=enregistrement");

  revalidatePath("/app/personnes");
  redirect("/app/personnes?ajoute=1");
}

export async function marquerParti(formData: FormData) {
  const { supabase, entreprise } = await contexteEspace();

  const id = String(formData.get("id") ?? "");
  if (!UUID_REGEX.test(id)) redirect("/app/personnes?erreur=enregistrement");

  const { error } = await supabase
    .from("personnes")
    .update({ statut: "parti", date_depart: new Date().toISOString().slice(0, 10) })
    .eq("id", id)
    .eq("entreprise_id", entreprise.id);
  if (error) redirect("/app/personnes?erreur=enregistrement");

  revalidatePath("/app/personnes");
  redirect("/app/personnes");
}

export async function supprimerPersonne(formData: FormData) {
  const { supabase, entreprise } = await contexteEspace();

  const id = String(formData.get("id") ?? "");
  if (!UUID_REGEX.test(id)) redirect("/app/personnes?erreur=enregistrement");

  const { error } = await supabase
    .from("personnes")
    .delete()
    .eq("id", id)
    .eq("entreprise_id", entreprise.id);
  if (error) redirect("/app/personnes?erreur=enregistrement");

  revalidatePath("/app/personnes");
  redirect("/app/personnes");
}
