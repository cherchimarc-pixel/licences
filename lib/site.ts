// Adresse publique du site, sans barre finale.
// En production : NEXT_PUBLIC_SITE_URL (définie dans Vercel).
export function adresseDuSite(requete?: Request): string {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuree) return configuree.replace(/\/$/, "");
  if (requete) return new URL(requete.url).origin;
  return "http://localhost:3000";
}
