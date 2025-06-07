"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Heart, Share2, Phone, Car, Calendar, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import { getPropertyById, getAgentByName, formatPrice, formatSurface, getOperationTypeLabel } from "@/lib/data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getPropertyById(params.id)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
            <Link href="/propiedades">
              <Button className="bg-red-600 hover:bg-red-700">Volver a propiedades</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const agent = getAgentByName(property.agent_name)
  const displaySurface = property.total_built_surface || property.covered_surface

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/propiedades" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6">
            <ArrowLeft size={16} className="mr-2" /> Volver a resultados
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-6">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-red-600 text-white hover:bg-red-700">
                    {getOperationTypeLabel(property.operation_type)}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {property.property_type}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white">
                    <Share2 size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={`rounded-full ${isFavorite ? "bg-red-600 text-white hover:bg-red-700" : "bg-white/90 hover:bg-white"}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-8">
                {property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} - Imagen ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={16} className="mr-1" />
                  {property.address}, {property.neighborhood ? `${property.neighborhood}, ` : ""}
                  {property.city}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="text-2xl font-bold text-red-600 mb-4">
                  {formatPrice(property.price, property.currency)}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{property.days_on_market} días en el mercado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">MLS: {property.mls_id}</span>
                  </div>
                </div>

                {agent && (
                  <div className="flex items-center mb-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <span className="text-sm font-medium">Agente a cargo: {agent.name}</span>
                        <p className="text-xs text-gray-500">{agent.properties_count} propiedades</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  {property.rooms > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{property.rooms}</span>
                      <span className="text-sm text-gray-600">Ambientes</span>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{property.bedrooms} Dormitorios</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{property.bathrooms} Baños</span>
                    </div>
                  )}
                  {property.garages > 0 && (
                    <div className="flex items-center gap-2">
                      <Car size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{property.garages} Cocheras</span>
                    </div>
                  )}
                  {displaySurface && (
                    <div className="flex items-center gap-2">
                      <Maximize size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{formatSurface(displaySurface)} Cubiertos</span>
                    </div>
                  )}
                  {property.land_surface && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{formatSurface(property.land_surface)} Terreno</span>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="descripcion">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                    <TabsTrigger value="caracteristicas">Características</TabsTrigger>
                    <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                  </TabsList>
                  <TabsContent value="descripcion" className="pt-4">
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </TabsContent>
                  <TabsContent value="caracteristicas" className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Superficies</h4>
                        {property.covered_surface && (
                          <p className="text-sm text-gray-600">
                            Superficie cubierta: {formatSurface(property.covered_surface)}
                          </p>
                        )}
                        {property.semicovered_surface && (
                          <p className="text-sm text-gray-600">
                            Superficie semicubierta: {formatSurface(property.semicovered_surface)}
                          </p>
                        )}
                        {property.uncovered_surface && (
                          <p className="text-sm text-gray-600">
                            Superficie descubierta: {formatSurface(property.uncovered_surface)}
                          </p>
                        )}
                        {property.land_surface && (
                          <p className="text-sm text-gray-600">
                            Superficie del terreno: {formatSurface(property.land_surface)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Detalles</h4>
                        <p className="text-sm text-gray-600">Tipo: {property.property_type}</p>
                        <p className="text-sm text-gray-600">Estado: {property.status}</p>
                        <p className="text-sm text-gray-600">
                          Fecha de publicación: {new Date(property.listing_date).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ubicacion" className="pt-4">
                    <div className="h-[300px] rounded-lg overflow-hidden">
                      <PropertyMapWrapper
                        properties={[property]}
                        center={{ lat: property.latitude, lng: property.longitude }}
                        zoom={15}
                        height="300px"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-24">
                {agent && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-500">Agente Inmobiliario</p>
                        <p className="text-xs text-gray-400">{agent.properties_count} propiedades</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button className="w-full bg-red-600 hover:bg-red-700 gap-2">
                        <Phone size={16} />
                        {agent.phone}
                      </Button>

                      <Button variant="outline" className="w-full">
                        Enviar mensaje
                      </Button>

                      <Button variant="outline" className="w-full">
                        Agendar visita
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">¿Interesado en esta propiedad?</h3>
                  <form className="space-y-4">
                    <input type="text" placeholder="Nombre completo" className="w-full px-3 py-2 border rounded-md" />
                    <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
                    <input type="tel" placeholder="Teléfono" className="w-full px-3 py-2 border rounded-md" />
                    <textarea placeholder="Mensaje" rows={4} className="w-full px-3 py-2 border rounded-md"></textarea>
                    <Button className="w-full bg-red-600 hover:bg-red-700">Enviar consulta</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
