import Link from "next/link";

const lignes = [
  { nom: "Slack", detail: "Messagerie · le salarié est parti", montant: "960 €", inutile: true, delai: "0.7s" },
  { nom: "Canva", detail: "Design · aucun compte actif", montant: "540 €", inutile: true, delai: "1.5s" },
  { nom: "Zoom", detail: "Visioconférence · doublon avec Teams", montant: "340 €", inutile: true, delai: "2.3s" },
  { nom: "Google Workspace", detail: "Messagerie · utilisé par 28 personnes", montant: "1 440 €", inutile: false, delai: "0s" },
];

const etapes = [
  {
    titre: "Listez vos abonnements",
    texte: "Le nom, le prix et la date de renouvellement de chaque logiciel. Une vingtaine de minutes pour une entreprise de 30 personnes.",
  },
  {
    titre: "Dites qui a un compte sur quoi",
    texte: "Ajoutez vos collaborateurs et associez-leur leurs comptes. Marquez ceux qui sont partis.",
  },
  {
    titre: "Lisez ce que vous perdez",
    texte: "Comptes inutilisés, doublons, coût par outil et par personne : tout est chiffré en euros par an.",
  },
];

const apports = [
  {
    titre: "Tous vos abonnements au même endroit",
    texte: "Chaque outil, chaque personne, chaque date de renouvellement dans un seul espace.",
  },
  {
    titre: "Les comptes oubliés",
    texte: "La licence d'un salarié parti ou d'un outil que personne n'ouvre ressort d'elle-même.",
  },
  {
    titre: "Les doublons",
    texte: "Deux messageries ? Deux outils de design ? Vous voyez ce que ça coûte avant de renouveler.",
  },
  {
    titre: "Les échéances à venir",
    texte: "Les renouvellements du plus proche au plus lointain. Les rappels par e-mail arrivent bientôt.",
  },
];

export default function Accueil() {
  return (
    <div>
      <header className="bg-bleu text-white">
        <div className="mx-auto max-w-5xl px-5 pb-14 pt-6 sm:px-8 md:pb-20">
          <p className="font-titre text-xl font-extrabold tracking-tight">Licences</p>

          <div className="mt-10 md:mt-16 md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14">
            <div>
              <h1 className="font-titre text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
                Vous payez des logiciels que personne n&apos;utilise.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90">
                Licences retrouve les abonnements oubliés de votre entreprise,
                repère les comptes inutilisés et les doublons, et chiffre ce que
                chaque outil vous coûte. Pour les entreprises de 10 à 100
                personnes, sans service informatique.
              </p>
              <Link
                href="/commencer"
                className="mt-8 flex min-h-14 w-full items-center justify-center bg-surligneur px-6 text-lg font-bold text-encre transition-transform active:translate-y-0.5 sm:w-auto sm:min-w-72"
              >
                Estimer ce que vous perdez
              </Link>
              <p className="mt-3 text-sm text-white/80">
                Trois questions, deux minutes. Gratuit, sans carte bancaire.
              </p>
            </div>

            <section
              aria-labelledby="releve"
              className="mt-12 bg-white text-encre shadow-[6px_6px_0_0_#0b1437] md:mt-0"
            >
              <h2 id="releve" className="px-4 pb-3 pt-4 text-sm font-bold text-gris">
                Exemple : relevé d&apos;une entreprise de 30 personnes
              </h2>
              <ul className="border-t-2 border-encre">
                {lignes.map((l) => (
                  <li
                    key={l.nom}
                    className={`flex items-start justify-between gap-4 border-b border-trait px-4 py-3 ${
                      l.inutile ? "surligne" : ""
                    }`}
                    style={l.inutile ? { animationDelay: l.delai } : undefined}
                  >
                    <span>
                      <span className="block text-lg font-bold leading-snug">{l.nom}</span>
                      <span className="block text-sm text-gris">{l.detail}</span>
                    </span>
                    <span className="whitespace-nowrap text-lg font-bold tabular-nums">
                      {l.montant}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between gap-4 bg-encre px-4 py-4 text-white">
                <span className="text-base font-bold leading-snug">
                  Payé pour rien
                  <span className="block text-sm font-normal text-white/80">par an</span>
                </span>
                <span className="font-titre text-4xl font-extrabold leading-none tabular-nums text-surligneur">
                  1&nbsp;840&nbsp;€
                </span>
              </div>
            </section>
          </div>
          <p className="mt-5 text-sm text-white/80 md:text-right">
            Exemple illustratif, pas un client réel.
          </p>
        </div>
      </header>

      <main>
        <section aria-labelledby="etapes" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-20">
          <h2 id="etapes" className="max-w-lg font-titre text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Trois étapes, une vingtaine de minutes.
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {etapes.map((e, i) => (
              <li key={e.titre} className="border-t-4 border-bleu pt-4">
                <span aria-hidden="true" className="font-titre text-6xl font-extrabold leading-none text-bleu">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug">{e.titre}</h3>
                <p className="mt-2 leading-relaxed text-gris">{e.texte}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="apports" className="border-y-2 border-encre bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-20">
            <h2 id="apports" className="max-w-lg font-titre text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Ce que Licences vous montre.
            </h2>
            <ul className="mt-10 grid md:grid-cols-2 md:gap-x-14">
              {apports.map((a) => (
                <li key={a.titre} className="border-b border-trait py-6">
                  <h3 className="text-xl font-bold leading-snug">{a.titre}</h3>
                  <p className="mt-1 leading-relaxed text-gris">{a.texte}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="prix" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-20">
          <div className="border-2 border-encre bg-white p-6 shadow-[6px_6px_0_0_#2538f5] sm:p-10 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <h2 id="prix" className="font-titre text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                79&nbsp;€ par mois, pour toute l&apos;entreprise.
              </h2>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-gris">
                Soit environ 2,60&nbsp;€ par jour. Sans engagement, avec une
                garantie de remboursement. Un seul compte inutilisé retrouvé
                peut déjà couvrir l&apos;abonnement.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:min-w-72">
              <Link
                href="/commencer"
                className="flex min-h-14 w-full items-center justify-center bg-bleu px-6 text-lg font-bold text-white transition-colors active:bg-bleu-fonce"
              >
                Commencer par l&apos;estimation gratuite
              </Link>
              <Link
                href="/offre"
                className="mt-2 flex min-h-12 items-center justify-center text-base font-bold underline underline-offset-4"
              >
                Voir l&apos;offre en détail
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
