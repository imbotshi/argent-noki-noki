import TransferSimulator from "@/components/transfer-simulator"

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
