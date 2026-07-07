import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-ink-soft text-white border-t border-white/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                <Image
                  src="/logo.jpeg"
                  alt="Argent Noki-Noki"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Argent</p>
                <p className="text-xs font-semibold text-gold leading-none mt-0.5 tracking-widest uppercase">Noki-Noki</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              La solution de confiance pour vos transferts d'argent internationaux du Congo-Brazzaville vers Dakar. Simple, rapide et 100% transparent.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/simulateur" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Simulateur
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Transparence</h3>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Tous nos calculs sont basés sur une commission fixe de 11,5% et des frais de Mobile Money transparents. Aucun frais caché.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
              <span>Commission 11,5% simple</span>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Argent Noki-Noki. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground">
              Transferts Congo → Dakar
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
