import {
  simulerTransfert,
  formatMontant,
  PaysCode,
  PAYS,
  DESTINATIONS_DEPUIS_CG,
  PAYS_AFRIQUE_OUEST,
  tauxCommissionLabel,
} from "@/lib/calculator"
import { Flag, FlagCode } from "@/components/flag"

// ─── Paliers par corridor ────────────────────────────────────────────────────
const PALIERS_CG_UEMOA  = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000]
const PALIERS_VERS_CG   = [10_000, 50_000, 100_000, 200_000, 500_000, 5_000_000]

// ─── Tableau Congo → Destination ─────────────────────────────────────────────
function TableCGSend({ to, paliers }: { to: PaysCode; paliers: number[] }) {
  const re       = PAYS[to]
  const em       = PAYS["CG"]
  const corridor = PAYS_AFRIQUE_OUEST.includes(to)

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center gap-2 px-5 py-3 bg-ink-soft text-white rounded-t-[20px]">
        <Flag code={em.drapeau as FlagCode} size={18} />
        <span className="text-sm font-bold">{em.nom}</span>
        <span className="text-white/50 text-sm">→</span>
        <Flag code={re.drapeau as FlagCode} size={18} />
        <span className="text-sm font-bold">{re.nom}</span>
        {corridor && (
          <span className="ml-auto text-[10px] font-bold rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-amber-300">
            +1,5 % corridor
          </span>
        )}
        {!corridor && (
          <span className="ml-auto text-[10px] font-bold rounded-full border border-gold/40 bg-gold/20 px-2 py-0.5 text-gold">
            Sans frais réseau
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-4 py-3 font-medium">Reçoit ({re.nom})</th>
              <th className="px-4 py-3 font-medium">Commission</th>
              {corridor && <th className="px-4 py-3 font-medium text-amber-600">Corridor</th>}
              <th className="px-4 py-3 font-medium text-ink font-semibold">💵 Cash</th>
              <th className="px-4 py-3 font-medium text-gold-dark font-semibold">📱 Mobile Money</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paliers.map((montant) => {
              const r            = simulerTransfert(montant, "CG", to)
              const taux         = tauxCommissionLabel("CG", montant)
              const isReduced    = montant >= 1_500_000

              return (
                <tr key={montant} className="font-medium hover:bg-muted/10 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-success text-base">
                    {formatMontant(r.montantRecu)} {r.deviseRecepteur}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-muted-foreground">{formatMontant(r.commission)} {r.deviseEmetteur}</span>{" "}
                    <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                      isReduced ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {taux}
                    </span>
                  </td>
                  {corridor && (
                    <td className="whitespace-nowrap px-4 py-3.5 text-amber-600 font-medium text-sm">
                      +{formatMontant(r.fraisCorridor)} {r.deviseEmetteur}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink font-semibold">
                    {formatMontant(r.totalCash)} {r.deviseEmetteur}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-gold-dark font-bold">
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

// ─── Tableau Pays → Congo ─────────────────────────────────────────────────────
function TablePaysCG({ from, paliers }: { from: PaysCode; paliers: number[] }) {
  const em = PAYS[from]
  const re = PAYS["CG"]

  return (
    <div>
      <div className="flex items-center gap-2 px-5 py-3 bg-ink-soft text-white rounded-t-[20px]">
        <Flag code={em.drapeau as FlagCode} size={18} />
        <span className="text-sm font-bold">{em.nom}</span>
        <span className="text-white/50 text-sm">→</span>
        <Flag code={re.drapeau as FlagCode} size={18} />
        <span className="text-sm font-bold">{re.nom}</span>
        <span className="ml-auto text-[10px] font-bold rounded-full border border-gold/40 bg-gold/20 px-2 py-0.5 text-gold">
          4,0 %
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-4 py-3 font-medium">Reçoit (Congo)</th>
              <th className="px-4 py-3 font-medium">Commission</th>
              <th className="px-4 py-3 font-medium text-ink font-semibold">Total à envoyer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paliers.map((montant) => {
              const r = simulerTransfert(montant, from, "CG")
              return (
                <tr key={montant} className="font-medium hover:bg-muted/10 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-success text-base">
                    {formatMontant(r.montantRecu)} {r.deviseRecepteur}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                    {formatMontant(r.commission)} {r.deviseEmetteur}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink font-semibold">
                    {formatMontant(r.totalCash)} {r.deviseEmetteur}
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

// ─── Composant principal ──────────────────────────────────────────────────────
export default function PricingTable() {
  return (
    <div className="w-full space-y-8">

      {/* ── Congo → Sénégal ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-ink-soft uppercase tracking-wider px-1">
          Congo → Sénégal
        </h3>
        <div className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
          <TableCGSend to="SN" paliers={PALIERS_CG_UEMOA} />
          <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
            Commission 11,5 % (10 % dès 1 500 000 XAF). Mobile Money 3,5 % (2,5 % dès 150 000). Arrondi au multiple de 5 ↑.
          </div>
        </div>
      </section>

      {/* ── Congo → Afrique de l'Ouest ────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-ink-soft uppercase tracking-wider px-1">
          Congo → Afrique de l'Ouest
          <span className="ml-2 normal-case font-normal text-muted-foreground">(+1,5 % frais corridor réseau)</span>
        </h3>
        <div className="space-y-4">
          {PAYS_AFRIQUE_OUEST.map((pays) => (
            <div key={pays} className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
              <TableCGSend to={pays} paliers={PALIERS_CG_UEMOA} />
              <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
                Frais réseau 1,5 % appliqués sur le montant reçu. Commission 11,5 % (10 % dès 1 500 000). Mobile Money 3,5 % (2,5 % dès 150 000). Arrondi ×5 ↑.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pays UEMOA → Congo ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-ink-soft uppercase tracking-wider px-1">
          Afrique de l'Ouest → Congo
        </h3>
        <div className="space-y-4">
          {DESTINATIONS_DEPUIS_CG.map((pays) => (
            <div key={pays} className="overflow-hidden rounded-[20px] border border-border bg-white card-shadow">
              <TablePaysCG from={pays} paliers={PALIERS_VERS_CG} />
              <div className="border-t border-border bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
                Commission fixe 4,0 %. Le total indiqué est le montant à envoyer (montant reçu + commission).
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground pb-2">
        Taux garantis et fixes. Les frais affichés sont les seuls que vous payez — aucune surprise à la réception.
      </p>
    </div>
  )
}
