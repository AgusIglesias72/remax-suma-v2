"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VentasPage() {
  const router = useRouter()

  useEffect(() => {
    // Redireccionar a la página principal de estadísticas
    router.replace("/admin/estadisticas")
  }, [router])

  return null
}