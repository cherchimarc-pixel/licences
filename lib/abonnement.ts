import Stripe from "stripe";
import { creerClientAdmin } from "@/lib/supabase/admin";

// Vrai si un client Stripe portant cette adresse e-mail a un abonnement en cours.
// Choix volontaire : en cas de doute ou d'erreur, l'accès est refusé (jamais ouvert par défaut).
export async function aUnAbonnementActif(email: string | undefined): Promise<boolean> {
  if (!email) return false;

  // 1. La base (alimentée par le webhook Stripe) : rapide.
  const admin = creerClientAdmin();
  if (admin) {
    const { data } = await admin
      .from("abonnements")
      .select("id")
      .eq("email_client", email.trim().toLowerCase())
      .eq("statut", "actif")
      .limit(1);
    if ((data ?? []).length > 0) return true;
  }

  // 2. Secours : interroger Stripe directement (anciens abonnements, webhook en retard).
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete) return false;

  try {
    const stripe = new Stripe(cleSecrete);
    const adresses = Array.from(new Set([email, email.toLowerCase()]));

    for (const adresse of adresses) {
      const clients = await stripe.customers.list({ email: adresse, limit: 10 });
      for (const client of clients.data) {
        const abonnements = await stripe.subscriptions.list({
          customer: client.id,
          status: "all",
          limit: 10,
        });
        if (abonnements.data.some((a) => a.status === "active" || a.status === "trialing")) {
          return true;
        }
      }
    }
    return false;
  } catch (erreur) {
    console.error("Vérification de l'abonnement impossible", erreur);
    return false;
  }
}
