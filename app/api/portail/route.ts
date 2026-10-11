import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adresseDuSite } from "@/lib/site";
import { creerClientAdmin } from "@/lib/supabase/admin";
import { creerClientServeur } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Ouvre le portail Stripe où le client résilie, change de carte et télécharge ses factures.
// Le client est retrouvé à partir du compte connecté : rien n'est lu dans la requête.
export async function POST(requete: Request) {
  const site = adresseDuSite(requete);
  const supabase = await creerClientServeur();
  if (!supabase) return NextResponse.redirect(`${site}/connexion?erreur=configuration`, 303);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.redirect(`${site}/connexion`, 303);

  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete) return NextResponse.redirect(`${site}/app?portail=erreur`, 303);

  try {
    const stripe = new Stripe(cleSecrete);
    const email = user.email.trim().toLowerCase();

    let clientId: string | null = null;
    const admin = creerClientAdmin();
    if (admin) {
      const { data } = await admin
        .from("abonnements")
        .select("stripe_customer_id")
        .eq("email_client", email)
        .not("stripe_customer_id", "is", null)
        .order("cree_le", { ascending: false })
        .limit(1);
      clientId = data?.[0]?.stripe_customer_id ?? null;
    }
    if (!clientId) {
      const clients = await stripe.customers.list({ email, limit: 1 });
      clientId = clients.data[0]?.id ?? null;
    }
    if (!clientId) return NextResponse.redirect(`${site}/app?portail=introuvable`, 303);

    const session = await stripe.billingPortal.sessions.create({
      customer: clientId,
      return_url: `${site}/app`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (erreur) {
    console.error("Ouverture du portail Stripe impossible", erreur);
    return NextResponse.redirect(`${site}/app?portail=erreur`, 303);
  }
}
