// components/property-map.tsx
"use client"

import type { PropertyType } from "@/lib/types"
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider"
import GoogleMapComponent from "@/components/maps/google-map"

interface PropertyMapProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number } // Usar objeto en lugar de array para consistencia
  zoom?: number
  height?: string
}

/**
 * ESTA ES LA VERSIÓN RECOMENDADA.
 * * En lugar de manejar la API de Google Maps manualmente, este componente actúa
 * como un "contenedor con contexto", proveyendo el GoogleMapsProvider y luego
 * renderizando el GoogleMapComponent que ya maneja toda la lógica compleja.
 * * Es más simple, seguro, eficiente y reutiliza el código que ya creaste.
 */
export default function PropertyMap({ 
  properties, 
  center, 
  zoom = 12, 
  height = '400px' 
}: PropertyMapProps) {
  
  return (
    // 1. Proveemos el contexto de Google Maps
    <GoogleMapsProvider>
      {/* 2. Renderizamos el componente de mapa que ya está optimizado */}
      <GoogleMapComponent
        properties={properties}
        center={center}
        zoom={zoom}
        height={height}
      />
    </GoogleMapsProvider>
  )
}