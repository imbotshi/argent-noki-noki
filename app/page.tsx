"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, ShieldCheck, Zap, TrendingUp, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TransferSimulator from "@/components/transfer-simulator"
import PricingTable from "@/components/pricing-table"

// ─── Motion variants (miroir TerraNova) ────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.3 } },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Nav items ────────────────────────────────────────────────────────────
const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* ─── HERO SECTION — full-screen avec background image ─────────────── */}
      <section className="relative flex min-h-screen flex-col overflow-hidden p-3 md:p-5">

        {/* Background */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt="Vue aérienne de Brazzaville au coucher du soleil, Congo"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        </div>

        {/* Contenu hero */}
        <div className="relative flex flex-1 flex-col rounded-[28px] px-4 pt-5 pb-8 md:px-8 md:pt-6 md:pb-12">

          {/* ── Navigation (pattern TerraNova : pill blanc flottant) ────── */}
          <motion.nav
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4"
          >
            {/* Logo + liens */}
            <div className="flex flex-1 items-center justify-between rounded-full bg-white px-5 py-3 shadow-md md:px-7 md:py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                  <Image src="/logo.jpeg" alt="Noki-Noki" fill className="object-cover" />
                </div>
                <span className="text-base font-bold tracking-tight text-ink hidden sm:block">
                  Argent <span className="text-gold">Noki-Noki</span>
                </span>
              </Link>

              {/* Desktop links */}
              <ul className="hidden items-center gap-1 md:flex">
                {NAV.map((navItem) => (
                  <li key={navItem.href} className="relative">
                    <Link
                      href={navItem.href}
                      className="relative rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
                    >
                      {navItem.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile toggle */}
              <button
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-full border border-border"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            {/* CTA externe */}
            <Link
              href="/simulateur"
              className="hidden md:inline-flex items-center gap-2 rounded-full gold-gradient py-3 pl-6 pr-3 text-sm font-bold text-ink shadow-md hover:opacity-90 transition md:py-4 md:pl-7 md:pr-4"
            >
              <span>Simuler</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.nav>

          {/* Mobile menu déroulant */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-auto w-full max-w-7xl overflow-hidden mt-2"
              >
                <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 flex flex-col gap-1 md:hidden">
                  {NAV.map((navItem) => (
                    <Link
                      key={navItem.href}
                      href={navItem.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-ink-soft hover:bg-secondary transition-colors"
                    >
                      {navItem.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hero content — centré, stagger, blur (pattern TerraNova) ─── */}
          <div className="mx-auto mt-14 flex w-full max-w-7xl flex-1 flex-col md:mt-20">
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="flex flex-col lg:flex-row gap-12 items-center justify-between"
            >
              {/* Left — Texte */}
              <div className="text-left max-w-xl">
                <motion.div variants={item} className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3" />
                    Plus de 3 200 transferts sécurisés
                  </span>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
                >
                  Envoyez de l'argent du{" "}
                  <span className="text-gold-gradient">Congo-Brazzaville</span>
                  {" "}au{" "}
                  <span className="text-gold-gradient">Sénégal</span>.
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-6 max-w-lg text-base font-medium leading-relaxed text-white/80 drop-shadow md:text-lg"
                >
                  Calculez instantanément combien votre proche recevra et combien vous paierez — en cash ou par Mobile Money. Transparent. Garanti.
                </motion.p>

                <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/simulateur"
                    className="inline-flex items-center gap-2 rounded-full gold-gradient py-3 pl-7 pr-3 text-sm font-bold text-ink shadow-lg hover:opacity-90 transition md:py-4 md:pl-8 md:pr-4"
                  >
                    <span>Simuler un transfert</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition md:py-4"
                  >
                    Comment ça marche ?
                  </Link>
                </motion.div>

                {/* Piliers de confiance (glassmorphism — pattern TerraNova) */}
                <motion.div variants={item} className="mt-12 grid grid-cols-3 gap-3">
                  {[
                    { icon: <ShieldCheck className="h-4 w-4" />, label: "Taux fixe & transparent" },
                    { icon: <Zap className="h-4 w-4" />, label: "Calcul instantané" },
                    { icon: <TrendingUp className="h-4 w-4" />, label: "Via WhatsApp" },
                  ].map((feat) => (
                    <div
                      key={feat.label}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-white/15 bg-black/30 p-3 backdrop-blur-md"
                    >
                      <span className="text-gold">{feat.icon}</span>
                      <span className="text-[11px] font-semibold leading-snug text-white/85">{feat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Simulateur en glass card sur le hero */}
              <motion.div variants={item} className="w-full max-w-sm lg:max-w-md">
                <TransferSimulator glass={true} />
              </motion.div>
            </motion.div>

            {/* Bottom stat row — glassmorphism (pattern TerraNova) */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 md:mt-24"
            >
              {[
                { value: "11,5%", desc: "Commission fixe unique" },
                { value: "< 2h", desc: "Délai de traitement" },
                { value: "1:1", desc: "Parité XAF / XOF" },
                { value: "0", desc: "Frais cachés" },
              ].map((stat) => (
                <motion.div
                  key={stat.value}
                  variants={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 pr-6 text-white backdrop-blur-md"
                >
                  <div>
                    <p className="text-xl font-extrabold text-gold">{stat.value}</p>
                    <p className="text-xs text-white/65">{stat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION GRILLE TARIFAIRE (hors hero, fond clair) ────────────── */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-ink tracking-tight">Grille tarifaire</h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Exemples de calculs pour les montants les plus fréquents.
              </p>
            </div>
            <Link
              href="/simulateur"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:text-gold-dark transition-colors"
            >
              Simuler un montant précis <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <PricingTable />
        </div>
      </section>

      {/* ─── SECTION CTA FINALE (fond sombre, glassmorphism) ─────────────── */}
      <section className="relative overflow-hidden bg-ink-soft py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-gold tracking-tight md:text-4xl">
            Prêt à envoyer de l'argent en toute sérénité ?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
            Profitez d'un transfert Congo-Brazzaville → Sénégal sans tracas, avec un taux transparent et un conseiller disponible 20h/24 7j/7 sur WhatsApp.
          </p>
          <Link
            href="/simulateur"
            className="inline-flex items-center gap-2 rounded-full gold-gradient px-8 py-4 text-sm font-bold text-ink hover:opacity-90 transition shadow-lg"
          >
            <span>Accéder au simulateur</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
