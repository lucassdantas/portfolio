import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { site } from "@/data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

const title = "Lucas Dantas — Desenvolvedor Full Stack";
const description =
  "Portfólio de Lucas Dantas, desenvolvedor full stack — aplicações web, APIs, automações e sistemas críticos com arquitetura limpa e IA.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s — Lucas Dantas",
  },
  description,
  keywords: [
    "Lucas Dantas",
    "desenvolvedor full stack",
    "desenvolvedor de software",
    "portfólio dev",
    "Node.js",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "chatbots com IA",
    "automação",
    "desenvolvedor Rio de Janeiro",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: site.url,
    siteName: "Lucas Dantas — Portfólio",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem('ldp-theme');document.documentElement.dataset.theme=(t==='light'?'light':'dark')}catch(e){}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Desenvolvedor Full Stack",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rio de Janeiro",
    addressCountry: "BR",
  },
  sameAs: [site.githubUrl, site.linkedinUrl],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
