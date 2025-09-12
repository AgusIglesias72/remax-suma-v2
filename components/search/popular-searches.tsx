"use client"

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'

// Base de 15 búsquedas populares
const allPopularSearches = [
  { id: 1, text: "Departamentos en Palermo", type: "location", params: { ciudad: "palermo", tipo: "departamento", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 2, text: "Casas en Vicente López", type: "location", params: { ciudad: "vicente-lopez", tipo: "casa", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 3, text: "2 ambientes en Belgrano", type: "combo", params: { ciudad: "belgrano", ambientes: "2", tipo: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 4, text: "Monoambientes en Recoleta", type: "combo", params: { ciudad: "recoleta", tipo: "monoambiente", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 5, text: "Propiedades con pileta", type: "amenity", params: { amenity: "pileta", ciudad: "", tipo: "", ambientes: "", precio: "", condicion: "", operacion: "" } },
  { id: 6, text: "Departamentos hasta USD 100k", type: "price", params: { precio: "0-100000", tipo: "departamento", ciudad: "", ambientes: "", amenity: "", condicion: "", operacion: "" } },
  { id: 7, text: "Casas en Olivos", type: "location", params: { ciudad: "olivos", tipo: "casa", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 8, text: "3 ambientes con cochera", type: "combo", params: { ambientes: "3", amenity: "cochera", ciudad: "", tipo: "", precio: "", condicion: "", operacion: "" } },
  { id: 9, text: "PH en San Isidro", type: "location", params: { ciudad: "san-isidro", tipo: "ph", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 10, text: "Departamentos nuevos", type: "condition", params: { condicion: "a-estrenar", tipo: "departamento", ciudad: "", ambientes: "", amenity: "", precio: "", operacion: "" } },
  { id: 11, text: "Propiedades con seguridad 24hs", type: "amenity", params: { amenity: "seguridad-24hs", ciudad: "", tipo: "", ambientes: "", precio: "", condicion: "", operacion: "" } },
  { id: 12, text: "Lofts en Puerto Madero", type: "location", params: { ciudad: "puerto-madero", tipo: "loft", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
  { id: 13, text: "Casas con jardín", type: "combo", params: { tipo: "casa", amenity: "jardin", ciudad: "", ambientes: "", precio: "", condicion: "", operacion: "" } },
  { id: 14, text: "Alquileres temporarios", type: "operation", params: { operacion: "alquiler-temporal", ciudad: "", tipo: "", ambientes: "", amenity: "", precio: "", condicion: "" } },
  { id: 15, text: "Oficinas en microcentro", type: "location", params: { ciudad: "microcentro", tipo: "oficina", ambientes: "", amenity: "", precio: "", condicion: "", operacion: "" } },
]

interface PopularSearchesProps {
  onSearch: (params: Record<string, string>) => void
}

export default function PopularSearches({ onSearch }: PopularSearchesProps) {
  const [searches, setSearches] = useState<typeof allPopularSearches>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Seleccionar 5 búsquedas aleatorias
    const shuffled = [...allPopularSearches].sort(() => 0.5 - Math.random())
    setSearches(shuffled.slice(0, 5))
  }, [])

  if (!mounted) {
    return null
  }

  const handleSearchClick = (search: typeof allPopularSearches[0]) => {
    // Filtrar parámetros vacíos
    const filteredParams = Object.entries(search.params)
      .filter(([_, value]) => value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    
    onSearch(filteredParams)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-white/80">
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-medium">Búsquedas populares:</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2">
        {searches.map((search) => (
          <Badge
            key={search.id}
            variant="secondary"
            className="cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 px-3 py-1.5"
            onClick={() => handleSearchClick(search)}
          >
            {search.text}
          </Badge>
        ))}
      </div>
    </div>
  )
}