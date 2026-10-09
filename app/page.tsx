import Link from "next/link";

const benefits = [
  {
    titre: "Tout au même endroit",
    texte:
      "Chaque abonnement, chaque équipe, chaque date de renouvellement dans une seule liste.",
  },
  {
    titre: "Les comptes oubliés, repérés",
    texte:
      "Les licences d'un salarié parti ou d'un outil jamais ouvert ressortent d'elles-mêmes.",
  },
  {
    titre: "Un rappel avant de repayer",
    texte:
      "Vous êtes prévenu avant chaque renouvellement annuel, quand il est encore temps de décider.",
  },
];

export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
      <p className="font-texte text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </p>

      <h1 className="mt-5 font-titre text-[2.35rem] font-black leading-[1.05] sm:text-5xl">
        Vous payez des logiciels que personne n&apos;utilise.
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-gris">
        Licences retrouve les abonnements oubliés de votre entreprise, repère
        les comptes inutilisés et les doublons, et vous prévient avant chaque
        renouvellement.
      </p>

      <div className="mt-8">
        <Link
          href="/commencer"
          className="flex min-h-14 w-full items-center justify-center bg-braise px-6 text-lg font-bold text-white transition-colors active:bg-braise-fonce sm:w-auto sm:min-w-72"
        >
          Commencer, c&apos;est gratuit
        </Link>
        <p className="mt-3 text-sm text-gris">
          Trois questions, deux minutes. Sans carte bancaire.
        </p>
      </div>

      <section
        aria-labelledby="douleur"
        className="mt-12 border-y border-trait py-8"
      >
        <h2 id="douleur" className="sr-only">
          Ce que ça coûte
        </h2>
        <p className="font-titre text-6xl font-black leading-none text-encre">
          1&nbsp;840&nbsp;€
        </p>
        <p className="mt-3 text-lg leading-snug">
          par an pour des comptes que personne n&apos;ouvre.
        </p>
        <p className="mt-3 text-sm text-gris">
          Exemple type : une entreprise de 30 personnes, 12 outils, 9
          licences jamais utilisées. Votre chiffre à vous, en trois questions.
        </p>
      </section>

      <section aria-labelledby="benefices" className="mt-10">
        <h2
          id="benefices"
          className="font-titre text-2xl font-bold leading-tight"
        >
          Ce que Licences change
        </h2>
        <ul className="mt-5 divide-y divide-trait border-y border-trait">
          {benefits.map((b, i) => (
            <li key={b.titre} className="flex gap-4 py-5">
              <span
                aria-hidden="true"
                className="font-titre text-3xl font-black leading-none text-braise"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-snug">{b.titre}</h3>
                <p className="mt-1 leading-relaxed text-gris">{b.texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link
          href="/commencer"
          className="flex min-h-14 w-full items-center justify-center bg-encre px-6 text-lg font-bold text-white transition-opacity active:opacity-80 sm:w-auto sm:min-w-72"
        >
          Commencer, c&apos;est gratuit
        </Link>
      </div>

      <footer className="mt-auto pt-12 text-sm text-gris">
        <p>© {new Date().getFullYear()} Licences</p>
      </footer>
    </main>
  );
}
