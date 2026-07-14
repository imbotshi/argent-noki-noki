import Image from "next/image"

export type FlagCode = "cg" | "sn" | "bf" | "ci" | "ml" | "ne"

const FLAG_URLS: Record<FlagCode, string> = {
  cg: "https://flagcdn.com/cg.svg",
  sn: "https://flagcdn.com/sn.svg",
  bf: "https://flagcdn.com/bf.svg",
  ci: "https://flagcdn.com/ci.svg",
  ml: "https://flagcdn.com/ml.svg",
  ne: "https://flagcdn.com/ne.svg",
}

const FLAG_ALTS: Record<FlagCode, string> = {
  cg: "Drapeau Congo-Brazzaville",
  sn: "Drapeau Sénégal",
  bf: "Drapeau Burkina Faso",
  ci: "Drapeau Côte d'Ivoire",
  ml: "Drapeau Mali",
  ne: "Drapeau Niger",
}

/**
 * Composant Flag — images via flagcdn.com
 * Contourne l'absence d'affichage des emoji drapeaux sur Windows
 */
export function Flag({
  code,
  size = 24,
  className = "",
}: {
  code: FlagCode
  size?: number
  className?: string
}) {
  return (
    <Image
      src={FLAG_URLS[code]}
      alt={FLAG_ALTS[code]}
      width={size}
      height={size}
      className={`inline-block object-cover rounded-[3px] ${className}`}
      style={{ width: size, height: Math.round(size * 0.67) }}
    />
  )
}
