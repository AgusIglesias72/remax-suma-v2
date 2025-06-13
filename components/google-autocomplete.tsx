// components/google-autocomplete.tsx
"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
  const [searchValue, setSearchValue] = useState(value || "")
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)

  // Inicializar servicios cuando Google Maps esté cargado
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
      // Crear un div temporal para el PlacesService
      const tempDiv = document.createElement('div')
      placesService.current = new google.maps.places.PlacesService(tempDiv)
    }
  }, [isLoaded])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)

    if (newValue.length > 2 && autocompleteService.current) {
      setIsLoading(true)
      try {
        const request = {
          input: newValue,
          componentRestrictions: { country: "ar" },
          types: ["geocode", "establishment"],
        }

        autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
          setIsLoading(false)
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 5)) // Limitar a 5 resultados
            setShowPredictions(true)
          } else {
            setPredictions([])
            setShowPredictions(false)
          }
        })
      } catch (error) {
        console.error('Error en autocomplete:', error)
        setIsLoading(false)
        setPredictions([])
      }
    } else {
      setPredictions([])
      setShowPredictions(false)
    }
  }

  const handlePredictionClick = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return

    setSearchValue(prediction.description)
    setShowPredictions(false)
    onChange?.(prediction.description)

    // Obtener detalles del lugar
    const request = {
      placeId: prediction.place_id,
      fields: [
        'formatted_address',
        'geometry',
        'name',
        'place_id',
        'address_components',
        'types'
      ]
    }

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        onPlaceSelect?.(place)
      }
    })
  }

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true)
    }
  }

  const handleInputBlur = () => {
    // Pequeño delay para permitir clicks en las predicciones
    setTimeout(() => {
      setShowPredictions(false)
    }, 200)
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
      {icon === "map" ? (
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
      )}
      
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={`pl-10 pr-4 ${className}`}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handlePredictionClick(prediction)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={16} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
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
      icon="map"
      className={className}
    />
  )
}