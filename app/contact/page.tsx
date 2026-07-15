import type { Metadata } from "next"
import ContactClient from "@/components/contact-client"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Argent Noki-Noki pour toute question ou pour valider votre transfert d'argent en direct sur WhatsApp.",
  alternates: {
    canonical: "https://argent-noki.com/contact",
  },
}

export default function ContactPage() {
  return <ContactClient />
}
