// Argent Noki-Noki — Moteur de calcul des transferts
//
// Directions supportées :
//   CG_SN : Congo → Sénégal  — commission 11,5%
//   SN_CG : Sénégal → Congo  — commission  4,0%
//
// Formules :
//   totalCash        = montantRecu × (1 + tauxCommission)
//   totalMobileMoney = totalCash × (1 + 0.035) arrondi au multiple de 5 ↑

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
  CG: { nom: "Congo-Brazzaville", ville: "Brazzaville", devise: "XAF", drapeau: "🇨🇬" },
  SN: { nom: "Sénégal",           ville: "Dakar",        devise: "XOF", drapeau: "🇸🇳" },
};

const COMMISSION: Record<Direction, number> = {
  CG_SN: 0.115, // 11,5 %
  SN_CG: 0.040, //  4,0 %
};

const MOBILE_MONEY_RATE = 0.035; // 3,5 %

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
/** Taux de commission affiché (lisible) */
export function tauxLabel(dir: Direction): string {
  return dir === "CG_SN" ? "11,5 %" : "4,0 %";
}

export interface SimulationResult {
  direction:         Direction;
  montantRecu:       number;   // Ce que le proche reçoit
  commission:        number;   // tauxCommission × montantRecu
  totalCash:         number;   // montantRecu + commission
  fraisMobileMoney:  number;   // 3,5 % × totalCash
  totalMobileMoney:  number;   // totalCash + fraisMM, arrondi ↑ multiple de 5
  deviseEmetteur:    Devise;
  deviseRecepteur:   Devise;
}

/** Arrondi au multiple de 5 supérieur */
function plafondCinq(n: number): number {
  return Math.ceil(n / 5) * 5;
}

export function simulerTransfert(montant: number, direction: Direction): SimulationResult {
  const montantRecu      = Math.round(montant);
  const commission       = Math.round(montantRecu * COMMISSION[direction]);
  const totalCash        = montantRecu + commission;
  const fraisMM          = totalCash * MOBILE_MONEY_RATE;
  const totalMobileMoney = plafondCinq(totalCash + fraisMM);

  return {
    direction,
    montantRecu,
    commission,
    totalCash,
    fraisMobileMoney:  Math.round(fraisMM),
    totalMobileMoney,
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

/** Message WhatsApp pré-rempli avec les deux options de paiement */
export function genererMessageWhatsApp(r: SimulationResult): string {
  const emetteur  = paysEmetteur(r.direction);
  const recepteur = paysRecepteur(r.direction);
  return encodeURIComponent(
    `Bonjour Argent Noki-Noki,\n\n` +
    `Transfert : ${emetteur.drapeau} ${emetteur.nom} → ${recepteur.drapeau} ${recepteur.nom}\n` +
    `Commission Noki-Noki : ${tauxLabel(r.direction)}\n\n` +
    `• Proche reçoit à ${recepteur.ville} : ${formatMontant(r.montantRecu)} ${r.deviseRecepteur}\n\n` +
    `Options de paiement :\n` +
    `  💵 En cash (bureau) : ${formatMontant(r.totalCash)} ${r.deviseEmetteur}\n` +
    `  📱 Par Mobile Money : ${formatMontant(r.totalMobileMoney)} ${r.deviseEmetteur}\n\n` +
    `Merci de me confirmer les modalités.`
  );
}
