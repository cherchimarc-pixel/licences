import Link from "next/link";
import Demo from "@/components/demo";
import Logo from "@/components/logo";

const lignes = [
  { nom: "Slack", detail: "Messagerie · le salarié est parti", montant: "960 €", inutile: true, delai: "0.7s" },
  { nom: "Canva", detail: "Design · aucun compte actif", montant: "540 €", inutile: true, delai: "1.5s" },
  { nom: "Zoom", detail: "Visioconférence · doublon avec Teams", montant: "340 €", inutile: true, delai: "2.3s" },
  { nom: "Google Workspace", detail: "Messagerie · utilisé par 28 personnes", montant: "1 440 €", inutile: false, delai: "0s" },
];

const outilsDefilants = [
  "Slack",
  "Zoom",
  "Canva",
  "Notion",
  "Asana",
  "Dropbox",
  "DocuSign",
  "HubSpot",
  "Mailchimp",
  "Pennylane",
  "Microsoft 365",
  "Google Workspace",
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
    style: "bg-bleu text-white shadow-[6px_6px_0_0_#0b1437] md:col-span-2",
    texteStyle: "text-white/90",
    grand: true,
  },
  {
    titre: "Les comptes oubliés",
    texte: "La licence d'un salarié parti ou d'un outil que personne n'ouvre ressort d'elle-même.",
    style: "bg-surligneur text-encre shadow-[6px_6px_0_0_#0b1437]",
    texteStyle: "text-encre/80",
    grand: false,
  },
  {
    titre: "Les doublons",
    texte: "Deux messageries ? Deux outils de design ? Vous voyez ce que ça coûte avant de renouveler.",
    style: "bg-white text-encre shadow-[6px_6px_0_0_#2538f5]",
    texteStyle: "text-gris",
    grand: false,
  },
  {
    titre: "Les échéances à venir",
    texte: "Les renouvellements du plus proche au plus lointain. Les rappels par e-mail arrivent bientôt.",
    style: "bg-encre text-white shadow-[6px_6px_0_0_#ffe14d] md:col-span-2",
    texteStyle: "text-white/85",
    grand: true,
  },
];

