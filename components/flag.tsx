import Image from "next/image"

type FlagCode = "cg" | "sn"

const FLAG_URLS: Record<FlagCode, string> = {
  cg: "https://flagcdn.com/cg.svg",
  sn: "https://flagcdn.com/sn.svg",
}

const FLAG_ALTS: Record<FlagCode, string> = {
  cg: "Drapeau Congo-Brazzaville",
  sn: "Drapeau Sénégal",
}

/**
 * Composant Flag — affiche le drapeau d'un pays via flagcdn.com
 * Résout l'absence d'affichage des emoji drapeaux sur Windows
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

export type { FlagCode }
