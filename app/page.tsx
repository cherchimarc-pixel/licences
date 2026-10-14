import Link from "next/link";
import Demo from "@/components/demo";
import { Ciel, Planete } from "@/components/ciel";
import Logo from "@/components/logo";

const lignes = [
  { nom: "Slack", detail: "Messagerie · le salarié est parti", montant: "960 €", inutile: true, delai: "0.7s" },
  { nom: "Canva", detail: "Design · aucun compte actif", montant: "540 €", inutile: true, delai: "1.5s" },
  { nom: "Zoom", detail: "Visioconférence · doublon avec Teams", montant: "340 €", inutile: true, delai: "2.3s" },
  { nom: "Google Workspace", detail: "Messagerie · utilisé par 28 personnes", montant: "1 440 €", inutile: false, delai: "0s" },
];

// Pictogrammes génériques par fonction (dessinés pour Licences, pas des logos de marques).
const traits = {
  messagerie: "M4 5h16v11H10l-6 4z",
  visio: "M3 6h12v12H3z M15 10l6-4v12l-6-4z",
  design: "M5 19l1-4L16 5l3 3L9 18z M14 7l3 3",
  projet: "M5 5h14v14H5z M8 12l3 3 5-6",
  stockage: "M3 6h7l2 2h9v11H3z",
  signature: "M4 20h16 M6 16l9-9 3 3-9 9H6z",
  clients: "M12 11a4 4 0 100-8 4 4 0 000 8z M4 21c0-4 4-6 8-6s8 2 8 6",
  compta: "M5 4h14v16H5z M8 8h8 M8 12h2 M12 12h2 M8 16h2 M12 16h2",
  marketing: "M3 10v4h4l7 4V6L7 10z M17 9a4 4 0 010 6",
} as const;

const outilsDefilants: { nom: string; icone: keyof typeof traits }[] = [
  { nom: "Slack", icone: "messagerie" },
  { nom: "Zoom", icone: "visio" },
  { nom: "Canva", icone: "design" },
  { nom: "Notion", icone: "projet" },
  { nom: "Asana", icone: "projet" },
  { nom: "Dropbox", icone: "stockage" },
  { nom: "DocuSign", icone: "signature" },
  { nom: "HubSpot", icone: "clients" },
  { nom: "Mailchimp", icone: "marketing" },
  { nom: "Pennylane", icone: "compta" },
  { nom: "Microsoft 365", icone: "messagerie" },
  { nom: "Google Workspace", icone: "messagerie" },
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
    style: "border-white/30 bg-bleu text-white shadow-[0_0_60px_rgba(37,56,245,0.55)] md:col-span-2",
    texteStyle: "text-white/90",
    grand: true,
  },
  {
    titre: "Les comptes oubliés",
    texte: "La licence d'un salarié parti ou d'un outil que personne n'ouvre ressort d'elle-même.",
    style: "border-surligneur bg-surligneur text-encre shadow-[0_0_60px_rgba(255,225,77,0.35)]",
    texteStyle: "text-encre/80",
    grand: false,
  },
  {
    titre: "Les doublons",
    texte: "Deux messageries ? Deux outils de design ? Vous voyez ce que ça coûte avant de renouveler.",
    style: "border-white/30 bg-white/10 text-white backdrop-blur-sm",
    texteStyle: "text-white/80",
    grand: false,
  },
  {
    titre: "Les échéances à venir",
    texte: "Les renouvellements du plus proche au plus lointain. Les rappels par e-mail arrivent bientôt.",
    style: "border-white/30 bg-gradient-to-br from-violet to-bleu-fonce text-white shadow-[0_0_60px_rgba(124,77,255,0.5)] md:col-span-2",
    texteStyle: "text-white/90",
    grand: true,
  },
];

export default function Accueil() {
  return (
    <div className="espace overflow-x-clip text-white">
      <Ciel />

      <header className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-28 h-72 w-72 md:-right-20 md:top-10 md:h-[28rem] md:w-[28rem]">
          <Planete />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 md:pb-24">
          <div className="flex items-center justify-between gap-4">
            <Logo clair />
            <Link
              href="/app"
              className="flex min-h-12 items-center bg-rose px-5 text-base font-extrabold text-nuit shadow-[0_0_28px_rgba(255,46,147,0.65)] transition-transform active:scale-95"
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
                className="mt-9 flex min-h-16 w-full items-center justify-center bg-surligneur px-6 text-xl font-extrabold text-encre shadow-[6px_6px_0_0_#7c4dff] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto sm:min-w-80"
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
              className="mt-14 bg-white text-encre shadow-[0_0_90px_rgba(124,77,255,0.55)] md:mt-0 md:rotate-[1.5deg]"
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

      <div className="relative bg-surligneur py-4 text-encre shadow-[0_0_60px_rgba(255,225,77,0.35)]">
        <p className="sr-only">
          Des abonnements comme Slack, Zoom, Canva, Notion ou Google Workspace
          sont souvent payés sans être utilisés.
        </p>
        <div aria-hidden="true" className="overflow-hidden">
          <div className="defile">
            {[0, 1].map((copie) => (
              <ul key={copie} className="flex shrink-0 items-center">
                {outilsDefilants.map((outil) => (
                  <li key={outil.nom} className="flex items-center whitespace-nowrap font-titre text-2xl font-extrabold">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-encre text-surligneur">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d={traits[outil.icone]} />
                      </svg>
                    </span>
                    <span className="pl-3 pr-8">{outil.nom}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <main>
        <section aria-labelledby="calcul" className="relative text-white">
          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <h2 id="calcul" className="max-w-3xl font-titre text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              Quelques comptes oubliés coûtent plus cher que Licences.
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="bg-surligneur p-6 text-encre shadow-[0_0_60px_rgba(255,225,77,0.35)] sm:p-8">
                <p className="font-titre text-7xl font-extrabold leading-none tracking-tighter tabular-nums sm:text-8xl">
                  960&nbsp;€
                </p>
                <p className="mt-4 text-lg font-bold leading-snug">par an</p>
                <p className="mt-1 text-base leading-relaxed">
                  Dix comptes oubliés à 8&nbsp;€ par mois.
                </p>
              </div>
              <div className="border-2 border-white/60 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
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
              <li key={e.titre} className="border-t-8 border-surligneur pt-5">
                <span aria-hidden="true" className="font-titre text-8xl font-extrabold leading-none tracking-tighter text-surligneur [text-shadow:0_0_40px_rgba(255,225,77,0.4)]">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-snug">{e.titre}</h3>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{e.texte}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="apports">
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

        <section aria-labelledby="prix">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <div className="border-2 border-encre bg-white p-6 text-encre shadow-[10px_10px_0_0_#ffe14d,0_0_100px_rgba(124,77,255,0.55)] sm:p-10 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
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
