"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  ChevronDown, ChevronUp, MessageCircle, AlertCircle,
  Building2, Smartphone, ArrowRight, ArrowLeftRight,
  Percent, Calculator, Network
} from "lucide-react"
import { Flag, FlagCode } from "@/components/flag"
import {
  simulerTransfert,
  formatMontant,
  MONTANT_MINIMUM,
  genererMessageWhatsApp,
  WHATSAPP_NUMBER,
  PAYS,
  PaysCode,
  DESTINATIONS_DEPUIS_CG,
  tauxCommissionLabel,
  hasCorridor,
  congoEstEmetteur,
} from "@/lib/calculator"

// ─── Motion variants ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

// ─── CountryPill (côté fixe) ─────────────────────────────────────────────────
function CountryPill({
  code,
  glass,
  highlight,
}: {
  code: PaysCode
  glass: boolean
  highlight?: boolean
}) {
  const pays = PAYS[code]
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2.5 min-w-[100px] border transition-all ${
        highlight
          ? glass ? "border-gold/50 bg-gold/15" : "border-gold/40 bg-gold/8"
          : glass ? "border-white/15 bg-white/10" : "border-border bg-secondary/60"
      }`}
    >
      <Flag code={pays.drapeau as FlagCode} size={28} />
      <span className={`text-xs font-bold mt-0.5 text-center leading-tight ${glass ? "text-white" : "text-ink-soft"}`}>
        {pays.nomCourt.split("-")[0]}
      </span>
      <span className={`text-[10px] font-semibold ${glass ? "text-gold" : "text-gold-dark"}`}>
        {pays.devise}
      </span>
    </div>
  )
}

// ─── CountryDropdown (côté sélectionnable) ──────────────────────────────────
function CountryDropdown({
  selected,
  options,
  onChange,
  glass,
}: {
  selected: PaysCode
  options: PaysCode[]
  onChange: (code: PaysCode) => void
  glass: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pays = PAYS[selected]

  // Fermer en cliquant hors du dropdown
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2.5 min-w-[100px] border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          glass
            ? "border-white/25 bg-white/12 hover:bg-white/18"
            : "border-gold/30 bg-gold/5 hover:bg-gold/10"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Flag code={pays.drapeau as FlagCode} size={26} />
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""} ${glass ? "text-gold" : "text-gold-dark"}`} />
        </div>
        <span className={`text-xs font-bold text-center leading-tight ${glass ? "text-white" : "text-ink-soft"}`}>
          {pays.nomCourt.length > 12 ? pays.nomCourt.split(" ")[0] : pays.nomCourt}
        </span>
        <span className={`text-[10px] font-semibold ${glass ? "text-gold" : "text-gold-dark"}`}>
          {pays.devise}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={`absolute top-full mt-2 left-0 z-50 min-w-[160px] rounded-2xl border shadow-xl overflow-hidden ${
              glass
                ? "border-white/20 bg-black/70 backdrop-blur-xl"
                : "border-border bg-white shadow-lg"
            }`}
          >
            {options.map((code) => {
              const p = PAYS[code]
              const isSelected = code === selected
              return (
                <button
                  key={code}
                  onClick={() => { onChange(code); setOpen(false) }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? glass ? "bg-gold/20 text-gold" : "bg-gold/10 text-gold-dark"
                      : glass ? "text-white hover:bg-white/10" : "text-ink hover:bg-muted/40"
                  }`}
                >
                  <Flag code={p.drapeau as FlagCode} size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.nom}</p>
                    <p className={`text-[10px] ${glass ? "text-white/50" : "text-muted-foreground"}`}>{p.devise}</p>
                  </div>
                  {isSelected && (
                    <span className={`text-xs font-bold ${glass ? "text-gold" : "text-gold-dark"}`}>✓</span>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Simulateur principal ────────────────────────────────────────────────────
export default function TransferSimulator({ glass = false }: { glass?: boolean }) {
  const [fromCode, setFromCode] = useState<PaysCode>("CG")
  const [toCode,   setToCode]   = useState<PaysCode>("SN")
  const [montant,  setMontant]  = useState<string>("10 000")
  const [showDetails, setShowDetails] = useState(false)
  const [spinning, setSpinning] = useState(false)

  const cgEnvoie  = congoEstEmetteur(fromCode)
  const emetteur  = PAYS[fromCode]
  const recepteur = PAYS[toCode]
  const corridor  = hasCorridor(fromCode, toCode)

  const parsedMontant = parseInt(montant.replace(/\s/g, "").replace(/\./g, ""), 10) || 0
  const isTooLow = parsedMontant > 0 && parsedMontant < MONTANT_MINIMUM
  const isValid  = parsedMontant >= MONTANT_MINIMUM

  const result  = simulerTransfert(parsedMontant, fromCode, toCode)
  const waLink  = `https://wa.me/${WHATSAPP_NUMBER}?text=${genererMessageWhatsApp(result)}`
  const commissionBadge = tauxCommissionLabel(fromCode, parsedMontant)

  // Options de destination selon qui envoie
  const destinationOptions: PaysCode[] = cgEnvoie
    ? DESTINATIONS_DEPUIS_CG
    : ["CG"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    if (!raw) { setMontant(""); return }
    setMontant(formatMontant(parseInt(raw, 10)))
  }

  const handleSwap = () => {
    setSpinning(true)
    setTimeout(() => {
      const newFrom = toCode
      const newTo   = fromCode
      setFromCode(newFrom)
      setToCode(newTo)
      setShowDetails(false)
      setSpinning(false)
    }, 220)
  }

  const handleDestinationChange = (code: PaysCode) => {
    setToCode(code)
    setShowDetails(false)
  }

  // ── Styles adaptatifs ────────────────────────────────────────────────────
  const labelBase = glass
    ? "text-sm font-semibold text-white/80 block"
    : "text-sm font-semibold text-ink-soft block"

  const mutedText = glass ? "text-xs text-white/55" : "text-xs text-muted-foreground"

  const inputCls = [
    "w-full rounded-2xl border px-4 py-4 text-lg font-bold outline-none transition pr-16",
    glass
      ? "border-white/25 bg-black/30 text-white placeholder:text-white/40 focus:border-gold focus:bg-black/40"
      : "border-border bg-background text-ink placeholder:text-muted-foreground/40 focus:border-gold focus:ring-2 focus:ring-gold/20",
    isTooLow ? "border-red-400 focus:border-red-400" : "",
  ].join(" ")

  return (
    <div className={`w-full max-w-lg space-y-5 ${
      glass
        ? "rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 md:p-8 shadow-2xl"
        : "rounded-3xl border border-border bg-white p-6 md:p-8 card-shadow-lg"
    }`}>

      {/* ── Country Selector ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <span className={labelBase}>Itinéraire du transfert</span>

        <div className="flex items-center gap-2">
          {/* Côté émetteur */}
          {cgEnvoie ? (
            <CountryPill code={fromCode} glass={glass} highlight />
          ) : (
            <CountryDropdown
              selected={fromCode}
              options={DESTINATIONS_DEPUIS_CG}
              onChange={(code) => { setFromCode(code); setShowDetails(false) }}
              glass={glass}
            />
          )}

          {/* Flèche animée */}
          <div className="flex flex-1 items-center justify-center gap-1">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className={`h-px flex-1 ${glass ? "bg-white/20" : "bg-border"}`}
            />
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className={`text-base ${glass ? "text-gold" : "text-gold-dark"}`}
            >
              →
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className={`h-px flex-1 ${glass ? "bg-white/20" : "bg-border"}`}
            />
          </div>

          {/* Côté récepteur */}
          {cgEnvoie ? (
            <CountryDropdown
              selected={toCode}
              options={DESTINATIONS_DEPUIS_CG}
              onChange={handleDestinationChange}
              glass={glass}
            />
          ) : (
            <CountryPill code={toCode} glass={glass} />
          )}

          {/* Bouton inverser */}
          <motion.button
            onClick={handleSwap}
            animate={{ rotate: spinning ? 180 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            title="Inverser la direction"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              glass
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-border bg-secondary text-ink hover:bg-secondary/80"
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Badges : commission + corridor si applicable */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={fromCode + toCode + commissionBadge}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                glass
                  ? "border border-gold/30 bg-gold/15 text-gold"
                  : "border border-gold/25 bg-gold/8 text-gold-dark"
              }`}
            >
              <span>Commission Noki-Noki :</span>
              <span>{commissionBadge}</span>
            </motion.div>
          </AnimatePresence>

          {corridor && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                glass
                  ? "border border-white/20 bg-white/10 text-white/70"
                  : "border border-border bg-muted/60 text-muted-foreground"
              }`}
            >
              <Network className="h-3 w-3" />
              <span>+1,5 % frais réseau</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Input montant ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className={labelBase}>
          Combien votre proche doit-il recevoir ?
        </label>
        <div className="relative">
          <input
            type="text"
            value={montant}
            onChange={handleChange}
            placeholder="Ex : 10 000"
            inputMode="numeric"
            className={inputCls}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gold">
            {result.deviseRecepteur}
          </span>
        </div>
        <p className={mutedText}>
          Minimum : {formatMontant(MONTANT_MINIMUM)} {result.deviseRecepteur} •{" "}
          {emetteur.nom} → {recepteur.nom}
        </p>
      </div>

      {/* ── Erreur ────────────────────────────────────────────────────────── */}
      {isTooLow && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Le montant minimum est de {formatMontant(MONTANT_MINIMUM)} {result.deviseRecepteur}.</span>
        </div>
      )}

      {/* ── Résultats ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isValid && (
          <motion.div
            key={parsedMontant + fromCode + toCode}
            variants={stagger}
            initial="initial"
            animate="animate"
            exit="initial"
            className="space-y-3"
          >
            {/* Montant reçu */}
            <motion.div
              variants={fadeUp}
              className={`rounded-2xl border p-4 text-center ${
                glass ? "border-gold/30 bg-gold/10" : "border-gold/20 bg-gold/5"
              }`}
            >
              <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${glass ? "text-white/70" : "text-muted-foreground"}`}>
                Votre proche reçoit au {recepteur.nom}
              </p>
              <p className="text-3xl font-extrabold tracking-tight text-green-400">
                {formatMontant(result.montantRecu)}{" "}
                <span className="text-lg">{result.deviseRecepteur}</span>
              </p>
            </motion.div>

            {/* ── Mode Congo → Destination : Cash + Mobile Money ──────────── */}
            {cgEnvoie && (
              <>
                {/* Cash bureau */}
                <motion.div
                  variants={fadeUp}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    glass ? "border-white/15 bg-white/8" : "border-border bg-background"
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${glass ? "bg-white/15" : "bg-secondary"}`}>
                    <Building2 className={`h-5 w-5 ${glass ? "text-gold" : "text-gold-dark"}`} />
                  </span>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                      Dépôt en cash dans nos bureaux
                    </p>
                    <p className={`mt-0.5 text-xl font-extrabold ${glass ? "text-white" : "text-ink"}`}>
                      {formatMontant(result.totalCash)}{" "}
                      <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>
                        {result.deviseEmetteur}
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Mobile Money */}
                <motion.div
                  variants={fadeUp}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    glass ? "border-gold/25 bg-gold/8" : "border-gold/20 bg-gold/5"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20">
                    <Smartphone className="h-5 w-5 text-gold" />
                  </span>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                      Envoi par Mobile Money
                    </p>
                    <p className={`mt-0.5 text-xl font-extrabold ${glass ? "text-gold" : "text-gold-dark"}`}>
                      {formatMontant(result.totalMobileMoney)}{" "}
                      <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>
                        {result.deviseEmetteur}
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Accordéon détail */}
                <motion.div
                  variants={fadeUp}
                  className={`overflow-hidden rounded-2xl border ${glass ? "border-white/15" : "border-border"}`}
                >
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-xs font-semibold transition-colors ${
                      glass
                        ? "text-white/60 hover:bg-white/5 hover:text-white"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-ink"
                    }`}
                  >
                    <span>Détail du calcul</span>
                    {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`overflow-hidden border-t ${glass ? "border-white/10 bg-black/20" : "border-border bg-muted/20"}`}
                      >
                        <div className={`space-y-2.5 p-4 text-xs ${glass ? "text-white/70" : "text-muted-foreground"}`}>
                          <div className="flex justify-between">
                            <span>Montant reçu ({recepteur.nom})</span>
                            <span className={`font-bold ${glass ? "text-white" : "text-ink"}`}>
                              {formatMontant(result.montantRecu)} {result.deviseRecepteur}
                            </span>
                          </div>

                          {/* Frais de corridor (uniquement pour l'Afrique de l'Ouest) */}
                          {corridor && (
                            <>
                              <div className="flex justify-between">
                                <span>Frais réseau corridor (1,5 %)</span>
                                <span className="font-semibold text-amber-500">
                                  +{formatMontant(result.fraisCorridor)} {result.deviseEmetteur}
                                </span>
                              </div>
                              <div className={`flex justify-between border-t pt-2 ${glass ? "border-white/10" : "border-border"}`}>
                                <span>Base ajustée</span>
                                <span className={`font-bold ${glass ? "text-white" : "text-ink"}`}>
                                  {formatMontant(result.baseCorridor)} {result.deviseEmetteur}
                                </span>
                              </div>
                            </>
                          )}

                          <div className="flex justify-between">
                            <span>Commission Noki-Noki ({commissionBadge})</span>
                            <span className="font-semibold text-gold">
                              +{formatMontant(result.commission)} {result.deviseEmetteur}
                            </span>
                          </div>
                          <div className={`flex justify-between border-t pt-2 font-bold ${glass ? "border-white/10 text-white" : "border-border text-ink"}`}>
                            <span>Total cash (bureau)</span>
                            <span>{formatMontant(result.totalCash)} {result.deviseEmetteur}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frais Mobile Money ({parsedMontant >= 150_000 ? "2,5" : "3,5"} %)</span>
                            <span className="font-semibold text-gold">
                              +{formatMontant(result.fraisMobileMoney)} {result.deviseEmetteur}
                            </span>
                          </div>
                          <div className={`flex justify-between border-t pt-2 font-bold ${glass ? "border-white/10 text-gold" : "border-border text-gold-dark"}`}>
                            <span>Total Mobile Money (arrondi ×5)</span>
                            <span>{formatMontant(result.totalMobileMoney)} {result.deviseEmetteur}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            )}

            {/* ── Mode Pays → Congo : Commission + Total simplifié ─────────── */}
            {!cgEnvoie && (
              <>
                <motion.div
                  variants={fadeUp}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    glass ? "border-white/15 bg-white/8" : "border-border bg-background"
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${glass ? "bg-white/15" : "bg-secondary"}`}>
                    <Percent className={`h-5 w-5 ${glass ? "text-gold" : "text-gold-dark"}`} />
                  </span>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                      Commission Noki-Noki (4,0 %)
                    </p>
                    <p className={`mt-0.5 text-xl font-extrabold ${glass ? "text-white" : "text-ink"}`}>
                      {formatMontant(result.commission)}{" "}
                      <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>
                        {result.deviseEmetteur}
                      </span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    glass ? "border-gold/25 bg-gold/8" : "border-gold/20 bg-gold/5"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20">
                    <Calculator className="h-5 w-5 text-gold" />
                  </span>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                      Total à envoyer (montant + commission)
                    </p>
                    <p className={`mt-0.5 text-xl font-extrabold ${glass ? "text-gold" : "text-gold-dark"}`}>
                      {formatMontant(result.totalCash)}{" "}
                      <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>
                        {result.deviseEmetteur}
                      </span>
                    </p>
                  </div>
                </motion.div>
              </>
            )}

            {/* CTA WhatsApp */}
            <motion.a
              variants={fadeUp}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.99]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="h-5 w-5 fill-white" />
              <span>Initier le transfert sur WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <motion.p
              variants={fadeUp}
              className={`text-center text-[11px] leading-relaxed ${glass ? "text-white/40" : "text-muted-foreground/60"}`}
            >
              Taux garanti. Commission {commissionBadge}{corridor ? " + 1,5 % frais réseau" : ""}. En cliquant, vous serez mis en relation avec un agent Noki-Noki via WhatsApp.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
