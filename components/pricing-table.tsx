import {
  simulerTransfert,
  formatMontant,
  Direction,
  paysEmetteur,
  paysRecepteur,
  tauxCommissionCGLabel,
} from "@/lib/calculator"

// CG→SN : montants illustratifs couvrant les deux paliers de commission (11,5% et 10%)
const PALIERS_CG_SN = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000]

// SN→CG : montants illustratifs, 4% fixe
const PALIERS_SN_CG = [10_000, 50_000, 100_000, 200_000, 500_000, 5_000_000]

function TableSection({
  direction,
  paliers,
}: {
  direction: Direction
  paliers: number[]
}) {
  const em = paysEmetteur(direction)
  const re = paysRecepteur(direction)

  return (
    <div>
      {/* Header section */}
      <div className="flex items-center gap-3 px-5 py-3 bg-ink-soft text-white rounded-t-[20px]">
        <span className="text-sm font-bold">{em.nom}</span>
        <span className="text-white/50 text-sm">→</span>
        <span className="text-sm font-bold">{re.nom}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-5 py-3 font-medium">Proche reçoit ({re.nom})</th>
              <th className="px-5 py-3 font-medium">Commission</th>
              {direction === "CG_SN" && (
                <>
                  <th className="px-5 py-3 font-medium text-ink font-semibold">💵 Cash (bureau)</th>
                  <th className="px-5 py-3 font-medium text-gold-dark font-semibold">📱 Mobile Money</th>
                </>
              )}
              {direction === "SN_CG" && (
                <th className="px-5 py-3 font-medium text-ink font-semibold">Total à envoyer</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paliers.map((montant) => {
              const r = simulerTransfert(montant, direction)
              const commissionLabel = direction === "CG_SN"
                ? tauxCommissionCGLabel(montant)
                : "4,0 %"
              const isReducedRate = direction === "CG_SN" && montant >= 1_500_000

              return (
                <tr key={montant} className="font-medium hover:bg-muted/10 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3.5 font-bold text-success text-base">
                    {formatMontant(r.montantRecu)} {r.deviseRecepteur}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className="text-muted-foreground">
                      {formatMontant(r.commission)} {r.deviseEmetteur}
                    </span>
                    {" "}
                    <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                      isReducedRate
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {commissionLabel}
                    </span>
                  </td>
                  {direction === "CG_SN" && (
                    <>
                      <td className="whitespace-nowrap px-5 py-3.5 text-ink font-semibold">
                        {formatMontant(r.totalCash)} {r.deviseEmetteur}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-gold-dark font-bold">
                        {formatMontant(r.totalMobileMoney)} {r.deviseEmetteur}
                      </td>
                    </>
                  )}
                  {direction === "SN_CG" && (
                    <td className="whitespace-nowrap px-5 py-3.5 text-ink font-semibold">
                      {formatMontant(r.totalCash)} {r.deviseEmetteur}
                    </td>
                  )}
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
      {/* Congo → Sénégal */}
      <div className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
        <TableSection direction="CG_SN" paliers={PALIERS_CG_SN} />
        <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
          Commission 11,5 % (10 % dès 1 500 000 XAF) • Frais Mobile Money 3,5 % (2,5 % dès 150 000), arrondi au multiple de 5 supérieur.
        </div>
      </div>

      {/* Sénégal → Congo */}
      <div className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
        <TableSection direction="SN_CG" paliers={PALIERS_SN_CG} />
        <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
          Commission fixe 4,0 %. Le total indiqué est le montant total à envoyer (montant reçu + commission).
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Taux de commission garantis et fixes. Arrondi au multiple de 5 supérieur pour Mobile Money.
      </p>
    </div>
  )
}
