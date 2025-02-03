import type { Metadata } from "next";
import { Inter, Mina } from 'next/font/google'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Limiter } from "@/components/Limiter";
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
      <body className={`${inter.className} antialiased bg-gradient-to-br from-primary-darkBlue to-base_2-c1 dark:text-white w-screen`}>
        <Limiter>
          <Header/>
          <div className="flex gap-12">
            <Sidebar/>
            {children}
          </div>
          <Footer/>
        </Limiter>
      </body>
    </html>
  );
}
