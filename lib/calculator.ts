// Argent Noki-Noki — Moteur de calcul v2.0
//
// Corridors :
//   CG → SN            : commission 11,5% (10% ≥ 1 500 000), sans frais corridor
//   CG → BF/CI/ML/NE   : corridor 1,5% + commission 11,5% (10% ≥ 1 500 000)
//   SN/BF/CI/ML/NE → CG: commission 4,0% fixe, affichage simplifié
//
// Mobile Money (CG sender uniquement) :
//   frais 3,5% (2,5% ≥ 150 000 du montantRecu)

export type Devise   = "XAF" | "XOF"
export type PaysCode = "CG" | "SN" | "BF" | "CI" | "ML" | "NE"

/** Liste des pays de destination Afrique de l'Ouest (frais corridor 1,5%) */
export const PAYS_AFRIQUE_OUEST: PaysCode[] = ["BF", "CI", "ML", "NE"]

/** Tous les pays partenaires (destinations depuis Congo) */
export const DESTINATIONS_DEPUIS_CG: PaysCode[] = ["SN", "BF", "CI", "ML", "NE"]

export const PAYS: Record<PaysCode, {
  nom:     string
  nomCourt: string
  devise:  Devise
  drapeau: string
}> = {
  CG: { nom: "Congo-Brazzaville", nomCourt: "Congo",         devise: "XAF", drapeau: "cg" },
  SN: { nom: "Sénégal",           nomCourt: "Sénégal",       devise: "XOF", drapeau: "sn" },
  BF: { nom: "Burkina Faso",      nomCourt: "Burkina Faso",  devise: "XOF", drapeau: "bf" },
  CI: { nom: "Côte d'Ivoire",     nomCourt: "Côte d'Ivoire", devise: "XOF", drapeau: "ci" },
  ML: { nom: "Mali",              nomCourt: "Mali",          devise: "XOF", drapeau: "ml" },
  NE: { nom: "Niger",             nomCourt: "Niger",         devise: "XOF", drapeau: "ne" },
}

// ─── Logique de corridor ────────────────────────────────────────────────────

/** Le corridor Congo → Afrique de l'Ouest a un frais réseau de 1,5% */
export function hasCorridor(from: PaysCode, to: PaysCode): boolean {
  return from === "CG" && PAYS_AFRIQUE_OUEST.includes(to)
}

/** Congo envoie → true | Autre pays envoie → false */
export function congoEstEmetteur(from: PaysCode): boolean {
  return from === "CG"
}

// ─── Taux de commission ─────────────────────────────────────────────────────

function tauxCommissionCG(montantRecu: number): number {
  return montantRecu >= 1_500_000 ? 0.10 : 0.115
}

export function tauxCommissionLabel(from: PaysCode, montantRecu: number): string {
  if (from !== "CG") return "4,0 %"
  return montantRecu >= 1_500_000 ? "10,0 %" : "11,5 %"
}

// ─── Résultat ───────────────────────────────────────────────────────────────

export interface SimulationResult {
  from:              PaysCode
  to:                PaysCode
  montantRecu:       number   // Ce que le proche reçoit
  fraisCorridor:     number   // 1,5% × montantRecu (0 si pas de corridor)
  baseCorridor:      number   // montantRecu × 1,015 (= montantRecu si pas de corridor)
  commission:        number   // tauxCommission × baseCorridor
  tauxCommission:    number   // 0.115 | 0.10 | 0.04
  totalCash:         number   // baseCorridor + commission (arrondi ×5 si corridor)
  fraisMobileMoney:  number   // tauxMM × totalCash (0 si Congo reçoit)
  totalMobileMoney:  number   // totalCash + fraisMM arrondi ×5
  tauxMobileMoney:   number   // 0.035 | 0.025
  deviseEmetteur:    Devise
  deviseRecepteur:   Devise
  hasCorridor:       boolean
  congoEnvoie:       boolean
}

/** Arrondi au multiple de 5 supérieur */
function ceil5(n: number): number {
  return Math.ceil(n / 5) * 5
}

