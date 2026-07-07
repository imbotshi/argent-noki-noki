// Argent Noki-Noki — Moteur de calcul des transferts
// Logique :
//   - Vous entrez le montant que votre proche doit recevoir (montantRecu)
//   - Commission 11,5% s'ajoute → ce que vous payez EN CASH (totalCash)
//   - +3,5% sur le total cash → ce que vous payez par MOBILE MONEY (arrondi supérieur à 5)

export type Devise = "XAF" | "XOF";

export interface SimulationResult {
  montantRecu: number;         // Ce que le proche reçoit à Dakar
  commission: number;          // 11,5% du montant reçu
  totalCash: number;           // Dépôt en bureau : montantRecu + commission
  fraisMobileMoney: number;    // 3,5% du totalCash
  totalMobileMoney: number;    // totalCash + fraisMobileMoney, arrondi supérieur à 5
  devise: Devise;
}

const COMMISSION_RATE = 0.115;        // 11,5%
const MOBILE_MONEY_RATE = 0.035;      // 3,5%

/** Arrondit au multiple de 5 supérieur */
function plafondCinq(n: number): number {
  return Math.ceil(n / 5) * 5;
}

/**
 * Calcule tous les paramètres d'un transfert
 * @param montant - Ce que le proche doit recevoir (ou ce que l'expéditeur dépose en valeur nominale)
 * @param devise  - Devise saisie (XAF ou XOF, parité 1:1)
 */
export function simulerTransfert(montant: number, devise: Devise): SimulationResult {
  const montantRecu = Math.round(montant);
  const commission = Math.round(montantRecu * COMMISSION_RATE);
  const totalCash = montantRecu + commission;
  const fraisMobileMoney = totalCash * MOBILE_MONEY_RATE;
  const totalMobileMoney = plafondCinq(totalCash + fraisMobileMoney);

  return {
    montantRecu,
    commission,
    totalCash,
    fraisMobileMoney: Math.round(fraisMobileMoney),
    totalMobileMoney,
    devise,
  };
}

/** Formate un nombre en FCFA avec séparateurs français */
export function formatMontant(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
}

export const MONTANT_MINIMUM = 5000;

export const WHATSAPP_NUMBER = "22177384754";

/** Génère le message WhatsApp pré-rempli avec les deux options de paiement */
export function genererMessageWhatsApp(result: SimulationResult): string {
  return encodeURIComponent(
    `Bonjour Argent Noki-Noki,\n\nJe souhaite effectuer un transfert :\n• Mon proche à Dakar reçoit : ${formatMontant(result.montantRecu)} XOF\n\nOptions de paiement :\n• 💵 En cash (bureau) : ${formatMontant(result.totalCash)} ${result.devise}\n• 📱 Par Mobile Money : ${formatMontant(result.totalMobileMoney)} ${result.devise}\n\nMerci de me confirmer les modalités.`
  );
}
