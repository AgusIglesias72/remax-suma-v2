// components/filters-debug.tsx
// RUTA: components/filters-debug.tsx
"use client"

import { useState } from "react"
import { Bug, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchFilters } from "@/lib/location-utils"

interface FiltersDebugProps {
  filters: SearchFilters
  stats: {
    total: number
    filtered: number
    percentage: number
    hasResults: boolean
  }
  filteredProperties?: any[]
}

export default function FiltersDebug({ filters, stats, filteredProperties }: FiltersDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto z-50 border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug size={16} className="text-orange-600" />
            Filtros Debug
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-1"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription className="text-xs">
          Resultados: {stats.filtered}/{stats.total} ({stats.percentage}%)
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded">
              <div className="font-semibold">Total</div>
              <div>{stats.total}</div>
            </div>
            <div className="bg-white p-2 rounded">
              <div className="font-semibold">Filtrados</div>
              <div>{stats.filtered}</div>
            </div>
          </div>

          {/* Filtros Activos */}
          <div>
            <h4 className="font-semibold text-xs mb-2">Filtros Activos:</h4>
            <div className="space-y-1 text-xs">
              {filters.location && (
                <div className="bg-white p-2 rounded">
                  <strong>Ubicación:</strong> {filters.location.address}
                  <br />
                  <strong>Coords:</strong> {filters.location.lat.toFixed(4)}, {filters.location.lng.toFixed(4)}
                  <br />
                  <strong>Radio:</strong> {filters.radius} km
                </div>
              )}
              
              {filters.operationType && (
                <div className="bg-white p-2 rounded">
                  <strong>Operación:</strong> {filters.operationType}
                </div>
              )}
              
              {filters.propertyType && (
                <div className="bg-white p-2 rounded">
                  <strong>Tipo:</strong> {filters.propertyType}
                </div>
              )}
              
              {filters.rooms && (
                <div className="bg-white p-2 rounded">
                  <strong>Ambientes:</strong> {filters.rooms}
                </div>
              )}
              
              {filters.priceRange && (
                <div className="bg-white p-2 rounded">
                  <strong>Precio:</strong> ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                </div>
              )}

              {!filters.location && !filters.operationType && !filters.propertyType && !filters.rooms && !filters.priceRange && (
                <div className="text-gray-500 italic">Sin filtros activos</div>
              )}
            </div>
          </div>

          {/* Propiedades Encontradas */}
          {filteredProperties && filteredProperties.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-2">Propiedades:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredProperties.slice(0, 5).map((property) => (
                  <div key={property.id} className="bg-white p-2 rounded text-xs">
                    <div className="font-medium truncate">{property.title}</div>
                    <div className="text-gray-600">
                      {property.city} - ${property.price?.toLocaleString()}
                    </div>
                    {filters.location && (
                      <div className="text-gray-500">
                        Dist: {calculateDisplayDistance(
                          filters.location.lat,
                          filters.location.lng,
                          property.latitude,
                          property.longitude
                        )} km
                      </div>
                    )}
                  </div>
                ))}
                {filteredProperties.length > 5 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... y {filteredProperties.length - 5} más
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URL Params */}
          <div>
            <h4 className="font-semibold text-xs mb-2">URL Generada:</h4>
            <div className="bg-white p-2 rounded text-xs break-all">
              {generateDebugUrl(filters)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Helper para calcular distancia para debug
function calculateDisplayDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return (R * c).toFixed(1)
}

// Helper para generar URL de debug
function generateDebugUrl(filters: SearchFilters): string {
  const params = new URLSearchParams()
  
  if (filters.operationType) params.set("operacion", filters.operationType)
  if (filters.propertyType) params.set("tipo", filters.propertyType)
  if (filters.location) {
    params.set("ubicacion", filters.location.address)
    params.set("lat", filters.location.lat.toString())
    params.set("lng", filters.location.lng.toString())
  }
  if (filters.radius) params.set("radio", filters.radius.toString())
  if (filters.rooms) params.set("ambientes", filters.rooms.toString())
  
  return `/propiedades?${params.toString()}`
}