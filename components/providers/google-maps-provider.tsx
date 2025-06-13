// components/providers/google-maps-provider.tsx
"use client"

import { useLoadScript } from '@react-google-maps/api'
import { createContext, useContext, ReactNode } from 'react'

// El tipo de librería debe ser un array de strings válidos.
type Libraries = ("places" | "geometry" | "drawing" | "visualization")[];
const libraries: Libraries = ["places"];

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined)

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
}

interface GoogleMapsProviderProps {
  children: ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // ✅ CORRECCIÓN: Llamar el hook SIEMPRE, antes de cualquier return condicional
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '', // Proporcionar string vacío si no hay API key
    libraries,
    preventGoogleFontsLoading: true, // Opcional: prevenir carga de fuentes
  })

  // ✅ Manejar el caso de API key faltante DESPUÉS del hook
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined')
    return (
      <GoogleMapsContext.Provider value={{ 
        isLoaded: false, 
        loadError: new Error('Google Maps API key is not defined') 
      }}>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  // ✅ Manejar errores de carga
  if (loadError) {
    console.error('❌ Error loading Google Maps:', loadError)
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError }}>
        <div className="text-center p-4">
          <div className="text-red-600 mb-2">Error al cargar Google Maps</div>
          <div className="text-sm text-gray-600">{loadError.message}</div>
        </div>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  // ✅ Estado de carga
  if (!isLoaded) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando Google Maps...</p>
          </div>
        </div>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  // ✅ Éxito: Google Maps cargado correctamente
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}