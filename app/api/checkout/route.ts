import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adresseDuSite } from "@/lib/site";

export const runtime = "nodejs";

// Crée une session de paiement Stripe pour l'abonnement et y redirige.
// Aucune donnée n'est lue dans la requête : le tarif vient du serveur.
export async function POST(requete: Request) {
  const site = adresseDuSite(requete);
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  const tarif = process.env.STRIPE_PRICE_ID;

  if (!cleSecrete || !tarif) {
    return NextResponse.redirect(`${site}/commencer?paiement=echec`, 303);
  }

  try {
    const stripe = new Stripe(cleSecrete);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: tarif, quantity: 1 }],
      locale: "fr",
      success_url: `${site}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/commencer?paiement=annule`,
    });

    if (!session.url) {
      return NextResponse.redirect(`${site}/commencer?paiement=echec`, 303);
    }
    return NextResponse.redirect(session.url, 303);
  } catch (erreur) {
    console.error("Création de la session de paiement impossible", erreur);
    return NextResponse.redirect(`${site}/commencer?paiement=echec`, 303);
  }
}
