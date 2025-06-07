// app/buscar-ubicacion/page.tsx
// RUTA: app/buscar-ubicacion/page.tsx

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import { SearchAutocomplete } from "@/components/google-autocomplete"
import { usePropertyFilters } from "@/hooks/use-property-filters"
import { SEARCH_RADIUS_OPTIONS, type LocationData } from "@/lib/location-utils"
import { allProperties } from "@/lib/data"

export default function SearchLocationPage() {
  const [selectedRadius, setSelectedRadius] = useState<number>(10)
  
  const {
    filters,
    filteredProperties,
    mapCenter,
    mapZoom,
    stats,
    setLocation,
    setRadius,
    clearLocation
  } = usePropertyFilters({ 
    properties: allProperties,
    initialFilters: { radius: selectedRadius }
  })

  const handleLocationSelect = (location: LocationData) => {
    setLocation(location)
    setRadius(selectedRadius)
  }

  const handleRadiusChange = (newRadius: number) => {
    setSelectedRadius(newRadius)
    setRadius(newRadius)
  }

  const handleViewResults = () => {
    if (filters.location) {
      const params = new URLSearchParams()
      params.set("ubicacion", filters.location.address)
      params.set("lat", filters.location.lat.toString())
      params.set("lng", filters.location.lng.toString())
      params.set("radio", (filters.radius || 10).toString())
      
      window.location.href = `/propiedades?${params.toString()}`
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/propiedades" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6">
            <ArrowLeft size={16} className="mr-2" /> Volver a propiedades
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <Select 
                      value={selectedRadius.toString()} 
                      onValueChange={(value) => handleRadiusChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar radio" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEARCH_RADIUS_OPTIONS.map((option: { value: Key | null | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                          <SelectItem 
                            key={option.value} 
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {filters.location && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Ubicación seleccionada:
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        {filters.location.address}
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

              {filters.location && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {stats.filtered}
                        </p>
                        <p className="text-sm text-gray-500">
                          propiedades encontradas
                        </p>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>En un radio de {filters.radius} km</p>
                        <p>de {stats.total} propiedades totales</p>
                      </div>

                      {stats.hasResults && (
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={handleViewResults}
                        >
                          Ver todas las propiedades
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de Propiedades</CardTitle>
                  <CardDescription>
                    {filters.location
                      ? `Mostrando ${stats.filtered} propiedades cerca de ${filters.location.address}`
                      : "Busca una ubicación para ver propiedades cercanas"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyMapWrapper
                    properties={filteredProperties}
                    center={mapCenter || undefined}
                    zoom={mapZoom}
                    height="500px"
                  />
                </CardContent>
              </Card>
              
              {!filters.location && (
                <div className="mt-6 text-center">
                  <p className="text-gray-500 mb-4">
                    👆 Usa el buscador arriba para encontrar propiedades cerca de cualquier ubicación
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {["Palermo", "Recoleta", "Puerto Madero", "Belgrano", "San Telmo", "Colegiales"].map((area) => (
                      <Button
                        key={area}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Simular selección rápida de área conocida
                          const coords = getAreaCoordinates(area)
                          if (coords) {
                            handleLocationSelect(coords)
                          }
                        }}
                      >
                        {area}
                      </Button>
                    ))}
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

// Función helper para coordenadas de áreas conocidas
function getAreaCoordinates(area: string): LocationData | null {
  const areaMap: Record<string, LocationData> = {
    "Palermo": {
      address: "Palermo, Buenos Aires",
      lat: -34.5889,
      lng: -58.4298
    },
    "Recoleta": {
      address: "Recoleta, Buenos Aires",
      lat: -34.5875,
      lng: -58.3974
    },
    "Puerto Madero": {
      address: "Puerto Madero, Buenos Aires",
      lat: -34.6084,
      lng: -58.3640
    },
    "Belgrano": {
      address: "Belgrano, Buenos Aires",
      lat: -34.5633,
      lng: -58.4578
    },
    "San Telmo": {
      address: "San Telmo, Buenos Aires",
      lat: -34.6142,
      lng: -58.3776
    },
    "Colegiales": {
      address: "Colegiales, Buenos Aires",
      lat: -34.5624,
      lng: -58.4512
    }
  }
  
  return areaMap[area] || null
}