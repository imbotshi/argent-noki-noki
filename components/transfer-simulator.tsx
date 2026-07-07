"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, MessageCircle, AlertCircle, Building2, Smartphone, ArrowRight } from "lucide-react"
import {
  simulerTransfert,
  formatMontant,
  MONTANT_MINIMUM,
  genererMessageWhatsApp,
  WHATSAPP_NUMBER,
  Devise,
} from "@/lib/calculator"

const stagger = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function TransferSimulator({ glass = false }: { glass?: boolean }) {
  const [montant, setMontant] = useState<string>("10 000")
  const [devise, setDevise] = useState<Devise>("XAF")
  const [showDetails, setShowDetails] = useState(false)

  const parsedMontant = parseFloat(montant.replace(/\s/g, "").replace(/\./g, "")) || 0
  const isTooLow = parsedMontant > 0 && parsedMontant < MONTANT_MINIMUM
  const isValid = parsedMontant >= MONTANT_MINIMUM

  const result = simulerTransfert(parsedMontant, devise)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${genererMessageWhatsApp(result)}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    if (!raw) { setMontant(""); return }
    setMontant(formatMontant(parseInt(raw, 10)))
  }

  // Styles adaptatifs : glass (sur hero sombre) vs solid (page blanche)
  const cardBase = glass
    ? "rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 md:p-8 shadow-2xl"
    : "rounded-3xl border border-border bg-white p-6 md:p-8 card-shadow-lg"

  const inputBase = glass
    ? "w-full rounded-2xl border border-white/25 bg-black/30 px-4 py-4 text-lg font-bold text-white placeholder:text-white/40 outline-none transition focus:border-gold focus:bg-black/40"
    : "w-full rounded-2xl border border-border bg-background px-4 py-4 text-lg font-bold text-ink placeholder:text-muted-foreground/40 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"

  const labelBase = glass ? "text-sm font-semibold text-white/80 block" : "text-sm font-semibold text-ink-soft block"
  const mutedText = glass ? "text-xs text-white/55" : "text-xs text-muted-foreground"

  return (
    <div className={`w-full max-w-lg ${cardBase}`}>
      <div className="space-y-5">

        {/* Toggle Devise */}
        <div className="flex items-center justify-between">
          <span className={labelBase}>Devise d'envoi</span>
          <div className={`inline-flex rounded-xl p-1 ${glass ? "bg-white/10" : "bg-secondary"}`}>
            {(["XAF", "XOF"] as Devise[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevise(d)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  devise === d
                    ? glass
                      ? "bg-white/20 text-white shadow-sm"
                      : "bg-white text-ink shadow-sm"
                    : glass
                    ? "text-white/55 hover:text-white"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                {d === "XAF" ? "Congo (XAF)" : "Sénégal (XOF)"}
              </button>
            ))}
          </div>
        </div>

        {/* Input montant */}
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
              className={`${inputBase} ${isTooLow ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""} pr-16`}
              inputMode="numeric"
            />
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${glass ? "text-gold" : "text-gold"}`}>
              {devise}
            </span>
          </div>
          <p className={mutedText}>Minimum : {formatMontant(MONTANT_MINIMUM)} {devise}</p>
        </div>

        {/* Erreur */}
        {isTooLow && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-400/20 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Le montant minimum est de {formatMontant(MONTANT_MINIMUM)} {devise}.</span>
          </div>
        )}

        {/* Résultats */}
        <AnimatePresence mode="wait">
          {isValid && (
            <motion.div
              key={parsedMontant + devise}
              variants={stagger}
              initial="initial"
              animate="animate"
              exit="initial"
              className="space-y-3"
            >
              {/* Montant reçu */}
              <motion.div
                variants={fadeUp}
                className={`rounded-2xl p-4 text-center border ${
                  glass
                    ? "border-gold/30 bg-gold/10"
                    : "border-gold/20 bg-gold/5"
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${glass ? "text-white/70" : "text-muted-foreground"}`}>
                  Votre proche reçoit à Dakar
                </p>
                <p className="text-3xl font-extrabold text-green-400 tracking-tight">
                  {formatMontant(result.montantRecu)} XOF
                </p>
              </motion.div>

              {/* Option 1 — Cash */}
              <motion.div
                variants={fadeUp}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${
                  glass
                    ? "border-white/15 bg-white/8"
                    : "border-border bg-background"
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${glass ? "bg-white/15" : "bg-secondary"}`}>
                  <Building2 className={`h-5 w-5 ${glass ? "text-gold" : "text-gold-dark"}`} />
                </span>
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                    Dépôt en cash dans nos bureaux
                  </p>
                  <p className={`text-xl font-extrabold mt-0.5 ${glass ? "text-white" : "text-ink"}`}>
                    {formatMontant(result.totalCash)} <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>{devise}</span>
                  </p>
                </div>
              </motion.div>

              {/* Option 2 — Mobile Money */}
              <motion.div
                variants={fadeUp}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${
                  glass
                    ? "border-gold/25 bg-gold/8"
                    : "border-gold/20 bg-gold/5"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20">
                  <Smartphone className="h-5 w-5 text-gold" />
                </span>
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${glass ? "text-white/65" : "text-muted-foreground"}`}>
                    Envoi par Mobile Money
                  </p>
                  <p className={`text-xl font-extrabold mt-0.5 ${glass ? "text-gold" : "text-gold-dark"}`}>
                    {formatMontant(result.totalMobileMoney)} <span className={`text-sm font-semibold ${glass ? "text-white/60" : "text-muted-foreground"}`}>{devise}</span>
                  </p>
                </div>
              </motion.div>

              {/* Accordéon détail */}
              <motion.div variants={fadeUp} className={`rounded-2xl border overflow-hidden ${glass ? "border-white/15" : "border-border"}`}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold transition-colors ${
                    glass ? "text-white/60 hover:text-white hover:bg-white/5" : "text-muted-foreground hover:text-ink hover:bg-muted/30"
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
                      <div className={`p-4 space-y-2.5 text-xs ${glass ? "text-white/70" : "text-muted-foreground"}`}>
                        <div className="flex justify-between">
                          <span>Montant reçu par le proche</span>
                          <span className={`font-bold ${glass ? "text-white" : "text-ink"}`}>{formatMontant(result.montantRecu)} XOF</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commission Noki-Noki (11,5%)</span>
                          <span className="font-semibold text-gold">+{formatMontant(result.commission)} {devise}</span>
                        </div>
                        <div className={`flex justify-between border-t pt-2 font-bold ${glass ? "border-white/10 text-white" : "border-border text-ink"}`}>
                          <span>Total cash (bureau)</span>
                          <span>{formatMontant(result.totalCash)} {devise}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais Mobile Money (3,5% du cash)</span>
                          <span className="font-semibold text-gold">+{formatMontant(result.fraisMobileMoney)} {devise}</span>
                        </div>
                        <div className={`flex justify-between border-t pt-2 font-bold ${glass ? "border-white/10 text-gold" : "border-border text-gold-dark"}`}>
                          <span>Total Mobile Money (arrondi)</span>
                          <span>{formatMontant(result.totalMobileMoney)} {devise}</span>
                        </div>
                        <div className={`flex justify-between text-[10px] pt-1 ${glass ? "text-white/40" : "text-muted-foreground/60"}`}>
                          <span>Taux XAF / XOF</span>
                          <span>Parité 1:1 (Franc CFA)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* CTA WhatsApp */}
              <motion.a
                variants={fadeUp}
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-lg"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                <span>Initier le transfert sur WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </motion.a>

              <motion.p variants={fadeUp} className={`text-[11px] text-center leading-relaxed ${glass ? "text-white/40" : "text-muted-foreground/60"}`}>
                Taux fixe garanti. Commission unique de 11,5%. En cliquant, vous serez mis en relation avec un agent Noki-Noki via WhatsApp.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
