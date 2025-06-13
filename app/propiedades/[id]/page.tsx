// app/propiedades/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Car, Calendar, Eye, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import PropertyGallery from "@/components/property-gallery"
import AgentContactCard from "@/components/agent-contact-card"
import { allProperties, agents } from "@/lib/data"
import type { PropertyType } from "@/lib/types"

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [property, setProperty] = useState<PropertyType | null>(null)
  const [loading, setLoading] = useState(true)

  // Efecto para cargar la propiedad cuando se resuelvan los params
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const resolvedParams = await params
        const foundProperty = allProperties.find(p => p.id === resolvedParams.id)
        
        if (!foundProperty) {
          notFound()
        }
        
        setProperty(foundProperty)
      } catch (error) {
        console.error('Error loading property:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params])

  // Mostrar loading mientras se cargan los datos
  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Buscar el agente (placeholder - en producción vendría de la propiedad)
  const agent = agents.find(a => a.id === "1") || agents[0]

  // Funciones auxiliares
  const getOperationTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "Venta": "Venta",
      "Alquiler": "Alquiler", 
      "Alquiler Temporal": "Alquiler Temporal"
    }
    return map[type] || type
  }

  const formatPrice = (price: number) => {
    return `${property.currency} ${price.toLocaleString('es-AR')}`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Mira esta propiedad en RE/MAX SUMA`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado al portapapeles')
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aquí iría la lógica para guardar en favoritos
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/propiedades" className="hover:text-red-600 flex items-center gap-1">
            <ArrowLeft size={16} />
            Volver a resultados
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Información de la propiedad */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de fotos */}
            <PropertyGallery
              images={property.images || []}
              title={property.title}
              operationType={property.operation_type}
              propertyType={property.property_type}
              onShare={handleShare}
              onFavorite={handleFavorite}
              isFavorite={isFavorite}
            />

            {/* Información principal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Header con precio y ubicación */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrice(property.price)}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span>{property.address}</span>
                      {property.neighborhood && (
                        <span className="ml-1">• {property.neighborhood}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-red-600 text-white">
                      {getOperationTypeLabel(property.operation_type)}
                    </Badge>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {property.title}
                </h2>

                {/* Características principales */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  {property.rooms && (
                    <div className="flex items-center gap-1">
                      <Bed size={16} />
                      <span>{property.rooms} {property.rooms === 1 ? 'ambiente' : 'ambientes'}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath size={16} />
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</span>
                    </div>
                  )}
                  {property.total_built_surface && (
                    <div className="flex items-center gap-1">
                      <Maximize size={16} />
                      <span>{property.total_built_surface}m²</span>
                    </div>
                  )}
                  {property.parking && (
                    <div className="flex items-center gap-1">
                      <Car size={16} />
                      <span>Cochera</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Tabs con información detallada */}
              <Tabs defaultValue="descripcion" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="caracteristicas">Características</TabsTrigger>
                  <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                </TabsList>

                <TabsContent value="descripcion" className="mt-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {property.description || 
                        `Excelente ${property.property_type.toLowerCase()} ubicado en ${property.neighborhood || 'zona premium'}. 
                        Esta propiedad cuenta con todas las comodidades que necesitas para vivir cómodamente. 
                        ${property.rooms ? `Con ${property.rooms} ambientes` : ''} 
                        ${property.total_built_surface ? ` y ${property.total_built_surface}m² totales` : ''}, 
                        es ideal para ${property.rooms && property.rooms >= 3 ? 'familias' : 'parejas o personas solas'}.
                        
                        La zona cuenta con excelente conectividad, servicios y comercios cercanos. 
                        Una oportunidad única en el mercado inmobiliario.`
                      }
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="caracteristicas" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Información General</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Tipo: {property.property_type}</p>
                        <p>Operación: {getOperationTypeLabel(property.operation_type)}</p>
                        <p>Estado: {property.status}</p>
                        {property.total_built_surface && <p>Superficie: {property.total_built_surface}m²</p>}
                        {property.rooms && <p>Ambientes: {property.rooms}</p>}
                        {property.bathrooms && <p>Baños: {property.bathrooms}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Detalles</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Publicado: {new Date(property.listing_date).toLocaleDateString("es-AR")}</p>
                        <p>ID: {property.id}</p>
                        {property.parking && <p>Cochera: Sí</p>}
                        <p>Barrio: {property.neighborhood || 'Información no disponible'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ubicacion" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Ubicación</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {property.address}
                        {property.neighborhood && `, ${property.neighborhood}`}
                      </p>
                    </div>
                    
                    <div className="h-[300px] rounded-lg overflow-hidden">
                      <PropertyMapWrapper
                        properties={[property]}
                        center={{ lat: property.latitude, lng: property.longitude }}
                        zoom={15}
                        height="300px"
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <h5 className="font-medium mb-2">Sobre la zona</h5>
                      <p>
                        {property.neighborhood || 'Esta zona'} cuenta con excelente conectividad, 
                        acceso a transporte público, comercios, colegios y espacios verdes. 
                        Una ubicación estratégica que combina tranquilidad con fácil acceso a todos los servicios.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar - Información del agente */}
          <div className="lg:col-span-1">
            <AgentContactCard 
              agent={agent}
              propertyTitle={property.title}
              propertyId={property.id}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}