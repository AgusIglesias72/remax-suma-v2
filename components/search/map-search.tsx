// components/map-search.tsx
// RUTA: components/map-search.tsx
"use client"

import GoogleAutocomplete from "@/components/search/google-autocomplete"
import type { LocationData } from "@/lib/location-utils"

interface MapSearchProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  onLocationSelect?: (location: LocationData) => void
  placeholder?: string
}

export default function MapSearch({ 
  onPlaceSelect, 
  onLocationSelect,
  placeholder = "Buscar ubicación..." 
}: MapSearchProps) {
  
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    // Llamar al callback original si existe
    onPlaceSelect?.(place)
    
    // También convertir a LocationData si se necesita
    if (onLocationSelect && place.geometry?.location) {
      const locationData: LocationData = {
        address: place.formatted_address || place.name || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id
      }
      onLocationSelect(locationData)
    }
  }

  return (
    <GoogleAutocomplete
      onPlaceSelect={handlePlaceSelect}
      placeholder={placeholder}
      icon="map"
    />
  )
}