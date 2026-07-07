import { simulerTransfert, formatMontant } from "@/lib/calculator"

const PALIERS = [10000, 50000, 100000, 200000, 500000]

export default function PricingTable() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4 font-medium">Proche reçoit (Dakar)</th>
              <th className="px-5 py-4 font-medium">Commission (11,5%)</th>
              <th className="px-5 py-4 font-medium text-ink font-semibold">
                💵 Vous payez (cash bureau)
              </th>
              <th className="px-5 py-4 font-medium text-gold-dark font-semibold">
                📱 Vous payez (Mobile Money)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PALIERS.map((montant) => {
              const r = simulerTransfert(montant, "XAF")
              return (
                <tr key={montant} className="hover:bg-muted/10 transition-colors font-medium">
                  <td className="whitespace-nowrap px-5 py-4 text-success font-bold text-base">
                    {formatMontant(r.montantRecu)} XOF
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {formatMontant(r.commission)} XAF
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink font-semibold">
                    {formatMontant(r.totalCash)} XAF
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gold-dark font-bold">
                    {formatMontant(r.totalMobileMoney)} XAF
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
        * Frais Mobile Money = 3,5% du total cash, arrondi au multiple de 5 supérieur. Parité XAF/XOF : 1:1 (Franc CFA).
      </div>
    </div>
  )
}
