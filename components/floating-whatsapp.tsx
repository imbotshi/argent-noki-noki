"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/calculator"
import { useState, useEffect } from "react"

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Apparaît après 1.5s
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Bonjour Argent Noki-Noki, je souhaite effectuer un transfert vers Dakar."
  )}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="rounded-xl bg-ink px-3 py-2 text-xs font-medium text-white shadow-lg whitespace-nowrap"
              >
                Contacter un conseiller
                <div className="absolute right-4 bottom-[-5px] h-2.5 w-2.5 rotate-45 bg-ink" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#25D366" }}
            aria-label="Contacter un conseiller sur WhatsApp"
          >
            <MessageCircle className="h-7 w-7 text-white fill-white" />
            {/* Pulse ring */}
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "#25D366" }}
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
