import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Licences — Les logiciels payés par l'entreprise et utilisés par personne",
  description:
    "Retrouvez les abonnements oubliés, les comptes inutilisés et les doublons avant qu'ils ne se renouvellent. Pour les entreprises de 10 à 100 personnes.",
  openGraph: {
    title: "Vous payez des logiciels que personne n'utilise",
    description:
      "Licences repère les comptes inutilisés et les doublons, et vous prévient avant chaque renouvellement.",
    type: "website",
    locale: "fr_FR",
    siteName: "Licences",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vous payez des logiciels que personne n'utilise",
    description:
      "Licences repère les comptes inutilisés et les doublons, et vous prévient avant chaque renouvellement.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
