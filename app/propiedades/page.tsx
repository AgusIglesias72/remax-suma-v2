// app/propiedades/page.tsx
// RUTA: app/propiedades/page.tsx
"use client"

import { useState } from "react"
import { Filter, Grid3X3, MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import PropertyCard from "@/components/property-card"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import { SearchAutocomplete } from "@/components/google-autocomplete"
import { allProperties } from "@/lib/data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [searchLocation, setSearchLocation] = useState("")
  const [filteredProperties, setFilteredProperties] = useState(allProperties)

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setSearchLocation(location.address)
    console.log("Ubicación seleccionada:", location)
    // Aquí podrías implementar filtrado por proximidad a la ubicación
  }

  const handleSearch = () => {
    // Implementar lógica de búsqueda
    console.log("Buscando propiedades en:", searchLocation)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchAutocomplete
                onLocationSelect={handleLocationSelect}
                placeholder="Buscar por ubicación, barrio o código"
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter size={18} />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros de búsqueda</SheetTitle>
                    <SheetDescription>Ajusta los filtros para encontrar la propiedad ideal</SheetDescription>
                  </SheetHeader>

                  <div className="grid gap-6 py-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Operación</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Comprar
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Alquilar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Tipo de propiedad</h3>
                      <Select defaultValue="cualquier-tipo">
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de propiedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cualquier-tipo">Cualquier tipo</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="departamento">Departamento</SelectItem>
                          <SelectItem value="oficina">Oficina</SelectItem>
                          <SelectItem value="terreno">Terreno</SelectItem>
                          <SelectItem value="local">Local comercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Ubicación</h3>
                      <SearchAutocomplete
                        onLocationSelect={handleLocationSelect}
                        placeholder="Buscar ubicación específica"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Precio</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-3">Mínimo: $50,000 - Máximo: $500,000</p>
                          <Slider defaultValue={[50000, 500000]} min={0} max={1000000} step={10000} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Ambientes</h3>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, "5+"].map((num) => (
                          <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Baños</h3>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, "4+"].map((num) => (
                          <Button key={num} variant="outline" size="sm" className="min-w-[40px]">
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Características</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Cochera", "Piscina", "Balcón", "Terraza", "Amoblado", "Seguridad"].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <input type="checkbox" id={feature} className="rounded border-gray-300" />
                            <label htmlFor={feature} className="text-sm">
                              {feature}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1">
                        Limpiar
                      </Button>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">Aplicar</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

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

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Propiedades en Buenos Aires</h1>
            <p className="text-gray-600">
              Mostrando {filteredProperties.length} propiedades
              {searchLocation && (
                <span className="text-red-600"> cerca de "{searchLocation}"</span>
              )}
            </p>
          </div>

          {viewMode === "map" ? (
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
              <PropertyMapWrapper properties={filteredProperties} height="calc(100vh-200px)" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}