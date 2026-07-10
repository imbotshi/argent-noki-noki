// Argent Noki-Noki — Moteur de calcul des transferts
//
// Directions supportées :
//   CG_SN : Congo → Sénégal  — commission 11,5% (10% dès 1 500 000 XAF)
//   SN_CG : Sénégal → Congo  — commission  4,0%
//
// Formules :
//   commission       = montantRecu × tauxCommission
//   totalCash        = montantRecu + commission
//   fraisMobileMoney = totalCash × tauxMomo (3,5% < 150k | 2,5% ≥ 150k)
//   totalMobileMoney = plafond5(totalCash + fraisMM)

export type Devise    = "XAF" | "XOF";
export type Direction = "CG_SN" | "SN_CG";

export interface Pays {
  code:    Direction extends `${infer A}_${string}` ? A : never;
  nom:     string;
  ville:   string;
  devise:  Devise;
  drapeau: string;
}

export const PAYS: Record<string, { nom: string; ville: string; devise: Devise; drapeau: string }> = {
  CG: { nom: "Congo-Brazzaville", ville: "Brazzaville", devise: "XAF", drapeau: "cg" },
  SN: { nom: "Sénégal",           ville: "Sénégal",     devise: "XOF", drapeau: "sn" },
};

// Commission Noki-Noki fixe pour SN→CG
const COMMISSION_SN_CG = 0.040; // 4,0 %

// Commission CG→SN dégressive
function tauxCommissionCG(montant: number): number {
  if (montant >= 1_500_000) return 0.10;  // 10,0 % dès 1 500 000
  return 0.115;                            // 11,5 % standard
}

/** Taux de commission CG→SN pour un montant donné (pour affichage) */
export function tauxCommissionCGLabel(montant: number): string {
  return montant >= 1_500_000 ? "10,0 %" : "11,5 %";
}

/** Pays émetteur selon la direction */
export function paysEmetteur(dir: Direction) {
  return PAYS[dir.split("_")[0]];
}
/** Pays récepteur selon la direction */
export function paysRecepteur(dir: Direction) {
  return PAYS[dir.split("_")[1]];
}
/** Inverse la direction */
export function inverserDirection(dir: Direction): Direction {
  return dir === "CG_SN" ? "SN_CG" : "CG_SN";
}
/** Taux de commission affiché (lisible) — pour SN_CG ou taux fixe CG_SN */
export function tauxLabel(dir: Direction, montant = 0): string {
  if (dir === "SN_CG") return "4,0 %";
  return tauxCommissionCGLabel(montant);
}

export interface SimulationResult {
  direction:         Direction;
  montantRecu:       number;   // Ce que le proche reçoit
  commission:        number;   // tauxCommission × montantRecu
  tauxCommission:    number;   // taux réel appliqué (0.115 ou 0.10 ou 0.04)
  totalCash:         number;   // montantRecu + commission
  fraisMobileMoney:  number;   // tauxMomo × totalCash
  totalMobileMoney:  number;   // totalCash + fraisMM, arrondi ↑ multiple de 5
  tauxMobileMoney:   number;   // 0.035 ou 0.025
  deviseEmetteur:    Devise;
  deviseRecepteur:   Devise;
}

/** Arrondi au multiple de 5 supérieur */
function plafondCinq(n: number): number {
  return Math.ceil(n / 5) * 5;
}

export function simulerTransfert(montant: number, direction: Direction): SimulationResult {
  const montantRecu   = Math.round(montant);

  // Commission selon direction et palier
  const tauxCommission = direction === "CG_SN"
    ? tauxCommissionCG(montantRecu)
    : COMMISSION_SN_CG;

  const commission       = Math.round(montantRecu * tauxCommission);
  const totalCash        = montantRecu + commission;

  // Frais Mobile Money dégressifs selon la grille Noki-Noki
  const tauxMobileMoney  = montantRecu >= 150_000 ? 0.025 : 0.035;
  const fraisMM          = totalCash * tauxMobileMoney;
  const totalMobileMoney = plafondCinq(totalCash + fraisMM);

  return {
    direction,
    montantRecu,
    commission,
    tauxCommission,
    totalCash,
    fraisMobileMoney:  Math.round(fraisMM),
    totalMobileMoney,
    tauxMobileMoney,
    deviseEmetteur:   paysEmetteur(direction).devise,
    deviseRecepteur:  paysRecepteur(direction).devise,
  };
}

/** Formate un nombre avec séparateurs français */
export function formatMontant(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
}

export const MONTANT_MINIMUM = 5_000;
export const WHATSAPP_NUMBER = "242065325441";

/** Message WhatsApp pré-rempli */
export function genererMessageWhatsApp(r: SimulationResult): string {
  const emetteur  = paysEmetteur(r.direction);
  const recepteur = paysRecepteur(r.direction);
  const taux      = r.direction === "CG_SN"
    ? tauxCommissionCGLabel(r.montantRecu)
    : "4,0 %";

  if (r.direction === "SN_CG") {
    return encodeURIComponent(
      `Bonjour Argent Noki-Noki,\n\n` +
      `Transfert : ${emetteur.nom} → ${recepteur.nom}\n` +
      `Commission Noki-Noki : ${taux}\n\n` +
      `• Mon proche reçoit au ${recepteur.nom} : ${formatMontant(r.montantRecu)} ${r.deviseRecepteur}\n` +
      `• Commission : ${formatMontant(r.commission)} ${r.deviseEmetteur}\n` +
      `• Total à envoyer : ${formatMontant(r.totalCash)} ${r.deviseEmetteur}\n\n` +
      `Merci de me confirmer les modalités.`
    );
  }

  return encodeURIComponent(
    `Bonjour Argent Noki-Noki,\n\n` +
    `Transfert : ${emetteur.nom} → ${recepteur.nom}\n` +
    `Commission Noki-Noki : ${taux}\n\n` +
    `• Mon proche reçoit au ${recepteur.nom} : ${formatMontant(r.montantRecu)} ${r.deviseRecepteur}\n\n` +
    `Options de paiement :\n` +
    `  💵 En cash (bureau) : ${formatMontant(r.totalCash)} ${r.deviseEmetteur}\n` +
    `  📱 Par Mobile Money : ${formatMontant(r.totalMobileMoney)} ${r.deviseEmetteur}\n\n` +
    `Merci de me confirmer les modalités.`
  );
}
