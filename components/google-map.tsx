// components/google-map.tsx
"use client"

import { useCallback, useState, useMemo, useEffect } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import Image from "next/image"
import Link from "next/link"
import type { PropertyType } from "@/lib/types"
import { formatPrice, formatSurface } from "@/lib/data"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"

interface GoogleMapComponentProps {
  properties: PropertyType[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: -34.6037,
  lng: -58.3816, // Buenos Aires
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
}

// Icono personalizado para los marcadores
const createCustomMarkerIcon = (isSelected: boolean = false) => ({
  path: google.maps.SymbolPath.CIRCLE,
  scale: isSelected ? 12 : 8,
  fillColor: "#dc2626",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 2,
})

export default function GoogleMapComponent({
  properties,
  center,
  zoom = 12,
  height = "400px",
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const mapCenter = useMemo(() => {
    if (center) return center
    if (properties.length === 1) {
      return { lat: properties[0].latitude, lng: properties[0].longitude }
    }
    return defaultCenter
  }, [center, properties])

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map)

      // Si hay múltiples propiedades y no hay centro específico, ajustar el mapa para mostrar todas
      if (properties.length > 1 && !center) {
        const bounds = new window.google.maps.LatLngBounds()
        properties.forEach((property) => {
          bounds.extend({ lat: property.latitude, lng: property.longitude })
        })
        map.fitBounds(bounds)
        
        // Asegurar un zoom mínimo para evitar estar muy alejado
        const listener = google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() && map.getZoom()! > 15) map.setZoom(15)
          google.maps.event.removeListener(listener)
        })
      }
    },
    [properties, center],
  )

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = (property: PropertyType) => {
    setSelectedProperty(property)
  }

  const handleInfoWindowClose = () => {
    setSelectedProperty(null)
  }

  // Función para generar un ícono personalizado más visible
  const getMarkerIcon = (property: PropertyType) => {
    const isSelected = selectedProperty?.id === property.id
    
    if (isLoaded && window.google) {
      return createCustomMarkerIcon(isSelected)
    }
    
    return undefined
  }

  if (loadError) {
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center rounded-lg" style={{ height }}>
        <div className="text-center text-gray-600">
          <p className="mb-2">Error al cargar el mapa</p>
          <p className="text-sm">Verifica tu conexión a internet y la API key de Google Maps</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center rounded-lg animate-pulse" style={{ height }}>
        <div className="text-center text-gray-600">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Marcadores usando componente Marker estándar */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={{ lat: property.latitude, lng: property.longitude }}
            onClick={() => handleMarkerClick(property)}
            icon={getMarkerIcon(property)}
            title={property.title}
          />
        ))}

        {/* InfoWindow para la propiedad seleccionada */}
        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10),
            }}
          >
            <div className="max-w-xs p-2">
              <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={selectedProperty.images[0] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                {selectedProperty.title}
              </h3>

              <p className="text-red-600 font-bold text-lg mb-2">
                {formatPrice(selectedProperty.price, selectedProperty.currency)}
              </p>

              <div className="flex gap-3 text-xs text-gray-600 mb-3">
                {selectedProperty.rooms > 0 && <span>{selectedProperty.rooms} amb.</span>}
                {selectedProperty.bedrooms > 0 && <span>{selectedProperty.bedrooms} dorm.</span>}
                {selectedProperty.bathrooms > 0 && <span>{selectedProperty.bathrooms} baños</span>}
                {(selectedProperty.total_built_surface || selectedProperty.covered_surface) && (
                  <span>
                    {formatSurface(selectedProperty.total_built_surface || selectedProperty.covered_surface)}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-3">
                📍 {selectedProperty.address}, {selectedProperty.city}
              </div>

              <Link
                href={`/propiedades/${selectedProperty.id}`}
                className="inline-block bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
              >
                Ver detalles →
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Indicador de cantidad de propiedades */}
      {properties.length > 0 && (
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-sm text-sm font-medium">
          {properties.length} propiedad{properties.length !== 1 ? 'es' : ''}
        </div>
      )}
    </div>
  )
}