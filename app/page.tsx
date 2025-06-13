// app/page.tsx - VERSIÓN CORREGIDA PARA RESOLVER EL ERROR DE SELECT
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, TrendingUp, Users, MapIcon, Home, Search, Store, Car, Building, Warehouse } from "lucide-react"
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
import EnhancedSearchBar from '@/components/enhanced-search-bar'

const operationImages = {
  comprar: 'https://www.obtengavisa.com.ar/img/compra_propiedad2.jpg', // Casa moderna para comprar
  alquilar: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center', // Apartamento moderno para alquilar
  explorar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center' // Vista urbana para explorar
};

// Primero, crea un objeto con las imágenes para cada ciudad
const cityImages = {
  'Vicente Lopez': 'https://resizer.glanacion.com/resizer/v2/el-cafe-paris-el-mas-antiguo-e-ilustre-del-barrio-56MNMZ4YHBA27PUZEXB2RIKCWU.jpg?auth=62dd999f866e434cebefbd09bacc54483827dfa8fc8903432e267a6af3b7a02f&width=1920&height=1280&quality=70&smart=true',
  'Colegiales': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Avenida_de_los_Incas_-_Corregidores_casa_esquina.jpg',
  'Palermo': 'https://res.cloudinary.com/hello-tickets/image/upload/c_limit,f_auto,q_auto,w_768/v1684538142/post_images/Argentina-170/Buenos-aires/Palermo/41481138315_c682bb9482_o_Cropped.jpg',
  'La Boca': 'https://buenosaires.gob.ar/sites/default/files/media/image/2018/08/23/0cb9ff5cc29168e9728208dfb7596bbd35f15ddc.jpg',
  'Villa Urquiza': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=600&fit=crop&crop=center',
  'Belgrano': 'https://resizer.glanacion.com/resizer/v2/la-zona-defiende-los-precios-mas-altos-de-la-KMDC3VUPRZAAHNRH4G5Y65D62E.JPG?auth=27d195247ca0b000b7fa34ef136a84af8bb3b113ecaab612162c36f74102ef1e&width=1280&height=854&quality=70&smart=true',
  'San Fernando': 'https://infocielo.com/wp-content/uploads/2024/12/20200705120635_14-costanera-municipaljpeg.jpeg'
};

const propertyTypeImages = {
  'Departamento Estándar': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=center',
  'Casa': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
  'Terrenos y Lotes': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center',
  'Departamento Dúplex': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center',
  'Local': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center',
  'Departamento Monoambiente': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center',
  'Cochera': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop&crop=center',
  'Oficina': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center',
  'Casa Dúplex': 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop&crop=center',
  'Depósito': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center'
};

// También define iconos específicos para cada tipo
const propertyTypeIcons = {
  'Departamento Estándar': Home,
  'Casa': Home,
  'Terrenos y Lotes': MapIcon,
  'Departamento Dúplex': Building,
  'Local': Store,
  'Departamento Monoambiente': Home,
  'Cochera': Car,
  'Oficina': Building,
  'Casa Dúplex': Building,
  'Depósito': Warehouse
};

