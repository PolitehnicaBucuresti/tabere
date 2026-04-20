import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./site.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poli Summer Camp | Tabere copii UPB",
  description:
    "Tabere urbane POLITEHNICA București pentru copii curioși: activități interactive, ateliere practice și înscriere online.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
