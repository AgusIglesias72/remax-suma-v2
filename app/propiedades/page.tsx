// app/propiedades/page.tsx - VERSIÓN MEJORADA
"use client"

import { useState, useEffect } from "react"
import { Filter, Grid3X3, MapIcon, Search, X, Home, Bed, Bath, Car, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import PropertyCard from "@/components/properties/property-card"
import PropertyMapWrapper from "@/components/properties/property-map-wrapper"
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider" 
import { SearchAutocomplete } from "@/components/search/google-autocomplete"
import { allProperties } from "@/lib/data"
import { usePropertyFilters } from "@/hooks/use-property-filters"
import { useUrlFilters } from "@/hooks/use-url-filters"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [showFilters, setShowFilters] = useState(true)
  
  // Obtener filtros iniciales desde URL
  const urlFilters = useUrlFilters()
  
  // Hook para manejar filtros
  const {
    filters,
    filteredProperties,
    mapCenter,
    mapZoom,
    stats,
    setLocation,
    setOperationType,
    setPropertyType,
    setPriceRange,
    setRooms,
    setBathrooms,
    clearFilters,
    clearLocation,
    hasActiveFilters
  } = usePropertyFilters({ 
    properties: allProperties,
    initialFilters: urlFilters
  })

  // Estado local para controles de UI
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([50000, 1000000])
  
  useEffect(() => {
    // Sincronizar range local con filtros cuando cambien
    if (filters.priceRange) {
      setLocalPriceRange(filters.priceRange)
    }
  }, [filters.priceRange])

  const handlePriceRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]]
    setLocalPriceRange(newRange)
    setPriceRange(newRange)
  }

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setLocation({
      address: location.address,
      lat: location.lat,
      lng: location.lng
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('US$', '$')
  }

  // Función para obtener el texto del filtro de ubicación
  const getLocationFilterText = () => {
    if (!filters.location) return null;
    
    const address = filters.location.address;
    // Extraer la parte más relevante de la dirección
    const parts = address.split(',');
    if (parts.length > 1) {
      // Si es "Palermo, Buenos Aires" -> "Palermo"
      // Si es "Av. Santa Fe 1234, Palermo, Buenos Aires" -> "Santa Fe, Palermo"
      if (parts.length >= 3) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
      } else {
        return parts[0].trim();
      }
    }
    return address;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Panel de Filtros Mejorado */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Ubicación específica */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <MapPin size={16} />
                        Ubicación específica
                      </h4>
                      <SearchAutocomplete
                        onLocationSelect={handleLocationSelect}
                        placeholder="Buscar dirección específica"
                        className="w-full"
                      />
                      {filters.location && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <MapPin size={14} />
                              <span className="font-medium">Ubicación seleccionada:</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearLocation}
                              className="text-blue-600 hover:text-blue-700 h-auto p-1"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                          <p className="text-sm text-blue-700 mt-1 font-medium">
                            {getLocationFilterText()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tipo de Operación */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <DollarSign size={16} />
                        Tipo de operación
                      </h4>
                      <Select 
                        value={filters.operationType || "todas"} 
                        onValueChange={(value) => setOperationType(value === "todas" ? undefined : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de operación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas las operaciones</SelectItem>
                          <SelectItem value="venta">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              Venta
                            </div>
                          </SelectItem>
                          <SelectItem value="alquiler">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              Alquiler
                            </div>
                          </SelectItem>
                          <SelectItem value="alquiler-temporal">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              Alquiler Temporal
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipo de propiedad */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Home size={16} />
                        Tipo de propiedad
                      </h4>
                      <Select 
                        value={filters.propertyType || "todos"} 
                        onValueChange={(value) => setPropertyType(value === "todos" ? undefined : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de propiedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los tipos</SelectItem>
                          <SelectItem value="departamento-estandar">Departamento Estándar</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="departamento-duplex">Departamento Dúplex</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="terrenos-lotes">Terrenos y Lotes</SelectItem>
                          <SelectItem value="departamento-monoambiente">Departamento Monoambiente</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                          <SelectItem value="cochera">Cochera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ambientes */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Bed size={16} />
                        Cantidad de ambientes
                      </h4>
                      <Select 
                        value={filters.rooms?.toString() || "todos"} 
                        onValueChange={(value) => setRooms(value === "todos" ? undefined : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ambientes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Cualquier cantidad</SelectItem>
                          <SelectItem value="monoambiente">Monoambiente</SelectItem>
                          <SelectItem value="1">1 ambiente</SelectItem>
                          <SelectItem value="2">2 ambientes</SelectItem>
                          <SelectItem value="3">3 ambientes</SelectItem>
                          <SelectItem value="4">4 ambientes</SelectItem>
                          <SelectItem value="5+">5+ ambientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Baños */}
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Bath size={16} />
                        Cantidad de baños
                      </h4>
                      <Select 
                        value={filters.bathrooms?.toString() || "todos"} 
                        onValueChange={(value) => setBathrooms(value === "todos" ? undefined : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Baños" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Cualquier cantidad</SelectItem>
                          <SelectItem value="1">1 baño</SelectItem>
                          <SelectItem value="2">2 baños</SelectItem>
                          <SelectItem value="3">3 baños</SelectItem>
                          <SelectItem value="4+">4+ baños</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Precio */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Rango de precio</h4>
                      <div className="space-y-4">
                        <Slider
                          value={localPriceRange}
                          onValueChange={handlePriceRangeChange}
                          max={2000000}
                          min={10000}
                          step={10000}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{formatPrice(localPriceRange[0])}</span>
                          <span>{formatPrice(localPriceRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="pt-4 border-t">
                      {hasActiveFilters && (
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="w-full mb-3"
                        >
                          Limpiar todos los filtros
                        </Button>
                      )}
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {stats.filtered} de {stats.total} propiedades
                        </p>
                        {stats.percentage < 100 && (
                          <p className="text-xs text-red-600">
                            ({stats.percentage}% del total)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1">
              {/* Header con controles */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filters.location 
                      ? `Propiedades en ${getLocationFilterText()}`
                      : "Propiedades en Buenos Aires"
                    }
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Mostrando {stats.filtered} de {stats.total} propiedades
                    {filters.operationType && (
                      <span className="ml-2">
                        • {filters.operationType === 'venta' ? 'En Venta' : 'En Alquiler'}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden"
                  >
                    <Filter size={16} />
                    Filtros
                  </Button>
                  
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "ghost" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
                    >
                      <Grid3X3 size={16} />
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "ghost" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                      className={viewMode === "map" ? "bg-white shadow-sm" : ""}
                    >
                      <MapIcon size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filtros activos */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.location && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin size={12} />
                      {getLocationFilterText()}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLocation}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.operationType && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        filters.operationType === 'venta' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      {filters.operationType === 'venta' ? 'Venta' : 'Alquiler'}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOperationType(undefined)}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.propertyType && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Home size={12} />
                      {filters.propertyType.replace('-', ' ')}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPropertyType(undefined)}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  )}
                  
                  {filters.rooms && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bed size={12} />
                      {filters.rooms} {Number(filters.rooms) === 1 ? 'ambiente' : 'ambientes'}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRooms(undefined)}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Contenido (Grid o Mapa) */}
              {viewMode === "map" ? (
                <div className="h-[calc(100vh-100px)] rounded-lg overflow-hidden border border-gray-200">
                 <GoogleMapsProvider>
                <PropertyMapWrapper 
                  properties={filteredProperties} 
                  center={mapCenter || undefined}
                  zoom={mapZoom}
                  height="100%" // Pasamos 100% porque el div padre ya tiene la altura calculada
                />
              </GoogleMapsProvider>
                </div>
              ) : (
                <div>
                  {stats.hasResults ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <Search size={48} className="mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No se encontraron propiedades</h3>
                        <p className="text-gray-600 mb-4">
                          {filters.location 
                            ? `No hay propiedades disponibles en ${getLocationFilterText()} con los filtros seleccionados.`
                            : "Intenta ajustar los filtros para obtener más resultados."
                          }
                        </p>
                      </div>
                      <Button onClick={clearFilters} className="bg-red-600 hover:bg-red-700">
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
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