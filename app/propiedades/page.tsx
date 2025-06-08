// app/propiedades/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Filter, Grid3X3, MapIcon, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import PropertyCard from "@/components/property-card"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import { SearchAutocomplete } from "@/components/google-autocomplete"
import { allProperties } from "@/lib/data"
import { usePropertyFilters } from "@/hooks/use-property-filters"
import { useUrlFilters } from "@/hooks/use-url-filters"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

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
    }).format(price)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header con búsqueda */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <SearchAutocomplete
                  onLocationSelect={handleLocationSelect}
                  placeholder="Buscar por ubicación, barrio o código"
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter size={18} />
                  {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                </Button>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <Grid3X3 size={18} />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("map")}
                    className={viewMode === "map" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <MapIcon size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtros aplicados */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.location && (
                  <Badge variant="secondary" className="gap-1">
                    📍 {filters.location.address}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 ml-1"
                      onClick={clearLocation}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )}
                {filters.operationType && (
                  <Badge variant="secondary" className="gap-1">
                    🏷️ {filters.operationType}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 ml-1"
                      onClick={() => setOperationType(undefined)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )}
                {filters.propertyType && (
                  <Badge variant="secondary" className="gap-1">
                    🏠 {filters.propertyType}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 ml-1"
                      onClick={() => setPropertyType(undefined)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )}
                {filters.priceRange && (
                  <Badge variant="secondary" className="gap-1">
                    💰 {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 ml-1"
                      onClick={() => setPriceRange(undefined)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )}
                {filters.rooms && (
                  <Badge variant="secondary" className="gap-1">
                    🏠 {filters.rooms} ambientes
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 ml-1"
                      onClick={() => setRooms(undefined)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpiar todos
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            {/* Panel de Filtros */}
            {showFilters && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Filtros de búsqueda</h3>
                  
                  <div className="space-y-6">
                    {/* Operación */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Operación</h4>
                      <Select value={filters.operationType || "todas"} onValueChange={(value) => setOperationType(value === "todas" ? undefined : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de operación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Cualquier operación</SelectItem>
                          <SelectItem value="venta">Venta</SelectItem>
                          <SelectItem value="alquiler">Alquiler</SelectItem>
                          <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipo de propiedad */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Tipo de propiedad</h4>
                      <Select value={filters.propertyType || "todos"} onValueChange={(value) => setPropertyType(value === "todos" ? undefined : value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de propiedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Cualquier tipo</SelectItem>
                          <SelectItem value="departamento-estandar">Departamento Estándar</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="departamento-duplex">Departamento Dúplex</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="terrenos-lotes">Terrenos y Lotes</SelectItem>
                          <SelectItem value="departamento-monoambiente">Departamento Monoambiente</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Precio */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Rango de precio</h4>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Mínimo"
                            value={localPriceRange[0]}
                            onChange={(e) => {
                              const newMin = Number(e.target.value)
                              const newRange: [number, number] = [newMin, localPriceRange[1]]
                              setLocalPriceRange(newRange)
                              setPriceRange(newRange)
                            }}
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Máximo"
                            value={localPriceRange[1]}
                            onChange={(e) => {
                              const newMax = Number(e.target.value)
                              const newRange: [number, number] = [localPriceRange[0], newMax]
                              setLocalPriceRange(newRange)
                              setPriceRange(newRange)
                            }}
                            className="text-sm"
                          />
                        </div>
                        <div className="px-2">
                          <Slider
                            value={localPriceRange}
                            onValueChange={handlePriceRangeChange}
                            min={0}
                            max={2000000}
                            step={10000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatPrice(localPriceRange[0])}</span>
                            <span>{formatPrice(localPriceRange[1])}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ambientes */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Ambientes</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={!filters.rooms ? "default" : "outline"}
                          size="sm"
                          onClick={() => setRooms(undefined)}
                          className={!filters.rooms ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          Todos
                        </Button>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Button
                            key={num}
                            variant={filters.rooms === num ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRooms(num)}
                            className={filters.rooms === num ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Baños */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Baños</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={!filters.bathrooms ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBathrooms(undefined)}
                          className={!filters.bathrooms ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          Todos
                        </Button>
                        {[1, 2, 3, 4].map((num) => (
                          <Button
                            key={num}
                            variant={filters.bathrooms === num ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBathrooms(num)}
                            className={filters.bathrooms === num ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full mb-2"
                        onClick={clearFilters}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido principal */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {filters.location 
                    ? `Propiedades cerca de ${filters.location.address}`
                    : "Propiedades en Buenos Aires"
                  }
                </h1>
                <p className="text-gray-600">
                  Mostrando {stats.filtered} de {stats.total} propiedades
                  {stats.percentage < 100 && (
                    <span className="text-red-600"> ({stats.percentage}% del total)</span>
                  )}
                </p>
              </div>

              {viewMode === "map" ? (
                <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
                  <PropertyMapWrapper 
                    properties={filteredProperties} 
                    center={mapCenter || undefined}
                    zoom={mapZoom}
                    height="calc(100vh-200px)" 
                  />
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
                        <p>Intenta ajustar los filtros para obtener más resultados</p>
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