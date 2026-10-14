// Logo : un « L » dont le pied est surligné au stylo, comme les lignes repérées par l'analyse.
export function Marque({ clair = false, taille = 36 }: { clair?: boolean; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" fill={clair ? "#ffffff" : "#2538f5"} />
      <rect x="13" y="9" width="8" height="30" fill={clair ? "#2538f5" : "#ffffff"} />
      <rect x="13" y="31" width="24" height="8" fill={clair ? "#ff2e93" : "#ffe14d"} />
    </svg>
  );
}

export default function Logo({ clair = false }: { clair?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Marque clair={clair} />
      <span className="font-titre text-2xl font-extrabold leading-none tracking-tight">Licences</span>
    </span>
  );
}
