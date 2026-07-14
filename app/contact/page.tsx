import { useState } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Argent Noki-Noki pour toute question ou pour valider votre transfert d'argent en direct sur WhatsApp.",
  alternates: {
    canonical: "https://argent-noki.com/contact",
  },
}
import { MessageCircle, Clock, Send, ShieldAlert, ArrowUpRight } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/calculator"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    message: "",
  })
  
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom || !formData.telephone) {
      setStatus("error")
      return
    }

    setStatus("sending")
    
    // Simulate submission and redirect/open WhatsApp with custom text or success callback
    setTimeout(() => {
      setStatus("success")
      const text = `Bonjour Argent Noki-Noki,\n\nJe m'appelle ${formData.nom} (Tél: ${formData.telephone}).\nMessage : ${formData.message}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    }, 800)
  }

  const genericWhatsAppLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Bonjour Argent Noki-Noki, je souhaite entrer en contact avec un conseiller."
  )}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Contactez un Conseiller
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Nous sommes à votre disposition pour vous répondre en direct et valider vos transferts de fonds.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5 items-start max-w-4xl mx-auto">
        {/* Info Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6 card-shadow space-y-4">
            <h3 className="text-lg font-bold text-ink-soft">Direct WhatsApp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pour une rapidité maximale, discutez directement avec notre équipe. Cliquez sur le lien pour démarrer la discussion.
            </p>
            <a
              href={genericWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              <span>Ouvrir WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 card-shadow space-y-3">
            <div className="flex items-center gap-2 text-ink-soft">
              <Clock className="h-4 w-4 text-gold" />
              <h4 className="text-sm font-bold">Disponibilité</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Notre équipe traite les transferts en moins d'1 minute.<br />
              <strong>Lundi - Dimanche :</strong> 8h00 - 22h00
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 rounded-2xl border border-border bg-white p-6 card-shadow space-y-4"
        >
          <h3 className="text-base font-bold text-ink-soft">
            Envoyer un message de demande
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-soft block">
                Votre nom complet *
              </label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Ex: Amadou Diop"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-muted-foreground/45"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-soft block">
                Votre numéro de téléphone (Mobile Money) *
              </label>
              <input
                type="text"
                name="telephone"
                required
                value={formData.telephone}
                onChange={handleInputChange}
                placeholder="Ex: +242 06 600 00 00"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-muted-foreground/45"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-soft block">
                Votre message ou question (optionnel)
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Décrivez votre besoin de transfert..."
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-muted-foreground/45"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/5 p-3 text-xs text-destructive border border-destructive/10">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Veuillez renseigner les champs obligatoires (*).</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 rounded-xl bg-success/5 p-3 text-xs text-success border border-success/10">
                <span>Message préparé ! Redirection vers WhatsApp...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 rounded-xl gold-gradient py-3.5 text-center text-sm font-semibold text-ink shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{status === "sending" ? "Connexion..." : "Envoyer la demande sur WhatsApp"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
