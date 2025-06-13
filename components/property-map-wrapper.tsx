// components/property-map-wrapper.tsx
"use client"

import dynamic from "next/dynamic"
import type { PropertyType } from "@/lib/types"

// La importación dinámica y el estado de carga ya están perfectos.
const GoogleMapComponent = dynamic(() => import("./google-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg animate-pulse">
      {/* Tu excelente componente de carga va aquí... */}
      <p>Cargando mapa...</p>
    </div>
  ),
})

interface PropertyMapWrapperProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  onPropertyClick?: (property: PropertyType) => void
  className?: string
}

/**
 * MEJORA: Este componente ahora es un "wrapper" puro.
 * Su única responsabilidad es cargar el mapa dinámicamente y pasarle las props.
 * Toda la lógica de filtrado, centrado y overlays se delega a GoogleMapComponent.
 */
export default function PropertyMapWrapper({
  properties,
  center,
  zoom = 11,
  height = "100%", // El valor por defecto es 100%
  onPropertyClick,
  className = ""
}: PropertyMapWrapperProps) {

  // ELIMINADO: Ya no filtramos propiedades aquí.
  // ELIMINADO: Ya no calculamos el centro aquí.
  // ELIMINADO: Ya no mostramos el overlay de conteo de propiedades aquí.

  return (
    <div className={`relative w-full h-full ${className}`}> 
      <GoogleMapComponent 
        // Pasamos todas las props directamente al componente hijo.
        properties={properties} // Pasamos la lista COMPLETA
        center={center}
        zoom={zoom}
        height="100%" // El hijo debe ocupar todo el espacio del wrapper
        onPropertyClick={onPropertyClick}
      />
    </div>
  )
}