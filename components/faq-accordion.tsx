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
    a: "C'est simple : utilisez notre simulateur pour calculer les montants exacts de votre transfert. Une fois la simulation validée, cliquez sur « Initier le transfert sur WhatsApp ». Vous serez mis en relation directe avec un agent Noki-Noki pour finaliser la transaction de manière sécurisée.",
  },
  {
    q: "Combien de temps prend un transfert ?",
    a: "Dès que les fonds sont reçus et validés par notre agent, votre proche dans le pays de destination est crédité en moins d'1 minute.",
  },
  {
    q: "Quels sont les frais de transfert applicables ?",
    a: "Selon le corridor, notre commission varie de 4 % (Afrique de l'Ouest → Congo) à 11,5 % (Congo → Afrique de l'Ouest). Pour les transferts vers le Burkina Faso, la Côte d'Ivoire, le Mali et le Niger, des frais réseau de 1,5 % s'ajoutent. Tout est calculé et affiché dans le simulateur avant toute transaction.",
  },
  {
    q: "Y aura-t-il des frais cachés ou de mauvaise surprise à la réception ?",
    a: "Non. Ce que vous voyez dans le simulateur est le montant exact que recevra votre proche dans le pays de destination. La transparence est notre promesse fondamentale.",
  },
  {
    q: "Comment mon proche reçoit-il l'argent ?",
    a: "Votre proche recevra les fonds directement sur son compte Mobile Money selon les opérateurs disponibles dans son pays (Wave, Orange Money, MTN Money, Airtel Money, etc.), selon les modalités convenues avec notre agent sur WhatsApp.",
  },
  {
    q: "Pourquoi y a-t-il des frais réseau supplémentaires vers le Burkina Faso, la Côte d'Ivoire, le Mali et le Niger ?",
    a: "Ces pays utilisent un réseau Mobile Money distinct du corridor Congo–Sénégal. Des frais de transit inter-réseau de 1,5 % sont appliqués par les opérateurs. Ils sont toujours affichés clairement dans le simulateur avant tout engagement de votre part.",
  },
  {
    q: "Y a-t-il un montant minimum ou maximum ?",
    a: "Le montant minimum est de 5 000 XOF (ou équivalent selon la devise). Il n'y a aucun montant maximum plafonné — vous pouvez transférer la somme de votre choix dans le respect des limites des opérateurs Mobile Money locaux.",
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
