// components/google-autocomplete.tsx
// RUTA: components/google-autocomplete.tsx
"use client"

import { useState, useCallback, useRef } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { convertGoogleBounds, type LocationData } from "@/lib/location-utils"

interface GoogleAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  placeholder?: string
  icon?: "map" | "search"
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export default function GoogleAutocomplete({ 
  onPlaceSelect, 
  placeholder = "Buscar ubicación...", 
  icon = "search",
  className = "",
  value,
  onChange
}: GoogleAutocompleteProps) {
  const { isLoaded } = useGoogleMaps()
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [searchValue, setSearchValue] = useState(value || "")
  const inputRef = useRef<HTMLInputElement>(null)

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance)
  }, [])

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const newValue = place.formatted_address || place.name || ""
        setSearchValue(newValue)
        onChange?.(newValue)
        onPlaceSelect?.(place)
      }
    }
  }, [autocomplete, onPlaceSelect, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        {icon === "map" ? (
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        ) : (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          className={`pl-10 pr-4 ${className}`}
          disabled
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "ar" }, // Restringir a Argentina
          fields: [
            "formatted_address", 
            "geometry", 
            "name", 
            "place_id", 
            "address_components",
            "types" // Para identificar tipo de lugar
          ],
          types: ["geocode", "establishment"],
        }}
      >
        <div className="relative">
          {icon === "map" ? (
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          )}
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            className={`pl-10 pr-4 ${className}`}
          />
        </div>
      </Autocomplete>
    </div>
  )
}

// Versión específica que extrae bounds automáticamente
export function SearchAutocomplete({ 
  onLocationSelect, 
  placeholder = "Buscar por ubicación, barrio o código",
  className = ""
}: {
  onLocationSelect?: (location: LocationData) => void
  placeholder?: string
  className?: string
}) {
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const locationData: LocationData = {
        address: place.formatted_address || place.name || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id,
        types: place.types || []
      }

      // Capturar bounds si están disponibles (para barrios, ciudades, etc.)
      if (place.geometry.viewport) {
        locationData.bounds = convertGoogleBounds(place.geometry.viewport)
        console.log("🗺️ Bounds capturados para", locationData.address, locationData.bounds)
      } else {
        console.log("📍 Sin bounds - usando punto específico:", locationData.address)
      }

      onLocationSelect?.(locationData)
    }
  }

  return (
    <GoogleAutocomplete
      onPlaceSelect={handlePlaceSelect}
      placeholder={placeholder}
      icon="search"
      className={className}
    />
  )
}