// Componente de Select seguro para hidratación
function SafeSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className = "",
  defaultValue = ""
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
  defaultValue?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Renderizar una versión estática durante SSR
    return (
      <div className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ${className}`}>
        <span className="text-muted-foreground">{placeholder}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 opacity-50"
        >
          <path
            d="m4.5 6 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
}

export default function HomePage() {
  const router = useRouter()

  // Inicializar estados con valores por defecto idénticos en server y client
  const [operationType, setOperationType] = useState("venta")
  const [propertyType, setPropertyType] = useState("cualquier-tipo")
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location)
  }

  const handleSearch = () => {
    if (!mounted) return

    const params = new URLSearchParams()

    if (operationType && operationType !== "venta") {
      params.set("operacion", operationType)
    }
    if (propertyType && propertyType !== "cualquier-tipo") {
      params.set("tipo", propertyType.replace(" ", "-").toLowerCase())
    }

    if (selectedLocation) {
      params.set("ubicacion", selectedLocation.address)
      params.set("lat", selectedLocation.lat.toString())
      params.set("lng", selectedLocation.lng.toString())
      params.set("radio", "10")
    }

    const queryString = params.toString()
    router.push(`/propiedades${queryString ? `?${queryString}` : ''}`)
  }

  const handleCitySearch = (city: string) => {
    if (!mounted) return
    const params = new URLSearchParams()
    params.set("ciudad", city.toLowerCase().replace(" ", "-"))
    router.push(`/propiedades?${params.toString()}`)
  }

  const handlePropertyTypeSearch = (type: string) => {
    if (!mounted) return
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
    if (!mounted) return
    const params = new URLSearchParams()
    params.set("operacion", operation.toLowerCase())
    router.push(`/propiedades?${params.toString()}`)
  }

  const handleQuickSearch = () => {
    if (!mounted) return
    router.push('/propiedades')
  }

  const handleEnhancedSearch = (data: {
    operation: string;
    propertyType: string;
    rooms: string;
    selectedLocation: { address: string; lat: number; lng: number } | null;
    priceRange: string;
  }) => {
    if (!mounted) return;
  
    console.log('Búsqueda avanzada:', data);
  
    const params = new URLSearchParams();
  
    // Mapear operación
    if (data.operation) {
      params.set("operacion", data.operation);
    }
  
    // Mapear tipo de propiedad (mantener tu lógica existente)
    if (data.propertyType) {
      params.set("tipo", data.propertyType);
    }
  
    // Mapear ambientes
    if (data.rooms) {
      params.set("ambientes", data.rooms);
    }
  
    // Mapear ubicación (usar tu lógica existente de selectedLocation)
    if (data.selectedLocation) {
      params.set("ubicacion", data.selectedLocation.address.toLowerCase().replace(" ", "-"));
      params.set("lat", data.selectedLocation.lat.toString());
      params.set("lng", data.selectedLocation.lng.toString());
    }
  
    // Mapear rango de precio
    if (data.priceRange) {
      params.set("precio", data.priceRange);
    }
  
    // Navegar a propiedades con los filtros
    router.push(`/propiedades?${params.toString()}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section Mejorado */}
        <section 
          className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://d1acdg20u0pmxj.cloudfront.net/ar/assets/media/webp/home/bg-herobanner.webp")'
          }}
        >
          {/* Overlay mejorado */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          
          {/* Contenido */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
            {/* Título y subtítulo */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                Encuentra tu lugar ideal en Buenos Aires
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
                Las mejores propiedades en venta y alquiler con los agentes más calificados
              </p>
            </div>

            {/* Buscador mejorado */}
            <EnhancedSearchBar 
              onSearch={handleEnhancedSearch}
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
              mounted={mounted}
            />
          </div>
        </section>


{/* Stats Section */}
<section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
  {/* Background decorativo */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-3xl"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        RE/MAX SUMA en números
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Somos líderes en el mercado inmobiliario con una amplia presencia en Buenos Aires
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Propiedades Activas */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <Home className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {stats.active_properties}
              </div>
              <div className="text-sm text-gray-500">de {stats.total_properties} totales</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Propiedades Activas</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-1000"
              style={{width: `${(stats.active_properties / stats.total_properties) * 100}%`}}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Math.round((stats.active_properties / stats.total_properties) * 100)}% disponibles
          </p>
        </div>
      </div>

      {/* Agentes */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {stats.total_agents}
              </div>
              <div className="text-sm text-gray-500">profesionales</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Agentes Expertos</h3>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
              ))}
            </div>
            <span className="text-sm text-gray-600">+{stats.total_agents - 4} más</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Especializados en la zona norte
          </p>
        </div>
      </div>

      {/* Ciudades */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <MapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {stats.total_cities}
              </div>
              <div className="text-sm text-gray-500">ubicaciones</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ciudades Cubiertas</h3>
          <div className="grid grid-cols-3 gap-1">
            {['CABA', 'V.López', 'Olivos', 'S.Isidro', 'Martinez', 'Tigre'].map((city, i) => (
              <div key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded text-center">
                {city}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Zona Norte y CABA
          </p>
        </div>
      </div>

      {/* Precio Promedio */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-100 rounded-full p-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {formatPrice(stats.average_price, "USD")}
              </div>
              <div className="text-sm text-gray-500">promedio</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Precio Promedio</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mínimo:</span>
              <span className="font-medium">{formatPrice(stats.price_range.min, "USD")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Máximo:</span>
              <span className="font-medium">{formatPrice(stats.price_range.max, "USD")}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>Mercado estable</span>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
      <div className="inline-flex items-center gap-2 bg-white rounded-full px-8 py-4 shadow-lg">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-gray-700 font-medium">Datos actualizados en tiempo real</span>
      </div>
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
              <button
                onClick={() => handleOperationTypeSearch("venta")}
                className="group relative h-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                disabled={!mounted}
              >
                {/* Imagen optimizada */}
                <Image
                  src={operationImages.comprar}
                  alt="Comprar propiedades"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay con gradiente y color RE/MAX */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/70 via-red-500/50 to-red-400/30 group-hover:from-red-700/80 group-hover:via-red-600/60 group-hover:to-red-500/40 transition-all duration-300" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white z-10">
                  <Home size={32} className="drop-shadow-lg" />
                  <span className="text-lg font-semibold drop-shadow-lg">Comprar</span>
                  <span className="text-sm opacity-90 drop-shadow-lg">
                    {Object.values(stats.operation_types).reduce((a, b) => a + b, 0)} propiedades
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleOperationTypeSearch("alquiler")}
                className="group relative h-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                disabled={!mounted}
              >
                {/* Imagen optimizada */}
                <Image
                  src={operationImages.alquilar}
                  alt="Alquilar propiedades"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay con gradiente azul */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 via-blue-500/50 to-blue-400/30 group-hover:from-blue-700/80 group-hover:via-blue-600/60 group-hover:to-blue-500/40 transition-all duration-300" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white z-10">
                  <MapIcon size={32} className="drop-shadow-lg" />
                  <span className="text-lg font-semibold drop-shadow-lg">Alquilar</span>
                  <span className="text-sm opacity-90 drop-shadow-lg">Opciones disponibles</span>
                </div>
              </button>

              <button
                onClick={handleQuickSearch}
                className="group relative h-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                disabled={!mounted}
              >
                {/* Imagen optimizada */}
                <Image
                  src={operationImages.explorar}
                  alt="Explorar propiedades"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay con gradiente gris */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-600/70 via-gray-500/50 to-gray-400/30 group-hover:from-gray-700/80 group-hover:via-gray-600/60 group-hover:to-gray-500/40 transition-all duration-300" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white z-10">
                  <Search size={32} className="drop-shadow-lg" />
                  <span className="text-lg font-semibold drop-shadow-lg">Explorar</span>
                  <span className="text-sm opacity-90 drop-shadow-lg">Ver todas las opciones</span>
                </div>
              </button>
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
                  className="group relative h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  disabled={!mounted}
                >
                  {/* Imagen optimizada con Next.js */}
                  <Image
                    src={cityImages[city as keyof typeof cityImages] || cityImages['Vicente Lopez']}
                    alt={`Vista de ${city}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay para mejorar la legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 group-hover:via-black/40 transition-all duration-300" />

                  {/* Contenido del texto */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white z-10">
                      <h3 className="font-bold text-sm mb-1 drop-shadow-lg">{city}</h3>
                      <p className="text-xs opacity-90 drop-shadow-lg">Ver propiedades</p>
                    </div>
                  </div>

                  {/* Efecto hover con el color de RE/MAX */}
                  <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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
                .map(([type, count]) => {
                  const IconComponent = propertyTypeIcons[type as keyof typeof propertyTypeIcons] || Home;
                  return (
                    <button
                      key={type}
                      onClick={() => handlePropertyTypeSearch(type)}
                      className="group relative h-40 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                      disabled={!mounted}
                    >
                      {/* Imagen optimizada */}
                      <Image
                        src={propertyTypeImages[type as keyof typeof propertyTypeImages] || propertyTypeImages['Casa']}
                        alt={`${type} - RE/MAX SUMA`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      

                      {/* Overlay con gradiente mejorado */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-red-900/60 group-hover:via-red-600/30 group-hover:to-transparent transition-all duration-300" />

                      {/* Contenido */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white z-10 p-4">
                        {/* Icono con fondo glassmorphism */}
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-red-600/80 group-hover:border-red-400/30 transition-all duration-300">
                          <IconComponent size={24} className="text-white drop-shadow-lg" />
                        </div>

                        {/* Título */}
                        <h3 className="font-semibold text-center text-sm leading-tight drop-shadow-lg">
                          {type}
                        </h3>

                        {/* Contador con badge */}
                        <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          <p className="text-xs font-medium drop-shadow-lg">
                            {count} propiedades
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}