import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { aUnAbonnementActif } from "@/lib/abonnement";
import { formaterDate, formaterEuros, joursAvant } from "@/lib/outils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JOURS_AVANT_RAPPEL = 30;

type Outil = {
  id: string;
  nom: string;
  cout_annuel: number | string;
  date_renouvellement: string;
  rappel_envoye_le: string | null;
  entreprise_id: string;
};

// Appelée chaque matin par la tâche planifiée de Vercel.
// Envoie un e-mail par outil dont le renouvellement tombe dans les 30 prochains jours.
export async function GET(requete: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ erreur: "non autorisé" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cleService = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const cleEnvoi = process.env.RESEND_API_KEY;
  const expediteur = process.env.RAPPELS_EXPEDITEUR;
  if (!url || !cleService || !cleEnvoi || !expediteur) {
    return NextResponse.json({ erreur: "envoi des rappels non configuré" }, { status: 503 });
  }

  const supabase = createClient(url, cleService, { auth: { persistSession: false } });

  const aujourdhui = new Date().toISOString().slice(0, 10);
  const limite = new Date(Date.now() + JOURS_AVANT_RAPPEL * 86_400_000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("outils")
    .select("id, nom, cout_annuel, date_renouvellement, rappel_envoye_le, entreprise_id")
    .gte("date_renouvellement", aujourdhui)
    .lte("date_renouvellement", limite);
  if (error) {
    console.error("Lecture des échéances impossible", error);
    return NextResponse.json({ erreur: "lecture impossible" }, { status: 500 });
  }

  // Un seul rappel par échéance : on ignore les outils déjà prévenus pour cette date.
  const aPrevenir = ((data ?? []) as Outil[]).filter(
    (o) => !o.rappel_envoye_le || o.rappel_envoye_le < new Date(Date.now() - 60 * 86_400_000).toISOString().slice(0, 10),
  );

  let envoyes = 0;
  const ignores: string[] = [];

  for (const outil of aPrevenir) {
    const { data: entreprise } = await supabase
      .from("entreprises")
      .select("proprietaire_id")
      .eq("id", outil.entreprise_id)
      .maybeSingle();
    if (!entreprise) continue;

    const { data: utilisateur } = await supabase.auth.admin.getUserById(entreprise.proprietaire_id);
    const email = utilisateur.user?.email;
    if (!email) continue;

    // Pas de rappel pour les comptes sans abonnement actif.
    if (!(await aUnAbonnementActif(email))) {
      ignores.push(outil.id);
      continue;
    }

    const jours = joursAvant(outil.date_renouvellement);
    const montant = formaterEuros(Number(outil.cout_annuel));
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cleEnvoi}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: expediteur,
        to: email,
        subject: `${outil.nom} se renouvelle dans ${jours} jour${jours > 1 ? "s" : ""} (${montant})`,
        text:
          `Bonjour,\n\n` +
          `${outil.nom} se renouvelle le ${formaterDate(outil.date_renouvellement)} pour ${montant} par an.\n\n` +
          `Il est encore temps de décider : quelqu'un s'en sert-il vraiment ? ` +
          `Ouvrez votre espace Licences, onglet Analyse, pour voir les comptes inutilisés.\n\n` +
          `L'équipe Licences`,
      }),
    });

    if (!reponse.ok) {
      console.error("Envoi du rappel refusé", reponse.status);
      continue;
    }

    await supabase.from("outils").update({ rappel_envoye_le: aujourdhui }).eq("id", outil.id);
    envoyes += 1;
  }

  return NextResponse.json({ envoyes, ignores: ignores.length });
}
