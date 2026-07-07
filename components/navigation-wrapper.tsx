"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

/**
 * NavigationWrapper :
 * - Sur "/" (accueil) : pas de nav ni footer global (la page a les siens intégrés sur le hero)
 * - Sur les autres pages : nav blanche standard + footer + bouton WhatsApp flottant
 */
export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  if (isHome) {
    return (
      <>
        {children}
        <FloatingWhatsApp />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
