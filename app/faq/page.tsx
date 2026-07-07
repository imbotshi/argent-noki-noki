import FAQAccordion from "@/components/faq-accordion"
import Link from "next/link"
import { HelpCircle, ArrowRight } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-dark mx-auto">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Foire Aux Questions
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Trouvez des réponses claires sur le fonctionnement de nos transferts d'argent, nos frais et nos délais.
        </p>
      </div>

      <FAQAccordion />

      {/* Rassurer encore */}
      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center max-w-xl mx-auto space-y-4">
        <h3 className="text-base font-bold text-ink-soft">
          Une autre question ?
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Nos conseillers sont disponibles sur WhatsApp pour vous accompagner étape par étape ou répondre à vos demandes spécifiques.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-dark transition-colors"
        >
          Contacter notre équipe <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