export default function Accueil() {
  return (
    <div className="overflow-x-clip">
      <header className="bg-bleu text-white">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 md:pb-24">
          <div className="flex items-center justify-between gap-4">
            <Logo clair />
            <Link
              href="/app"
              className="flex min-h-12 items-center border-2 border-white px-4 text-base font-bold transition-colors active:bg-white/15"
            >
              Mon espace
            </Link>
          </div>

          <div className="mt-12 md:mt-20 md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-12">
            <div>
              <h1 className="font-titre text-[3.1rem] font-extrabold leading-[1.22] tracking-tighter sm:text-7xl lg:text-[5.5rem]">
                Vous payez des logiciels{" "}
                <span className="surligne box-decoration-clone px-2 text-encre" style={{ animationDelay: "0.4s" }}>
                  que personne n&apos;utilise.
                </span>
              </h1>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-white/90">
                Licences retrouve les abonnements oubliés de votre entreprise,
                repère les comptes inutilisés et les doublons, et chiffre ce que
                chaque outil vous coûte. Pour les entreprises de 10 à 100
                personnes, sans service informatique.
              </p>
              <Link
                href="/commencer"
                className="mt-9 flex min-h-16 w-full items-center justify-center bg-surligneur px-6 text-xl font-extrabold text-encre shadow-[6px_6px_0_0_#0b1437] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto sm:min-w-80"
              >
                Estimer ce que vous perdez
              </Link>
              <p className="mt-4 text-sm text-white/80">
                Trois questions, deux minutes. Gratuit, sans carte bancaire.
              </p>
              <div className="mt-4">
                <Demo />
              </div>
            </div>

            <section
              aria-labelledby="releve"
              className="mt-14 bg-white text-encre shadow-[10px_10px_0_0_#0b1437] md:mt-0 md:rotate-[1.5deg]"
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
              <div className="flex items-end justify-between gap-4 bg-encre px-4 py-5 text-white">
                <span className="text-base font-bold leading-snug">
                  Payé pour rien
                  <span className="block text-sm font-normal text-white/80">par an</span>
                </span>
                <span className="font-titre text-5xl font-extrabold leading-none tabular-nums text-surligneur">
                  1&nbsp;840&nbsp;€
                </span>
              </div>
            </section>
          </div>
          <p className="mt-6 text-sm text-white/80 md:text-right">
            Exemple illustratif, pas un client réel.
          </p>
        </div>
      </header>

      <div className="border-y-2 border-encre bg-surligneur py-4 text-encre">
        <p className="sr-only">
          Des abonnements comme Slack, Zoom, Canva, Notion ou Google Workspace
          sont souvent payés sans être utilisés.
        </p>
        <div aria-hidden="true" className="overflow-hidden">
          <div className="defile">
            {[0, 1].map((copie) => (
              <ul key={copie} className="flex shrink-0 items-center">
                {outilsDefilants.map((nom) => (
                  <li key={nom} className="flex items-center whitespace-nowrap font-titre text-2xl font-extrabold">
                    <span className="px-6">{nom}</span>
                    <span className="h-3 w-3 shrink-0 bg-encre" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <main>
        <section aria-labelledby="calcul" className="bg-encre text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <h2 id="calcul" className="max-w-3xl font-titre text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              Quelques comptes oubliés coûtent plus cher que Licences.
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="bg-surligneur p-6 text-encre sm:p-8">
                <p className="font-titre text-7xl font-extrabold leading-none tracking-tighter tabular-nums sm:text-8xl">
                  960&nbsp;€
                </p>
                <p className="mt-4 text-lg font-bold leading-snug">par an</p>
                <p className="mt-1 text-base leading-relaxed">
                  Dix comptes oubliés à 8&nbsp;€ par mois.
                </p>
              </div>
              <div className="border-2 border-white p-6 sm:p-8">
                <p className="font-titre text-7xl font-extrabold leading-none tracking-tighter tabular-nums sm:text-8xl">
                  948&nbsp;€
                </p>
                <p className="mt-4 text-lg font-bold leading-snug">par an</p>
                <p className="mt-1 text-base leading-relaxed text-white/85">
                  Licences : 79&nbsp;€ par mois, pour toute l&apos;entreprise.
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm text-white/75">
              Calcul d&apos;exemple. Vos prix peuvent être différents.
            </p>
          </div>
        </section>

        <section aria-labelledby="etapes" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <h2 id="etapes" className="max-w-2xl font-titre text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Trois étapes, une vingtaine de minutes.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {etapes.map((e, i) => (
              <li key={e.titre} className="border-t-8 border-bleu pt-5">
                <span aria-hidden="true" className="font-titre text-8xl font-extrabold leading-none tracking-tighter text-bleu">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-snug">{e.titre}</h3>
                <p className="mt-2 text-lg leading-relaxed text-gris">{e.texte}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="apports" className="border-y-2 border-encre bg-papier">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <h2 id="apports" className="max-w-2xl font-titre text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              Ce que Licences vous montre.
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {apports.map((a) => (
                <li key={a.titre} className={`border-2 border-encre p-6 sm:p-8 ${a.style}`}>
                  <h3 className={`font-titre font-extrabold leading-tight tracking-tight ${a.grand ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                    {a.titre}
                  </h3>
                  <p className={`mt-3 text-lg leading-relaxed ${a.texteStyle}`}>{a.texte}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="prix" className="bg-bleu">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <div className="border-2 border-encre bg-white p-6 shadow-[10px_10px_0_0_#ffe14d] sm:p-10 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
              <div>
                <h2 id="prix" className="font-titre text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
                  79&nbsp;€ par mois, pour toute l&apos;entreprise.
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-gris">
                  Soit environ 2,60&nbsp;€ par jour. Sans engagement, avec une
                  garantie de remboursement. Un seul compte inutilisé retrouvé
                  peut déjà couvrir l&apos;abonnement.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:min-w-80">
                <Link
                  href="/commencer"
                  className="flex min-h-16 w-full items-center justify-center bg-bleu px-6 text-xl font-extrabold text-white transition-colors active:bg-bleu-fonce"
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
          </div>
        </section>
      </main>
    </div>
  );
}
