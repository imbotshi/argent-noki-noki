import TransferSimulator from "@/components/transfer-simulator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Simulateur de Transfert",
  description: "Calculez les frais et le montant exact reçu pour vos transferts d'argent entre le Congo et l'Afrique de l'Ouest (Sénégal, Côte d'Ivoire, Burkina Faso, Mali, Niger).",
  alternates: {
    canonical: "https://argent-noki.com/simulateur",
  },
}

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Simulateur de Transfert
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Choisissez votre corridor, entrez le montant à recevoir et obtenez instantanément le détail complet de votre transfert.
        </p>
      </div>
      
      <div className="flex justify-center items-center">
        <TransferSimulator />
      </div>
    </div>
  )
}
