
// components/property-card.tsx - VERSIÓN ACTUALIZADA CON FAVORITOS
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight, Car, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PropertyType } from "@/lib/types"
import { formatPrice, formatSurface, getAgentByName, getOperationTypeLabel } from "@/lib/data"
import FavoriteButton from "@/components/favorite-button"

interface PropertyCardProps {
  property: PropertyType
  showFavoriteButton?: boolean
}

export default function PropertyCard({ property, showFavoriteButton = true }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const agent = getAgentByName(property.agent_name)

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    )
  }, [property.images.length])

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    )
  }, [property.images.length])

  const displaySurface = property.total_built_surface || property.covered_surface

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={`/propiedades/${property.id}`} className="block relative h-48 overflow-hidden">
          <Image
            src={property.images[currentImageIndex] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-all duration-500"
          />

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-red-600 text-white hover:bg-red-700">
              {getOperationTypeLabel(property.operation_type)}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {property.property_type}
            </Badge>
          </div>

          {/* Manual carousel controls */}
          {property.images.length > 1 && isHovered && (
            <div className="absolute inset-0 flex items-center justify-between opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white ml-2"
                onClick={prevImage}
              >
                <ChevronLeft size={16} />
                <span className="sr-only">Anterior</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white mr-2"
                onClick={nextImage}
              >
                <ChevronRight size={16} />
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
          )}

          {/* Image counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{property.images.length}
            </div>
          )}

          {/* Days on market */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {property.days_on_market} días
          </div>
        </Link>

        {/* Botón de favoritos */}
        {showFavoriteButton && (
          <div className="absolute top-3 right-3">
            <FavoriteButton property={property} />
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/propiedades/${property.id}`} className="block">
          <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.address}, {property.neighborhood ? `${property.neighborhood}, ` : ""}
              {property.city}
            </span>
          </div>

          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">{property.title}</h3>

          <p className="text-red-600 font-bold text-lg mb-3">{formatPrice(property.price, property.currency)}</p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {property.rooms > 0 && (
              <div className="flex items-center gap-1">
                <Home size={14} />
                <span>{property.rooms}</span>
              </div>
            )}
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath size={14} />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.garages > 0 && (
              <div className="flex items-center gap-1">
                <Car size={14} />
                <span>{property.garages}</span>
              </div>
            )}
            {displaySurface && (
              <div className="flex items-center gap-1">
                <Maximize size={14} />
                <span>{formatSurface(displaySurface)}</span>
              </div>
            )}
          </div>

          {agent && (
            <div className="flex items-center">
              <Image
                src={agent.avatar || "/placeholder.svg"}
                alt={agent.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          )}
        </div>

        {/* MLS ID */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">MLS: {property.mls_id}</span>
        </div>
      </div>
    </div>
  )
}
