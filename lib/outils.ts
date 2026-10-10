// Catégories proposées pour repérer les doublons de fonction.
export const FONCTIONS = [
  "Messagerie",
  "Visioconférence",
  "Gestion de projet",
  "Design",
  "Comptabilité",
  "Signature électronique",
  "Stockage de fichiers",
  "Relation client (CRM)",
  "Développement",
  "Marketing",
  "Autre",
] as const;

export type Fonction = (typeof FONCTIONS)[number];

export function estUneFonction(valeur: string): valeur is Fonction {
  return (FONCTIONS as readonly string[]).includes(valeur);
}

export function formaterEuros(montant: number): string {
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(montant)} €`;
}

export function joursAvant(dateIso: string, maintenant: number = Date.now()): number {
  const cible = new Date(`${dateIso}T00:00:00`).getTime();
  return Math.ceil((cible - maintenant) / 86_400_000);
}

export function formaterDate(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
