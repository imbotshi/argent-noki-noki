import { simulerTransfert, formatMontant, PAYS, Direction, paysEmetteur, paysRecepteur, tauxLabel } from "@/lib/calculator"

const PALIERS = [10_000, 50_000, 100_000, 200_000, 500_000]

function TableSection({ direction }: { direction: Direction }) {
  const em = paysEmetteur(direction)
  const re = paysRecepteur(direction)
  return (
    <div>
      {/* Header section */}
      <div className="flex items-center gap-3 px-5 py-3 bg-ink-soft text-white rounded-t-[20px]">
        <span className="text-lg">{em.drapeau}</span>
        <span className="text-sm font-bold">{em.nom}</span>
        <span className="text-white/50 text-sm">→</span>
        <span className="text-lg">{re.drapeau}</span>
        <span className="text-sm font-bold">{re.nom}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/20 px-3 py-0.5 text-xs font-bold text-gold">
          Commission {tauxLabel(direction)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-5 py-3 font-medium">Proche reçoit ({re.ville})</th>
              <th className="px-5 py-3 font-medium">Commission</th>
              <th className="px-5 py-3 font-medium text-ink font-semibold">💵 Cash (bureau)</th>
              <th className="px-5 py-3 font-medium text-gold-dark font-semibold">📱 Mobile Money</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PALIERS.map((montant) => {
              const r = simulerTransfert(montant, direction)
              return (
                <tr key={montant} className="font-medium hover:bg-muted/10 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 font-bold text-success text-base">
                    {formatMontant(r.montantRecu)} {r.deviseRecepteur}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                    {formatMontant(r.commission)} {r.deviseEmetteur}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-ink font-semibold">
                    {formatMontant(r.totalCash)} {r.deviseEmetteur}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-gold-dark font-bold">
                    {formatMontant(r.totalMobileMoney)} {r.deviseEmetteur}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PricingTable() {
  return (
    <div className="w-full space-y-6">
      <div className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
        <TableSection direction="CG_SN" />
        <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
          Frais Mobile Money = 3,5 % du total cash, arrondi au multiple de 5 supérieur.
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
        <TableSection direction="SN_CG" />
        <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
          Frais Mobile Money = 3,5 % du total cash, arrondi au multiple de 5 supérieur.
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Taux de commission garantis et fixes. Frais Mobile Money = 3,5 % du total cash, arrondi au multiple de 5 supérieur.
      </p>
    </div>
  )
}
