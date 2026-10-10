import Stripe from "stripe";

// Vrai si un client Stripe portant cette adresse e-mail a un abonnement en cours.
// Choix volontaire : en cas de doute ou d'erreur, l'accès est refusé (jamais ouvert par défaut).
export async function aUnAbonnementActif(email: string | undefined): Promise<boolean> {
  const cleSecrete = process.env.STRIPE_SECRET_KEY;
  if (!cleSecrete || !email) return false;

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
