import Link from "next/link";

const etapes = [
  {
    titre: "Listez vos abonnements",
    texte: "Nom, prix, date de renouvellement. Vingt minutes suffisent pour une entreprise de 30 personnes.",
  },
  {
    titre: "Associez les comptes aux personnes",
    texte: "Qui a un compte sur quoi, et qui est parti. C'est ce qui permet de savoir où va l'argent.",
  },
  {
    titre: "Lisez l'analyse",
    texte: "Comptes inutilisés, doublons, coût par outil et par personne : tout est chiffré en euros par an.",
  },
];

const benefits = [
  {
    titre: "Tout au même endroit",
    texte: "Chaque abonnement, chaque personne, chaque date de renouvellement dans un seul espace.",
  },
  {
    titre: "Les comptes oubliés, repérés",
    texte: "Les licences d'un salarié parti ou d'un outil que personne n'ouvre ressortent d'elles-mêmes.",
  },
  {
    titre: "Les doublons, mis en évidence",
    texte: "Deux messageries ? Deux outils de design ? Vous voyez ce que ça vous coûte avant de renouveler.",
  },
  {
    titre: "Les échéances sous les yeux",
    texte: "Les renouvellements à venir, du plus proche au plus lointain. Les rappels par e-mail arrivent bientôt.",
  },
];

export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-6 pt-8 sm:px-8 sm:pt-14">
      <p className="font-texte text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>

      <h1 className="mt-5 font-titre text-[2.35rem] font-black leading-[1.05] sm:text-5xl">
        Vous payez des logiciels que personne n&apos;utilise.
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-gris">
        Licences retrouve les abonnements oubliés de votre entreprise, repère
        les comptes inutilisés et les doublons, et vous montre ce que chaque
        outil coûte par an. Pour les entreprises de 10 à 100 personnes, sans
        service informatique.
      </p>

      <div className="mt-8">
        <Link
          href="/commencer"
          className="flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce sm:w-auto sm:min-w-72"
        >
          Estimer ce que vous perdez
        </Link>
        <p className="mt-3 text-sm text-gris">
          Trois questions, deux minutes. Gratuit, sans carte bancaire.
        </p>
      </div>

      <section aria-labelledby="exemple" className="mt-12">
        <h2 id="exemple" className="text-sm font-bold uppercase tracking-[0.14em] text-gris">
          À quoi ressemble l&apos;analyse
        </h2>
        <div className="mt-3 border-2 border-encre bg-white px-5 py-5">
          <p className="font-titre text-5xl font-black leading-none">1&nbsp;840&nbsp;€</p>
          <p className="mt-2 text-base leading-snug">
            par an payés pour des comptes à vérifier.
          </p>
          <ul className="mt-4 divide-y divide-trait border-t border-trait text-base">
            <li className="flex justify-between gap-4 py-3">
              <span>
                <span className="font-bold">Messagerie</span> · salarié parti
              </span>
              <span className="font-bold text-braise">960&nbsp;€</span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span>
                <span className="font-bold">Design</span> · aucun compte actif
              </span>
              <span className="font-bold text-braise">540&nbsp;€</span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span>
                <span className="font-bold">Visioconférence</span> · doublon
              </span>
              <span className="font-bold text-braise">340&nbsp;€</span>
            </li>
          </ul>
        </div>
        <p className="mt-3 text-sm text-gris">
          Exemple illustratif, pas un client réel. Votre chiffre à vous
          dépend de vos outils : l&apos;estimation en trois questions vous donne
          un ordre de grandeur.
        </p>
      </section>

      <section aria-labelledby="etapes" className="mt-12">
        <h2 id="etapes" className="font-titre text-2xl font-bold leading-tight">
          Comment ça marche
        </h2>
        <ol className="mt-5 divide-y divide-trait border-y border-trait">
          {etapes.map((e, i) => (
            <li key={e.titre} className="flex gap-4 py-5">
              <span aria-hidden="true" className="font-titre text-3xl font-black leading-none text-braise">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-snug">{e.titre}</h3>
                <p className="mt-1 leading-relaxed text-gris">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="benefices" className="mt-12">
        <h2 id="benefices" className="font-titre text-2xl font-bold leading-tight">
          Ce que Licences change
        </h2>
        <ul className="mt-5 space-y-5">
          {benefits.map((b) => (
            <li key={b.titre} className="border-l-4 border-braise pl-4">
              <h3 className="text-lg font-bold leading-snug">{b.titre}</h3>
              <p className="mt-1 leading-relaxed text-gris">{b.texte}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="prix" className="mt-12 border-2 border-encre bg-white px-5 py-6">
        <h2 id="prix" className="font-titre text-2xl font-bold leading-tight">
          79&nbsp;€ par mois, pour toute l&apos;entreprise
        </h2>
        <p className="mt-2 text-base leading-relaxed text-gris">
          Soit environ 2,60&nbsp;€ par jour. Sans engagement, avec une garantie
          de remboursement. Un seul compte inutilisé retrouvé peut déjà couvrir
          l&apos;abonnement.
        </p>
        <Link
          href="/commencer"
          className="mt-5 flex min-h-14 w-full items-center justify-center bg-encre px-6 text-lg font-bold text-white transition-opacity active:opacity-80"
        >
          Commencer par l&apos;estimation gratuite
        </Link>
        <Link href="/offre" className="mt-2 flex min-h-12 items-center justify-center text-base font-bold underline underline-offset-4">
          Voir l&apos;offre en détail
        </Link>
      </section>
    </main>
  );
}
