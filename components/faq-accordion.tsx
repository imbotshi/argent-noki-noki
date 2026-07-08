"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface FAQItem {
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    q: "Comment fonctionne le transfert d'argent avec Argent Noki-Noki ?",
    a: "C'est très simple : utilisez notre simulateur pour calculer les montants exacts de votre transfert. Une fois la simulation validée, cliquez sur 'Envoyez via WhatsApp'. Vous serez mis en relation directe avec l'un de nos agents Noki-Noki pour finaliser de manière sécurisée la transaction par Mobile Money.",
  },
  {
    q: "Combien de temps prend un transfert ?",
    a: "Dès que les Mobile Money sont reçus et validés par notre agent au Congo, les fonds au Sénégal sont mis à disposition en moins d'1 minute.",
  },
  {
    q: "Quels sont les frais de transfert applicables ?",
    a: "Nous appliquons un taux de commission fixe et unique de 11,5% calculé sur le montant envoyé. À cela s'ajoutent les frais de traitement Mobile Money locaux selon les grilles d'opérateurs habituels. Tout est détaillé dans le simulateur en toute transparence.",
  },
  {
    q: "Y aura-t-il des frais cachés ou de mauvaise surprise à la réception ?",
    a: "Non. Ce que vous voyez sur le simulateur est le montant exact qui sera perçu par votre proche au Sénégal. La transparence est notre promesse fondamentale.",
  },
  {
    q: "Comment mon proche reçoit-il l'argent au Sénégal ?",
    a: "Votre proche recevra les fonds directement sur son compte Mobile Money (Wave, Orange Money, etc.) ou par retrait dans un point partenaire selon les modalités convenues lors de l'échange WhatsApp avec notre agent.",
  },
  {
    q: "Y a-t-il une limite ou un montant maximum pour les transferts ?",
    a: "Non, pour notre MVP, il n'y a aucun montant maximum plafonné. Vous pouvez transférer la somme désirée dans le respect des limites des opérateurs de Mobile Money.",
  },
]

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i)
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {FAQS.map((faq, i) => {
        const isOpen = activeIndex === i
        return (
          <div
            key={i}
            className="border border-border rounded-[16px] bg-white card-shadow overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-ink-soft hover:text-gold transition-colors"
            >
              <span className="pr-4">{faq.q}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-ink">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
