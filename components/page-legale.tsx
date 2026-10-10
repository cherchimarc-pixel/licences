import Link from "next/link";

export default function PageLegale({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-dvh max-w-xl px-5 pb-12 pt-8 sm:px-8 sm:pt-14">
      <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-braise">
        Licences
      </Link>
      <h1 className="mt-5 font-titre text-4xl font-black leading-tight">{titre}</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed [&_h2]:mt-8 [&_h2]:font-titre [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight">
        {children}
      </div>
    </main>
  );
}

/** Marque visiblement une information encore à renseigner. */
export function AComplete({ children }: { children: React.ReactNode }) {
  return <mark className="bg-braise/20 px-1 font-bold">[À COMPLÉTER : {children}]</mark>;
}
