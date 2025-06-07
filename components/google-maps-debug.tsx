// components/google-maps-debug.tsx
// RUTA: components/google-maps-debug.tsx
"use client"

import { useGoogleMaps } from "@/components/providers/google-maps-provider"

export default function GoogleMapsDebug() {
  const { isLoaded, loadError } = useGoogleMaps()

  if (process.env.NODE_ENV !== 'development') {
    return null // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">Google Maps Status</h3>
      <div>API Key: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ Configurada' : '❌ Falta'}</div>
      <div>Is Loaded: {isLoaded ? '✅ Cargado' : '⏳ Cargando...'}</div>
      <div>Load Error: {loadError ? `❌ ${loadError.message}` : '✅ Sin errores'}</div>
      <div>Window.google: {typeof window !== 'undefined' && window.google ? '✅ Disponible' : '❌ No disponible'}</div>
    </div>
  )
}

// Para usar temporalmente en layout o páginas durante desarrollo