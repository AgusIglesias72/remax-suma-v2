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

  if (!apiKey) {
    // Si no hay API key, mostramos un error en consola y proveemos un estado de error.
    console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined')
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: new Error('Google Maps API key is not defined') }}>
        {children}
      </GoogleMapsContext.Provider>
    )
  }

  // 1. Usamos el hook `useLoadScript` para manejar la carga del script.
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  })

  // 2. Ya no necesitamos el componente <LoadScript>.
  // Simplemente envolvemos a los children con nuestro Provider,
  // pasándole los valores que nos devuelve el hook.
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {/* Mostramos un loader mientras carga, o el error si falla */}
      {!isLoaded && !loadError && (
        <div className="google-maps-loading">
           <div className="text-center">
             <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
             <p className="text-sm text-gray-600">Cargando Google Maps...</p>
           </div>
         </div>
      )}
      
      {/* Una vez cargado, renderizamos los componentes hijos */}
      {isLoaded && !loadError && children}

      {/* Si hay un error, puedes mostrar un mensaje */}
      {loadError && <div>Error al cargar Google Maps.</div>}

    </GoogleMapsContext.Provider>
  )
}