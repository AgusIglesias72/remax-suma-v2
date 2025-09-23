// components/providers/google-maps-provider.tsx
"use client"

import { useLoadScript } from '@react-google-maps/api'
import { createContext, useContext, ReactNode, useMemo } from 'react'

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    preventGoogleFontsLoading: true,
  })

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    isLoaded: isLoaded && !!apiKey,
    loadError: loadError || (!apiKey ? new Error('Google Maps API key is not defined') : undefined)
  }), [isLoaded, loadError, apiKey])

  // Solo mostrar indicadores de carga/error en rutas que usen mapas
  // Para evitar mostrarlos en todo el sitio
  if (!apiKey || loadError) {
    return (
      <GoogleMapsContext.Provider value={contextValue}>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  )
}