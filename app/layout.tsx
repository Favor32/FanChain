import type { Metadata } from "next";

import "./globals.css";
import WalletProvider from "./WalletProvider";

import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanchain",
  description: "Claim real World Cup moments as on-chain collectibles, the instant they happen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <WalletProvider>
    <nav
  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
>
      
      <a href="/"
        className="text-xl tracking-widest"
        style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
      >
        FANCHAIN
      </a>
      <div className="flex flex-wrap gap-4 sm:gap-8 text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
  <a href="/" className="hover:underline">Home</a>
  <a href="/live" className="hover:underline">Live Room</a>
  <a href="/how-it-works" className="hover:underline">How It Works</a>
  <a href="/docs" className="hover:underline">Docs</a>
</div>
    </nav>
    {children}
  </WalletProvider>
</body>
    </html>
  );
}