export function simulerTransfert(montantRecu: number, from: PaysCode, to: PaysCode): SimulationResult {
  const montant      = Math.round(montantRecu)
  const corridor     = hasCorridor(from, to)
  const cgEnvoie     = congoEstEmetteur(from)

  // ── Étape 1 : frais de corridor ──────────────────────────────────────────
  const fraisCorridor = corridor ? Math.round(montant * 0.015) : 0
  const baseCorridor  = montant + fraisCorridor               // = montant × 1.015 si corridor

  // ── Étape 2 : commission ─────────────────────────────────────────────────
  const tauxCommission = cgEnvoie ? tauxCommissionCG(montant) : 0.04
  const commission     = Math.round(baseCorridor * tauxCommission)

  // ── Étape 3 : total cash ─────────────────────────────────────────────────
  // Arrondi ×5 uniquement si corridor (nouvelles destinations)
  const totalCashRaw = baseCorridor + commission
  const totalCash    = corridor ? ceil5(totalCashRaw) : totalCashRaw

  // ── Étape 4 : Mobile Money (seulement si Congo envoie) ──────────────────
  const tauxMobileMoney  = montant >= 150_000 ? 0.025 : 0.035
  let fraisMM = 0
  let totalMobileMoney = 0
  
  if (cgEnvoie) {
    // La logique Mobile Money implique que le frais est prélevé sur le total TTC (cf. tableau PDF)
    // TTC = Cash / (1 - taux)
    const rawTotalMoMo = totalCash / (1 - tauxMobileMoney)
    totalMobileMoney = ceil5(rawTotalMoMo)
    fraisMM = totalMobileMoney - totalCash
  }

  return {
    from,
    to,
    montantRecu:       montant,
    fraisCorridor,
    baseCorridor,
    commission,
    tauxCommission,
    totalCash,
    fraisMobileMoney:  fraisMM,
    totalMobileMoney,
    tauxMobileMoney,
    deviseEmetteur:    PAYS[from].devise,
    deviseRecepteur:   PAYS[to].devise,
    hasCorridor:       corridor,
    congoEnvoie:       cgEnvoie,
  }
}

// ─── Simulation Inversée (TTC → HT) ──────────────────────────────────────────

function findMontantRecuForTotalCash(targetTotalCash: number, from: PaysCode, to: PaysCode): number {
  let low = 1
  let high = targetTotalCash
  let best = 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const res = simulerTransfert(mid, from, to)
    if (res.totalCash <= targetTotalCash) {
      best = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return best
}

function findMontantRecuForTotalMoMo(targetTotalMoMo: number, from: PaysCode, to: PaysCode): number {
  let low = 1
  let high = targetTotalMoMo
  let best = 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const res = simulerTransfert(mid, from, to)
    if (res.totalMobileMoney <= targetTotalMoMo) {
      best = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return best
}

export interface SimulationInverseResult {
  montantSaisi: number // Le budget TTC de l'utilisateur
  cashResult: SimulationResult
  momoResult: SimulationResult
}

/** 
 * À partir d'un budget global (TTC), calcule combien arrivera exactement à destination,
 * en explorant le calcul pour le Cash et pour le Mobile Money (Dichotomie).
 */
export function simulerTransfertInverse(montantEnvoye: number, from: PaysCode, to: PaysCode): SimulationInverseResult {
  const cgEnvoie = congoEstEmetteur(from)
  const recuCash = findMontantRecuForTotalCash(montantEnvoye, from, to)
  const recuMoMo = cgEnvoie ? findMontantRecuForTotalMoMo(montantEnvoye, from, to) : recuCash
  
  return {
    montantSaisi: montantEnvoye,
    cashResult: simulerTransfert(recuCash, from, to),
    momoResult: simulerTransfert(recuMoMo, from, to),
  }
}

// ─── Formatage ──────────────────────────────────────────────────────────────

export function formatMontant(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)
}

export const MONTANT_MINIMUM  = 5_000
export const WHATSAPP_NUMBER  = "242065325441"

// ─── Message WhatsApp ───────────────────────────────────────────────────────

export function genererMessageWhatsApp(r: SimulationResult): string {
  const emetteur  = PAYS[r.from]
  const recepteur = PAYS[r.to]
  const taux      = tauxCommissionLabel(r.from, r.montantRecu)

  if (!r.congoEnvoie) {
    return encodeURIComponent(
      `Bonjour Argent Noki-Noki,\n\n` +
      `Transfert : ${emetteur.nom} → ${recepteur.nom}\n` +
      `Commission Noki-Noki : ${taux}\n\n` +
      `• Mon proche reçoit au ${recepteur.nom} : ${formatMontant(r.montantRecu)} ${r.deviseRecepteur}\n` +
      `• Commission : ${formatMontant(r.commission)} ${r.deviseEmetteur}\n` +
      `• Total à envoyer : ${formatMontant(r.totalCash)} ${r.deviseEmetteur}\n\n` +
      `Merci de me confirmer les modalités.`
    )
  }

  const corridorLine = r.hasCorridor
    ? `• Frais de corridor réseau (1,5%) : ${formatMontant(r.fraisCorridor)} ${r.deviseEmetteur}\n`
    : ""

  return encodeURIComponent(
    `Bonjour Argent Noki-Noki,\n\n` +
    `Transfert : ${emetteur.nom} → ${recepteur.nom}\n` +
    `Commission Noki-Noki : ${taux}\n\n` +
    `• Mon proche reçoit au ${recepteur.nom} : ${formatMontant(r.montantRecu)} ${r.deviseRecepteur}\n` +
    corridorLine +
    `\nOptions de paiement :\n` +
    `  💵 En cash (bureau) : ${formatMontant(r.totalCash)} ${r.deviseEmetteur}\n` +
    `  📱 Par Mobile Money : ${formatMontant(r.totalMobileMoney)} ${r.deviseEmetteur}\n\n` +
    `Merci de me confirmer les modalités.`
  )
}
