import { NextResponse } from "next/server";
import Stripe from "stripe";
import { creerClientAdmin } from "@/lib/supabase/admin";

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

  const admin = creerClientAdmin();
  if (!admin) {
    // Stripe réessaiera : on ne perd pas l'événement.
    console.error("Clé de service Supabase absente : abonnement non enregistré");
    return NextResponse.json({ erreur: "Configuration manquante" }, { status: 500 });
  }

  const identifiant = (x: unknown): string | null =>
    typeof x === "string" ? x : x && typeof x === "object" && "id" in x ? String((x as { id: unknown }).id) : null;

  let erreurBase: { message: string } | null = null;

  switch (evenement.type) {
    case "checkout.session.completed": {
      const session = evenement.data.object as Stripe.Checkout.Session;
      const abonnement = identifiant(session.subscription);
      const email = (session.customer_details?.email ?? session.customer_email ?? "")
        .trim()
        .toLowerCase();
      if (abonnement && email) {
        const { error } = await admin.from("abonnements").upsert(
          {
            email_client: email,
            stripe_customer_id: identifiant(session.customer),
            stripe_subscription_id: abonnement,
            statut: "actif",
          },
          { onConflict: "stripe_subscription_id" },
        );
        erreurBase = error;
      }
      break;
    }
    case "invoice.payment_failed": {
      const facture = evenement.data.object as Stripe.Invoice;
      const client = identifiant(facture.customer);
      if (client) {
        const { error } = await admin
          .from("abonnements")
          .update({ statut: "impaye" })
          .eq("stripe_customer_id", client)
          .eq("statut", "actif");
        erreurBase = error;
      }
      break;
    }
    case "invoice.paid": {
      const facture = evenement.data.object as Stripe.Invoice;
      const client = identifiant(facture.customer);
      if (client) {
        const { error } = await admin
          .from("abonnements")
          .update({ statut: "actif" })
          .eq("stripe_customer_id", client)
          .eq("statut", "impaye");
        erreurBase = error;
      }
      break;
    }
    case "customer.subscription.deleted": {
      const abonnement = evenement.data.object as Stripe.Subscription;
      const { error } = await admin
        .from("abonnements")
        .update({ statut: "resilie" })
        .eq("stripe_subscription_id", abonnement.id);
      erreurBase = error;
      break;
    }
    default:
      break;
  }

  if (erreurBase) {
    console.error("Enregistrement de l'abonnement impossible", erreurBase.message);
    return NextResponse.json({ erreur: "Base indisponible" }, { status: 500 });
  }

  return NextResponse.json({ recu: true });
}
