import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navigation } from '@/components/navigation'
import Footer from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = "https://argent-noki.com"
const SITE_NAME = "Argent Noki-Noki"
const SITE_DESC =
  "Envoyez de l'argent depuis le Congo-Brazzaville vers l'Afrique de l'Ouest. Simulation instantanée, taux garantis, transfert via WhatsApp en moins d'1 minute."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Transfert Congo → Afrique de l'Ouest`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,

  openGraph: {
    type:        "website",
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} — Transfert Congo → Afrique de l'Ouest`,
    description: SITE_DESC,
    locale:      "fr_FR",
    images: [
      {
        url:    "/og-image.jpg",
        width:  1200,
        height: 630,
        alt:    "Argent Noki-Noki — Transferts Congo vers l'Afrique de l'Ouest",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       `${SITE_NAME} — Transfert Congo → Afrique de l'Ouest`,
    description: SITE_DESC,
    images:      ["/og-image.jpg"],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  alternates: {
    canonical: SITE_URL,
  },

  themeColor: "#C9A84C",

  icons: {
    icon:   "/favicon.ico",
    apple:  "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        {/*
          La Navigation est masquée sur la page d'accueil (/) car celle-ci
          intègre sa propre nav flottante style TerraNova (pill blanc sur hero image).
          Sur toutes les autres pages, la nav standard blanche s'affiche.
        */}
        <InnerLayout>{children}</InnerLayout>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

// Client wrapper pour masquer la nav sur la homepage
import { NavigationWrapper } from '@/components/navigation-wrapper'

function InnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationWrapper>
      {children}
    </NavigationWrapper>
  )
}
