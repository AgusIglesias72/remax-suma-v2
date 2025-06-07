// components/google-map.tsx
// RUTA: components/google-map.tsx
"use client"

import { useCallback, useState, useMemo, useEffect } from "react"
import { GoogleMap, InfoWindow } from "@react-google-maps/api"
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
  mapId: "DEMO_MAP_ID", // Requerido para AdvancedMarkerElement
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

export default function GoogleMapComponent({
  properties,
  center,
  zoom = 12,
  height = "400px",
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([])

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

      // Si hay múltiples propiedades, ajustar el mapa para mostrar todas
      if (properties.length > 1 && !center) {
        const bounds = new window.google.maps.LatLngBounds()
        properties.forEach((property) => {
          bounds.extend({ lat: property.latitude, lng: property.longitude })
        })
        map.fitBounds(bounds)
      }
    },
    [properties, center],
  )

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Crear marcadores avanzados cuando el mapa y las propiedades cambien
  useEffect(() => {
    if (!map || !isLoaded || !window.google?.maps?.marker?.AdvancedMarkerElement) return

    // Limpiar marcadores anteriores
    markers.forEach(marker => {
      marker.map = null
    })

    // Crear nuevos marcadores
    const newMarkers = properties.map((property) => {
      // Crear elemento del marcador
      const markerElement = document.createElement('div')
      markerElement.className = 'custom-marker'
      markerElement.style.cssText = `
        width: 16px;
        height: 16px;
        background-color: #dc2626;
        border: 2px solid #ffffff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      // Crear marcador avanzado
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: property.latitude, lng: property.longitude },
        content: markerElement,
        title: property.title,
      })

      // Agregar evento click
      marker.addListener('click', () => {
        setSelectedProperty(property)
      })

      return marker
    })

    setMarkers(newMarkers)

    return () => {
      newMarkers.forEach(marker => {
        marker.map = null
      })
    }
  }, [map, properties, isLoaded, markers])

  const handleInfoWindowClose = () => {
    setSelectedProperty(null)
  }

  if (loadError) {
    return (
      <div className="w-full bg-gray-200 flex items-center justify-center rounded-lg" style={{ height }}>
        <div className="text-center text-gray-600">
          <p className="mb-2">Error al cargar el mapa</p>
          <p className="text-sm">Verifica tu conexión a internet</p>
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

              <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">{selectedProperty.title}</h3>

              <p className="text-red-600 font-bold text-lg mb-2">
                {formatPrice(selectedProperty.price, selectedProperty.currency)}
              </p>

              <div className="flex gap-3 text-xs text-gray-600 mb-3">
                {selectedProperty.rooms > 0 && <span>{selectedProperty.rooms} amb.</span>}
                {selectedProperty.bedrooms > 0 && <span>{selectedProperty.bedrooms} dorm.</span>}
                {selectedProperty.bathrooms > 0 && <span>{selectedProperty.bathrooms} baños</span>}
                {(selectedProperty.total_built_surface || selectedProperty.covered_surface) && (
                  <span>{formatSurface(selectedProperty.total_built_surface || selectedProperty.covered_surface)}</span>
                )}
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
    </div>
  )
}