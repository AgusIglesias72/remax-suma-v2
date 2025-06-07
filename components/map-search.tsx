"use client"

import { useState, useCallback } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
//import type { google } from "googlemaps"

interface MapSearchProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  placeholder?: string
}

export default function MapSearch({ onPlaceSelect, placeholder = "Buscar ubicación..." }: MapSearchProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [searchValue, setSearchValue] = useState("")

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance)
  }, [])

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        onPlaceSelect?.(place)
        setSearchValue(place.formatted_address || place.name || "")
      }
    }
  }, [autocomplete, onPlaceSelect])

  return (
    <div className="relative">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "ar" }, // Restringir a Argentina
          fields: ["formatted_address", "geometry", "name", "place_id"],
          types: ["geocode", "establishment"],
        }}
      >
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </Autocomplete>
    </div>
  )
}
