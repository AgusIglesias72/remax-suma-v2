// app/buscar-ubicacion/page.tsx
"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import PropertyMapWrapper from "@/components/properties/property-map-wrapper"
import { SearchAutocomplete } from "@/components/search/google-autocomplete"
import { allProperties } from "@/lib/data"
import { MapErrorBoundary } from "@/components/error-boundary"

// Constantes para evitar recreaciones
const RADIUS_OPTIONS = [
  { value: "1", label: "1 km" },
  { value: "2", label: "2 km" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "15", label: "15 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" }
]

const AREA_COORDINATES = {
  "Palermo": { address: "Palermo, Buenos Aires", lat: -34.5889, lng: -58.4298 },
  "Recoleta": { address: "Recoleta, Buenos Aires", lat: -34.5875, lng: -58.3974 },
  "Puerto Madero": { address: "Puerto Madero, Buenos Aires", lat: -34.6084, lng: -58.3640 },
  "Belgrano": { address: "Belgrano, Buenos Aires", lat: -34.5633, lng: -58.4578 },
  "San Telmo": { address: "San Telmo, Buenos Aires", lat: -34.6142, lng: -58.3776 },
  "Colegiales": { address: "Colegiales, Buenos Aires", lat: -34.5624, lng: -58.4512 }
}

// Función pura para calcular distancia
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
           Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Función pura para filtrar propiedades
function getFilteredProperties(location: any, radius: number) {
  if (!location) return []
  
  return allProperties.filter(property => {
    const distance = calculateDistance(
      location.lat,
      location.lng,
      property.latitude,
      property.longitude
    )
    return distance <= radius
  })
}

export default function SearchLocationPage() {
  const [location, setLocation] = useState<any>(null)
  const [radius, setRadius] = useState("10")
  const [isSearching, setIsSearching] = useState(false)
  
  // Calcular propiedades filtradas de forma simple
  const filteredProperties = location ? getFilteredProperties(location, Number(radius)) : []
  const totalProperties = allProperties.length
  const foundProperties = filteredProperties.length
  const percentage = totalProperties > 0 ? Math.round((foundProperties / totalProperties) * 100) : 0

  const handleLocationSelect = async (selectedLocation: any) => {
    setIsSearching(true)
    setLocation(selectedLocation)
    
    // Simular búsqueda
    setTimeout(() => {
      setIsSearching(false)
    }, 800)
  }

  const handleRadiusChange = (newRadius: string) => {
    setRadius(newRadius)
  }

  const handleViewResults = () => {
    if (location) {
      const params = new URLSearchParams()
      params.set("ubicacion", location.address)
      params.set("lat", location.lat.toString())
      params.set("lng", location.lng.toString())
      params.set("radio", radius)
      
      window.location.href = `/propiedades?${params.toString()}`
    }
  }

  const handleQuickAreaSearch = (area: string) => {
    const coords = AREA_COORDINATES[area as keyof typeof AREA_COORDINATES]
    if (coords) {
      handleLocationSelect(coords)
    }
  }

  const clearLocation = () => {
    setLocation(null)
    setIsSearching(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/propiedades" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Volver a propiedades
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel lateral */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="text-red-600" size={20} />
                    Buscar por Ubicación
                  </CardTitle>
                  <CardDescription>
                    Encuentra propiedades cerca de una ubicación específica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ubicación
                    </label>
                    <SearchAutocomplete
                      onLocationSelect={handleLocationSelect}
                      placeholder="Buscar dirección, barrio o punto de interés..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Radio de búsqueda
                    </label>
                    <Select value={radius} onValueChange={handleRadiusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar radio" />
                      </SelectTrigger>
                      <SelectContent>
                        {RADIUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {location && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        📍 Ubicación seleccionada:
                      </p>
                      <p className="text-sm text-green-700 mb-3">
                        {location.address}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLocation}
                        className="text-green-700 hover:text-green-800 h-auto p-0"
                      >
                        Cambiar ubicación
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Búsquedas rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Búsquedas Rápidas</CardTitle>
                  <CardDescription>
                    Busca en áreas populares de Buenos Aires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(AREA_COORDINATES).map((area) => (
                      <Button
                        key={area}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAreaSearch(area)}
                        disabled={isSearching}
                        className="text-left justify-start"
                      >
                        {area}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resultados */}
              {(location || isSearching) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSearching ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Buscando propiedades cercanas...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold text-red-600">
                            {foundProperties}
                          </p>
                          <p className="text-sm text-gray-500">
                            propiedades encontradas
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>En un radio de {radius} km</p>
                          <p>de {totalProperties} propiedades totales</p>
                          {percentage < 100 && (
                            <p className="text-red-600">({percentage}% del total)</p>
                          )}
                        </div>

                        {foundProperties > 0 && (
                          <Button 
                            className="w-full bg-red-600 hover:bg-red-700 gap-2"
                            onClick={handleViewResults}
                          >
                            <Search size={16} />
                            Ver todas las propiedades
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mapa */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de Propiedades</CardTitle>
                  <CardDescription>
                    {location
                      ? `Mostrando ${foundProperties} propiedades cerca de ${location.address}`
                      : "Busca una ubicación para ver propiedades cercanas"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapErrorBoundary>
                    {isSearching ? (
                      <div className="h-[500px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <span className="text-sm text-gray-600">Cargando mapa...</span>
                        </div>
                      </div>
                    ) : (
                      <PropertyMapWrapper
                        properties={filteredProperties}
                        center={location ? { lat: location.lat, lng: location.lng } : undefined}
                        zoom={Number(radius) <= 5 ? 14 : Number(radius) <= 15 ? 12 : 11}
                        height="500px"
                      />
                    )}
                  </MapErrorBoundary>
                </CardContent>
              </Card>
              
              {!location && !isSearching && (
                <div className="mt-6">
                  <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Busca una ubicación</h3>
                    <p className="text-gray-600 mb-4">
                      Usa el buscador arriba para encontrar propiedades cerca de cualquier ubicación en Buenos Aires
                    </p>
                    <Button onClick={() => handleQuickAreaSearch("Palermo")} className="bg-red-600 hover:bg-red-700">
                      Buscar en Palermo
                    </Button>
                  </div>
                </div>
              )}

              {location && foundProperties === 0 && !isSearching && (
                <div className="mt-6">
                  <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades en esta área</h3>
                    <p className="text-gray-600 mb-4">
                      {`No encontramos propiedades en un radio de ${radius} km de ${location.address}. Intenta ampliar el radio de búsqueda.`}
                    </p>
                    <Button onClick={() => handleRadiusChange("25")} className="bg-red-600 hover:bg-red-700">
                      Ampliar búsqueda
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}