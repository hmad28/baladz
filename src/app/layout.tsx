import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Baladz — Pendidikan Al-Qur’an untuk Kehidupan",
  description:
    "Informasi program pendidikan, pendaftaran santri baru, produk, kabar, dan kajian Baladz.",
  openGraph: {
    title: "Baladz — Pendidikan Al-Qur’an untuk Kehidupan",
    description:
      "Temukan program pendidikan Al-Qur’an yang sesuai untuk setiap tahap tumbuh.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
