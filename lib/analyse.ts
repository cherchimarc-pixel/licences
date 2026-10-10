// Calculs de l'analyse : coût par outil et par personne, comptes inutilisés, doublons.

export type OutilLigne = {
  id: string;
  nom: string;
  fonction: string;
  cout_annuel: number | string;
};
export type PersonneLigne = { id: string; nom: string; statut: string };
export type LicenceLigne = {
  id: string;
  outil_id: string;
  personne_id: string | null;
  derniere_utilisation: string | null;
};

export const SEUIL_INACTIVITE_JOURS = 60;

export type CompteInutilise = {
  id: string;
  outilNom: string;
  personneNom: string | null;
  cout: number;
  raison: string;
};

export type Analyse = {
  total: number;
  gaspillage: number;
  coutParOutil: { id: string; nom: string; cout: number; nbComptes: number; coutParCompte: number }[];
  coutParPersonne: { id: string; nom: string; statut: string; cout: number; nbComptes: number }[];
  inutilises: CompteInutilise[];
  doublons: { fonction: string; outils: { nom: string; cout: number }[]; total: number }[];
};

function arrondir(n: number): number {
  return Math.round(n * 100) / 100;
}

export function analyser(
  outils: OutilLigne[],
  personnes: PersonneLigne[],
  licences: LicenceLigne[],
  maintenant: number = Date.now(),
): Analyse {
  const personneParId = new Map(personnes.map((p) => [p.id, p]));
  const outilParId = new Map(outils.map((o) => [o.id, o]));

  const nbComptesParOutil = new Map<string, number>();
  for (const l of licences) {
    nbComptesParOutil.set(l.outil_id, (nbComptesParOutil.get(l.outil_id) ?? 0) + 1);
  }

  const coutParCompte = (outilId: string): number => {
    const outil = outilParId.get(outilId);
    const nb = nbComptesParOutil.get(outilId) ?? 0;
    if (!outil || nb === 0) return 0;
    return Number(outil.cout_annuel) / nb;
  };

  const total = arrondir(outils.reduce((s, o) => s + Number(o.cout_annuel), 0));

  const coutParOutil = outils
    .map((o) => {
      const nb = nbComptesParOutil.get(o.id) ?? 0;
      return {
        id: o.id,
        nom: o.nom,
        cout: Number(o.cout_annuel),
        nbComptes: nb,
        coutParCompte: nb > 0 ? arrondir(Number(o.cout_annuel) / nb) : 0,
      };
    })
    .sort((a, b) => b.cout - a.cout);

  const parPersonne = new Map<string, { cout: number; nbComptes: number }>();
  for (const l of licences) {
    if (!l.personne_id) continue;
    const courant = parPersonne.get(l.personne_id) ?? { cout: 0, nbComptes: 0 };
    courant.cout += coutParCompte(l.outil_id);
    courant.nbComptes += 1;
    parPersonne.set(l.personne_id, courant);
  }
  const coutParPersonne = personnes
    .map((p) => {
      const c = parPersonne.get(p.id) ?? { cout: 0, nbComptes: 0 };
      return { id: p.id, nom: p.nom, statut: p.statut, cout: arrondir(c.cout), nbComptes: c.nbComptes };
    })
    .sort((a, b) => b.cout - a.cout);

  const inutilises: CompteInutilise[] = [];
  for (const l of licences) {
    const outil = outilParId.get(l.outil_id);
    if (!outil) continue;
    const personne = l.personne_id ? personneParId.get(l.personne_id) : undefined;

    let raison: string | null = null;
    if (!l.personne_id || !personne) {
      raison = "Aucune personne associée à ce compte";
    } else if (personne.statut === "parti") {
      raison = "La personne a quitté l'entreprise";
    } else if (l.derniere_utilisation) {
      const jours = Math.floor(
        (maintenant - new Date(`${l.derniere_utilisation}T00:00:00`).getTime()) / 86_400_000,
      );
      if (jours > SEUIL_INACTIVITE_JOURS) raison = `Pas utilisé depuis ${jours} jours`;
    }

    if (raison) {
      inutilises.push({
        id: l.id,
        outilNom: outil.nom,
        personneNom: personne?.nom ?? null,
        cout: arrondir(coutParCompte(l.outil_id)),
        raison,
      });
    }
  }
  inutilises.sort((a, b) => b.cout - a.cout);
  const gaspillage = arrondir(inutilises.reduce((s, c) => s + c.cout, 0));

  const parFonction = new Map<string, OutilLigne[]>();
  for (const o of outils) {
    if (o.fonction === "Autre") continue;
    const liste = parFonction.get(o.fonction) ?? [];
    liste.push(o);
    parFonction.set(o.fonction, liste);
  }
  const doublons = [...parFonction.entries()]
    .filter(([, liste]) => liste.length >= 2)
    .map(([fonction, liste]) => ({
      fonction,
      outils: liste.map((o) => ({ nom: o.nom, cout: Number(o.cout_annuel) })),
      total: arrondir(liste.reduce((s, o) => s + Number(o.cout_annuel), 0)),
    }))
    .sort((a, b) => b.total - a.total);

  return { total, gaspillage, coutParOutil, coutParPersonne, inutilises, doublons };
}
