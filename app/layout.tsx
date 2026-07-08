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

export const metadata: Metadata = {
  title: 'Argent Noki-Noki — Transfert Congo → Sénégal',
  description: "Envoyez de l'argent du Congo-Brazzaville vers le Sénégal. Commission fixe 11,5%. Simple, rapide et transparent.",
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
