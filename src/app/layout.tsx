import type { Metadata } from "next";
import { Inter, Mina } from 'next/font/google'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const mina = Mina({
  weight:'400'
});

export const metadata: Metadata = {
  title: "Dev Dantas - Portfólio",
  description: "Portfólio de desenvolvedor web Lucas Dantas",
};

export default function RootLayout({children}:Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased`}>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
