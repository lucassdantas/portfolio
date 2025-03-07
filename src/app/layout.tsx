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
  weight:'700',
  
  subsets:['latin']
});

export const metadata: Metadata = {
  title: "Dev Dantas - Portfólio",
  description: "Portfólio de desenvolvedor web Lucas Dantas",
};

export default function RootLayout({children}:Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} overflow-x-hidden antialiased bg-gradient-to-br from-primary-darkBlue to-base_2-c1 dark:text-white w-screen`}>
        <Limiter>
          <Header/>
          <div className="flex gap-12 lg:pt-0 pt-20 overflo-x-hidden lg:h-full h-screen">
            <Sidebar/>
            <main className='relative overflow-x-hidden'>
              {children}
            </main>
          </div>
          <Footer/>
        </Limiter>
      </body>
    </html>
  );
}
