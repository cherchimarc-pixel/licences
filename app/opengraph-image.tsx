import { ImageResponse } from "next/og";

export const alt = "Licences — Vous payez des logiciels que personne n'utilise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2538f5",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#ffe14d",
            textTransform: "uppercase",
          }}
        >
          Licences
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          Vous payez des logiciels que personne n&apos;utilise.
        </div>
        <div style={{ fontSize: 34, color: "#dfe3ff", display: "flex" }}>
          Comptes inutilisés, doublons, renouvellements.
        </div>
      </div>
    ),
    size,
  );
}
