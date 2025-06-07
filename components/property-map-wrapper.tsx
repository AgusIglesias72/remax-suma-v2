"use client"

import dynamic from "next/dynamic"
import type { PropertyType } from "@/lib/types"

// Importación dinámica para evitar problemas de SSR
const GoogleMapComponent = dynamic(() => import("./google-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg animate-pulse">
      <div className="text-center text-gray-600">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>Cargando mapa...</p>
      </div>
    </div>
  ),
})

interface PropertyMapWrapperProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

export default function PropertyMapWrapper(props: PropertyMapWrapperProps) {
  return <GoogleMapComponent {...props} />
}
