"use client"

import { useEffect, useRef } from "react"
import type { PropertyType } from "@/lib/types"
import { formatPrice } from "@/lib/data"

interface PropertyMapProps {
  properties: PropertyType[]
  center?: [number, number]
  zoom?: number
  isLoaded?: boolean
}

declare global {
  interface Window {
    google: any
  }
}

export default function PropertyMap({ properties, center, zoom = 12, isLoaded = false }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return

    // Inicializar el mapa
    const mapOptions = {
      center: center ? { lat: center[0], lng: center[1] } : { lat: -34.6037, lng: -58.3816 }, // Buenos Aires por defecto
      zoom: zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }

    // Crear el mapa
    const map = new window.google.maps.Map(mapRef.current, mapOptions)
    mapInstanceRef.current = map

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Crear marcadores para cada propiedad
    properties.forEach((property) => {
      const marker = new window.google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map: map,
        title: property.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#dc2626",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      // Crear ventana de información
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="position: relative; height: 120px; margin-bottom: 8px; border-radius: 6px; overflow: hidden;">
              <img src="${property.images[0] || "/placeholder.svg"}" 
                   alt="${property.title}" 
                   style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h3 style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px; line-height: 1.3;">${property.title}</h3>
            <p style="color: #dc2626; font-weight: 700; margin: 0 0 6px 0; font-size: 16px;">${formatPrice(property.price, property.currency)}</p>
            <div style="display: flex; gap: 12px; font-size: 12px; color: #666; margin-bottom: 8px;">
              ${property.rooms > 0 ? `<span>${property.rooms} amb.</span>` : ""}
              ${property.bedrooms > 0 ? `<span>${property.bedrooms} dorm.</span>` : ""}
              ${property.bathrooms > 0 ? `<span>${property.bathrooms} baños</span>` : ""}
              ${property.total_built_surface || property.covered_surface ? `<span>${property.total_built_surface || property.covered_surface}m²</span>` : ""}
            </div>
            <a href="/propiedades/${property.id}" 
               style="color: #dc2626; font-size: 12px; text-decoration: none; font-weight: 500;"
               onmouseover="this.style.textDecoration='underline'"
               onmouseout="this.style.textDecoration='none'">
              Ver detalles →
            </a>
          </div>
        `,
      })

      // Agregar evento click al marcador
      marker.addListener("click", () => {
        // Cerrar otras ventanas de información abiertas
        markersRef.current.forEach((m) => {
          if (m.infoWindow) {
            m.infoWindow.close()
          }
        })
        infoWindow.open(map, marker)
      })

      // Guardar referencia a la ventana de información
      marker.infoWindow = infoWindow
      markersRef.current.push(marker)
    })

    // Ajustar el mapa para mostrar todos los marcadores si no hay centro definido
    if (!center && properties.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      properties.forEach((property) => {
        bounds.extend({ lat: property.latitude, lng: property.longitude })
      })
      map.fitBounds(bounds)
    }

    return () => {
      // Limpiar marcadores al desmontar
      markersRef.current.forEach((marker) => marker.setMap(null))
    }
  }, [properties, center, zoom, isLoaded])

  // Fallback mientras se carga el mapa
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2 text-gray-500 animate-pulse"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full relative"></div>
}
