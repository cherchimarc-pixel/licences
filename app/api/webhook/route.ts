import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Stripe appelle cette adresse après chaque événement de paiement.
// La signature est vérifiée : sans elle, la requête est rejetée.
export async function POST(requete: Request) {
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  const secretWebhook = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = requete.headers.get("stripe-signature");

  if (!cleSecrete || !secretWebhook || !signature) {
    return NextResponse.json({ erreur: "Configuration manquante" }, { status: 400 });
  }

  const corps = await requete.text();
  const stripe = new Stripe(cleSecrete);

  let evenement: Stripe.Event;
  try {
    evenement = stripe.webhooks.constructEvent(corps, signature, secretWebhook);
  } catch {
    return NextResponse.json({ erreur: "Signature invalide" }, { status: 400 });
  }

  switch (evenement.type) {
    case "checkout.session.completed": {
      const session = evenement.data.object as Stripe.Checkout.Session;
      // À l'étape suivante : enregistrer l'abonnement dans la base (Supabase).
      console.log("Paiement confirmé", session.id, session.customer_details?.email);
      break;
    }
    case "invoice.payment_failed":
    case "customer.subscription.deleted": {
      console.log("Événement d'abonnement", evenement.type);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ recu: true });
}
