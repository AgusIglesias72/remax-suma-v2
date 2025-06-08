// app/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, TrendingUp, Users, MapIcon, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PropertyCard from "@/components/property-card"
import { SearchAutocomplete } from "@/components/google-autocomplete"
import { type LocationData } from "@/lib/location-utils"
import { featuredProperties, stats } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
  const router = useRouter()
  const [operationType, setOperationType] = useState("venta")
  const [propertyType, setPropertyType] = useState("cualquier-tipo")
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Agregar filtros básicos si no son los valores por defecto
    if (operationType && operationType !== "venta") {
      params.set("operacion", operationType)
    }
    if (propertyType && propertyType !== "cualquier-tipo") {
      params.set("tipo", propertyType.replace(" ", "-").toLowerCase())
    }
    
    // Agregar información de ubicación si está disponible
    if (selectedLocation) {
      params.set("ubicacion", selectedLocation.address)
      params.set("lat", selectedLocation.lat.toString())
      params.set("lng", selectedLocation.lng.toString())
      // Radio por defecto para búsquedas desde home
      params.set("radio", "10")
    }
    
    // Redirigir a la página de propiedades con los parámetros
    const queryString = params.toString()
    router.push(`/propiedades${queryString ? `?${queryString}` : ''}`)
  }

  const handleCitySearch = (city: string) => {
    const params = new URLSearchParams()
    params.set("ciudad", city.toLowerCase().replace(" ", "-"))
    router.push(`/propiedades?${params.toString()}`)
  }

  const handlePropertyTypeSearch = (type: string) => {
    const params = new URLSearchParams()
    const formattedType = type.toLowerCase()
      .replace("departamento estándar", "departamento-estandar")
      .replace("departamento dúplex", "departamento-duplex") 
      .replace("terrenos y lotes", "terrenos-lotes")
      .replace("departamento monoambiente", "departamento-monoambiente")
      .replace(" ", "-")
    params.set("tipo", formattedType)
    router.push(`/propiedades?${params.toString()}`)
  }

  const handleOperationTypeSearch = (operation: string) => {
    const params = new URLSearchParams()
    params.set("operacion", operation.toLowerCase())
    router.push(`/propiedades?${params.toString()}`)
  }

  const handleQuickSearch = () => {
    // Búsqueda rápida sin filtros específicos
    router.push('/propiedades')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://d1acdg20u0pmxj.cloudfront.net/ar/assets/media/webp/home/bg-herobanner.webp"
              alt="Propiedades en Buenos Aires"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Encuentra tu lugar ideal en Buenos Aires
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Las mejores propiedades en venta y alquiler con los agentes más calificados
            </p>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Operación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cualquier-tipo">Cualquier tipo</SelectItem>
                    <SelectItem value="departamento-estandar">Departamento Estándar</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento-duplex">Departamento Dúplex</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="terrenos-lotes">Terrenos y Lotes</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1">
                  <SearchAutocomplete
                    onLocationSelect={handleLocationSelect}
                    placeholder="Buscar por ubicación, barrio o código"
                    className="w-full"
                  />
                </div>

                <Button 
                  className="bg-red-600 hover:bg-red-700 w-full md:w-auto gap-2"
                  onClick={handleSearch}
                >
                  <Search size={18} />
                  Buscar
                </Button>
              </div>
              
              {/* Mostrar ubicación seleccionada */}
              {selectedLocation && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  <span>📍 Buscarás cerca de: <strong>{selectedLocation.address}</strong></span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="text-green-600 hover:text-green-700 h-auto p-1"
                  >
                    ✕
                  </Button>
                </div>
              )}

              {/* Búsquedas rápidas */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600 mr-2">Búsquedas populares:</span>
                <Button variant="link" size="sm" onClick={() => handleOperationTypeSearch("venta")} className="h-auto p-0 text-red-600">
                  Propiedades en venta
                </Button>
                <span className="text-gray-300">•</span>
                <Button variant="link" size="sm" onClick={() => handleCitySearch("Palermo")} className="h-auto p-0 text-red-600">
                  Palermo
                </Button>
                <span className="text-gray-300">•</span>
                <Button variant="link" size="sm" onClick={() => handlePropertyTypeSearch("Casa")} className="h-auto p-0 text-red-600">
                  Casas
                </Button>
                <span className="text-gray-300">•</span>
                <Button variant="link" size="sm" onClick={handleQuickSearch} className="h-auto p-0 text-red-600">
                  Ver todas
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
                  <Home className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active_properties}</div>
                  <p className="text-xs text-muted-foreground">de {stats.total_properties} totales</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agentes</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_agents}</div>
                  <p className="text-xs text-muted-foreground">profesionales</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
                  <MapIcon className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_cities}</div>
                  <p className="text-xs text-muted-foreground">ubicaciones</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.average_price, "USD")}</div>
                  <p className="text-xs text-muted-foreground">
                    Rango: {formatPrice(stats.price_range.min, "USD")} - {formatPrice(stats.price_range.max, "USD")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Propiedades Destacadas</h2>
              <Link href="/propiedades" className="text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                Ver todas <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Encuentra lo que buscas</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Button
                onClick={() => handleOperationTypeSearch("venta")}
                className="h-32 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Home size={32} />
                <span className="text-lg font-semibold">Comprar</span>
                <span className="text-sm opacity-90">{Object.values(stats.operation_types).reduce((a, b) => a + b, 0)} propiedades</span>
              </Button>
              
              <Button
                onClick={() => handleOperationTypeSearch("alquiler")}
                className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center justify-center gap-2 transition-all"
              >
                <MapIcon size={32} />
                <span className="text-lg font-semibold">Alquilar</span>
                <span className="text-sm opacity-90">Opciones disponibles</span>
              </Button>
              
              <Button
                onClick={handleQuickSearch}
                className="h-32 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Search size={32} />
                <span className="text-lg font-semibold">Explorar</span>
                <span className="text-sm opacity-90">Ver todas las opciones</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Top Cities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Ciudades Principales</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {stats.top_cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySearch(city)}
                  className="group relative h-32 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all cursor-pointer hover:shadow-lg transform hover:scale-105"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="font-bold text-sm mb-1">{city}</h3>
                      <p className="text-xs opacity-90">Ver propiedades</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Tipos de Propiedades</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(stats.property_types)
                .slice(0, 8)
                .map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => handlePropertyTypeSearch(type)}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all text-center group cursor-pointer border border-gray-100 hover:border-red-200"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <Home className="text-red-600" size={28} />
                    </div>
                    <h3 className="font-medium mb-2 group-hover:text-red-600 transition-colors">{type}</h3>
                    <p className="text-gray-600 text-sm">{count} propiedades</p>
                  </button>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}