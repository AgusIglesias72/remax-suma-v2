import Link from "next/link"
import Image from "next/image"
import { Search, Home, ArrowRight, TrendingUp, Users, MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PropertyCard from "@/components/property-card"
import { featuredProperties, stats } from "@/lib/data"
import { formatPrice } from "@/lib/data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Encuentra tu lugar ideal en Buenos Aires</h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Las mejores propiedades en venta y alquiler con los agentes más calificados
            </p>

            <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <Select defaultValue="venta">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Operación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="cualquier-tipo">
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

                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Buscar por ubicación, barrio o código" className="pl-10 w-full" />
                </div>

                <Button className="bg-red-600 hover:bg-red-700 w-full md:w-auto">Buscar</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
                  <Home className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active_properties}</div>
                  <p className="text-xs text-muted-foreground">de {stats.total_properties} totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agentes</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_agents}</div>
                  <p className="text-xs text-muted-foreground">profesionales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
                  <MapIcon className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_cities}</div>
                  <p className="text-xs text-muted-foreground">ubicaciones</p>
                </CardContent>
              </Card>

              <Card>
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
              <Link href="/propiedades" className="text-red-600 hover:text-red-700 flex items-center gap-1">
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

        {/* Top Cities Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Ciudades Principales</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {stats.top_cities.map((city) => (
                <Link
                  href={`/propiedades?ciudad=${city.toLowerCase().replace(" ", "-")}`}
                  key={city}
                  className="group relative h-32 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="font-bold text-sm">{city}</h3>
                      <p className="text-xs opacity-90">Ver propiedades</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Tipos de Propiedades</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(stats.property_types)
                .slice(0, 8)
                .map(([type, count]) => (
                  <Link
                    href={`/propiedades?tipo=${type.toLowerCase().replace(" ", "-")}`}
                    key={type}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                      <Home className="text-red-600" size={28} />
                    </div>
                    <h3 className="font-medium mb-2">{type}</h3>
                    <p className="text-gray-600 text-sm">{count} propiedades</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
