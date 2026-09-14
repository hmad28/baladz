import type { Metadata } from "next";
import { Nunito_Sans, Oswald } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baladz | Pesantren Baladil Huffaadz",
  description:
    "Informasi Pesantren Baladz, kabar kegiatan, kajian, dan pendaftaran santri baru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
