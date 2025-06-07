"use client"

import { useState } from "react"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import PropertyMapWrapper from "@/components/property-map-wrapper"
import MapSearch from "@/components/map-search"
import { allProperties } from "@/lib/data"
import type { google } from "google-maps"

export default function SearchLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState("")
  const [nearbyProperties, setNearbyProperties] = useState(allProperties)

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      setSelectedLocation({ lat, lng })
      setLocationName(place.formatted_address || place.name || "")

      // Filtrar propiedades cercanas (simulado - en producción usarías una búsqueda real)
      const filtered = allProperties.filter((property) => {
        const distance = calculateDistance(lat, lng, property.latitude, property.longitude)
        return distance < 10 // 10km radius
      })

      setNearbyProperties(filtered)
    }
  }

  // Función simple para calcular distancia (Haversine formula simplificada)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
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
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="text-red-600" size={20} />
                    Buscar por Ubicación
                  </CardTitle>
                  <CardDescription>Encuentra propiedades cerca de una ubicación específica</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MapSearch
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Buscar dirección, barrio o punto de interés..."
                  />

                  {locationName && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Ubicación seleccionada:</p>
                      <p className="text-sm text-green-700">{locationName}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Propiedades encontradas</h3>
                    <p className="text-2xl font-bold text-red-600">{nearbyProperties.length}</p>
                    <p className="text-sm text-gray-500">en un radio de 10km</p>
                  </div>

                  {nearbyProperties.length > 0 && (
                    <Link href="/propiedades">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Ver todas las propiedades</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de Propiedades</CardTitle>
                  <CardDescription>
                    {selectedLocation
                      ? `Mostrando propiedades cerca de ${locationName}`
                      : "Busca una ubicación para ver propiedades cercanas"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyMapWrapper
                    properties={nearbyProperties}
                    center={selectedLocation || undefined}
                    zoom={selectedLocation ? 13 : 11}
                    height="500px"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
