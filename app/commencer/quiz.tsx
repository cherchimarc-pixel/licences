"use client";

import Link from "next/link";
import { useState } from "react";
import {
  COUT_LICENCE_MENSUEL,
  DEPARTS,
  EFFECTIFS,
  OUTILS,
  PART_DE_L_EFFECTIF_PAR_OUTIL,
  PRIX_ANNUEL,
  PRIX_MENSUEL,
  calculer,
  euros,
  type Option,
  type Reponses,
} from "@/lib/calcul";

type Question = {
  cle: keyof Reponses;
  titre: string;
  aide: string;
  options: Option[];
};

const questions: Question[] = [
  {
    cle: "effectif",
    titre: "Combien de personnes travaillent dans votre entreprise ?",
    aide: "Salariés, associés et prestataires qui ont des comptes.",
    options: EFFECTIFS,
  },
  {
    cle: "outils",
    titre: "Combien de logiciels payants l'entreprise utilise-t-elle, à peu près ?",
    aide: "Messagerie, design, comptabilité, gestion de projet, signature… Un ordre de grandeur suffit.",
    options: OUTILS,
  },
  {
    cle: "depart",
    titre: "Quand un salarié part, que deviennent ses comptes ?",
    aide: "Choisissez la réponse la plus proche de la réalité.",
    options: DEPARTS,
  },
];

export default function Quiz() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Partial<Reponses>>({});

  const termine = etape >= questions.length;
  const question = questions[etape];
  const progression = Math.round((Math.min(etape, questions.length) / questions.length) * 100);

  function choisir(cle: keyof Reponses, id: string) {
    setReponses((precedentes) => ({ ...precedentes, [cle]: id }));
    setEtape((e) => e + 1);
  }

  function recommencer() {
    setReponses({});
    setEtape(0);
  }

  if (termine) {
    const resultat = calculer(reponses as Reponses);
    if (!resultat) {
      return (
        <section className="mt-8">
          <p className="text-lg">Une réponse manque. Reprenons depuis le début.</p>
          <button
            type="button"
            onClick={recommencer}
            className="mt-6 flex min-h-14 w-full items-center justify-center bg-encre px-6 text-lg font-bold text-white"
          >
            Recommencer
          </button>
        </section>
      );
    }

    return (
      <section aria-live="polite" className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
          Votre estimation
        </p>

        <p className="mt-3 text-lg leading-snug">
          Pour {resultat.effectif.libelle.toLowerCase()} et{" "}
          {resultat.outils.libelle.toLowerCase()} logiciels payants, vous
          dépensez environ {euros(resultat.depenseAnnuelle)} par an en licences.
        </p>

        <p className="mt-6 font-titre text-6xl font-black leading-none">
          {euros(resultat.gaspillageAnnuel)}
        </p>
        <p className="mt-2 text-lg leading-snug">
          par an, estimés payés pour des comptes inutilisés.
        </p>
        <p className="mt-2 text-base text-gris">
          Vous nous avez dit : « {resultat.depart.libelle.toLowerCase()} ».
        </p>

        {resultat.rentable ? (
          <p className="mt-6 border-l-4 border-braise bg-white px-4 py-3 text-base leading-relaxed">
            Licences coûte {euros(PRIX_ANNUEL)} par an ({PRIX_MENSUEL}&nbsp;€ par mois). Si
            l&apos;estimation se confirme, un seul trimestre de comptes oubliés
            repérés couvre déjà une grande partie de l&apos;abonnement.
          </p>
        ) : (
          <p className="mt-6 border-l-4 border-encre bg-white px-4 py-3 text-base leading-relaxed">
            Dans votre situation, l&apos;économie estimée est inférieure au prix
            de Licences ({euros(PRIX_ANNUEL)} par an). Si vos chiffres réels
            sont plus élevés que cette estimation, l&apos;outil peut quand même
            vous servir. Sinon, ce n&apos;est pas pour vous aujourd&apos;hui.
          </p>
        )}

        <div className="mt-8">
          <Link
            href="/offre"
            className="flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce sm:w-auto sm:min-w-72"
          >
            Voir comment le récupérer
          </Link>
          <button
            type="button"
            onClick={recommencer}
            className="mt-4 min-h-12 text-base font-bold underline underline-offset-4"
          >
            Refaire l&apos;estimation
          </button>
        </div>

        <details className="mt-10 border-t border-trait pt-4 text-sm text-gris">
          <summary className="min-h-12 cursor-pointer py-2 font-bold text-encre">
            Comment cette estimation est calculée
          </summary>
          <p className="mt-2 leading-relaxed">
            Nous supposons qu&apos;environ{" "}
            {Math.round(PART_DE_L_EFFECTIF_PAR_OUTIL * 100)}&nbsp;% des
            personnes ont une licence pour chaque outil, à{" "}
            {COUT_LICENCE_MENSUEL}&nbsp;€ par mois en moyenne. Nous appliquons
            ensuite une part de licences inutilisées selon votre réponse sur
            les départs ({Math.round(resultat.depart.valeur * 100)}&nbsp;% dans
            votre cas). C&apos;est une estimation, pas un chiffre mesuré : vos
            vrais montants dépendent de vos abonnements.
          </p>
        </details>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={etape}
        aria-label="Progression"
        className="h-2 w-full bg-trait"
      >
        <div
          className="h-2 bg-braise transition-all"
          style={{ width: `${Math.max(progression, 8)}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-gris">
        Question {etape + 1} sur {questions.length}
      </p>

      <h1 className="mt-4 font-titre text-3xl font-black leading-tight">
        {question.titre}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-gris">{question.aide}</p>

      <ul className="mt-6 space-y-3">
        {question.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => choisir(question.cle, option.id)}
              className="flex min-h-16 w-full items-center border-2 border-encre bg-white px-5 text-left text-lg font-bold leading-snug transition-colors active:bg-encre active:text-white"
            >
              {option.libelle}
            </button>
          </li>
        ))}
      </ul>

      {etape > 0 ? (
        <button
          type="button"
          onClick={() => setEtape((e) => Math.max(e - 1, 0))}
          className="mt-6 min-h-12 text-base font-bold underline underline-offset-4"
        >
          Question précédente
        </button>
      ) : null}
    </section>
  );
}
