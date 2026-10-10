// Estimation du gaspillage en licences, à partir de trois réponses.
// Les hypothèses sont volontairement prudentes et affichées au visiteur.

export const PRIX_MENSUEL = 79;
export const PRIX_ANNUEL = PRIX_MENSUEL * 12;

// Hypothèses affichées sur l'écran de résultat.
export const PART_DE_L_EFFECTIF_PAR_OUTIL = 0.4; // 40 % des salariés ont une licence pour un outil donné
export const COUT_LICENCE_MENSUEL = 8; // coût moyen d'une licence, en € par mois

export type Option = { id: string; libelle: string; valeur: number };

export const EFFECTIFS: Option[] = [
  { id: "10-25", libelle: "10 à 25 personnes", valeur: 18 },
  { id: "26-50", libelle: "26 à 50 personnes", valeur: 38 },
  { id: "51-100", libelle: "51 à 100 personnes", valeur: 75 },
];

export const OUTILS: Option[] = [
  { id: "moins-10", libelle: "Moins de 10", valeur: 7 },
  { id: "10-20", libelle: "De 10 à 20", valeur: 15 },
  { id: "plus-20", libelle: "Plus de 20", valeur: 25 },
];

// Part des licences payées mais inutilisées, selon ce qui se passe au départ d'un salarié.
export const DEPARTS: Option[] = [
  { id: "jour-meme", libelle: "Je ferme ses comptes le jour même", valeur: 0.05 },
  { id: "certains-restent", libelle: "Certains restent ouverts, sans qu'on sache lesquels", valeur: 0.12 },
  { id: "personne", libelle: "Personne ne s'en occupe", valeur: 0.2 },
];

export type Reponses = {
  effectif: string;
  outils: string;
  depart: string;
};

export type Resultat = {
  effectif: Option;
  outils: Option;
  depart: Option;
  depenseAnnuelle: number;
  gaspillageAnnuel: number;
  rentable: boolean;
};

function arrondiAuxDizaines(n: number): number {
  return Math.round(n / 10) * 10;
}

export function calculer(r: Reponses): Resultat | null {
  const effectif = EFFECTIFS.find((o) => o.id === r.effectif);
  const outils = OUTILS.find((o) => o.id === r.outils);
  const depart = DEPARTS.find((o) => o.id === r.depart);
  if (!effectif || !outils || !depart) return null;

  const licences = effectif.valeur * PART_DE_L_EFFECTIF_PAR_OUTIL * outils.valeur;
  const depenseAnnuelle = arrondiAuxDizaines(licences * COUT_LICENCE_MENSUEL * 12);
  const gaspillageAnnuel = arrondiAuxDizaines(depenseAnnuelle * depart.valeur);

  return {
    effectif,
    outils,
    depart,
    depenseAnnuelle,
    gaspillageAnnuel,
    rentable: gaspillageAnnuel > PRIX_ANNUEL,
  };
}

export function euros(n: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(n)} €`;
}
