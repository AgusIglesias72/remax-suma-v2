
// components/favorites-dropdown.tsx
// RUTA: components/favorites-dropdown.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, Trash2, ExternalLink, MessageSquare, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/hooks/use-favorites"
import { formatPrice } from "@/lib/data"

export default function FavoritesDropdown() {
  const { 
    favorites, 
    favoritesCount, 
    mounted, 
    removeFavorite, 
    clearFavorites,
    getFavoritesSorted 
  } = useFavorites()
  
  const [isOpen, setIsOpen] = useState(false)

  // Obtener favoritos más recientes para el dropdown
  const recentFavorites = getFavoritesSorted('newest').slice(0, 5)

  const handleRemoveFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFavorite(propertyId)
  }

  // Renderizar versión simple si no está montado
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full relative">
        <Heart className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-medium">
              {favoritesCount > 9 ? '9+' : favoritesCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600" />
              Mis Favoritos
            </h3>
            <p className="text-sm text-gray-500">
              {favoritesCount === 0 
                ? 'No tienes propiedades guardadas' 
                : `${favoritesCount} ${favoritesCount === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
              }
            </p>
          </div>
          {favoritesCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFavorites}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Lista de favoritos */}
        <div className="max-h-[400px] overflow-y-auto">
          {recentFavorites.length > 0 ? (
            recentFavorites.map((property) => (
              <div
                key={property.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Imagen de la propiedad */}
                  <Link href={`/propiedades/${property.id}`} className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {/* Badge de tipo de operación */}
                    <div className="absolute -top-1 -right-1">
                      <Badge 
                        className={`text-xs px-1 py-0 ${
                          property.operation_type === 'Venta' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {property.operation_type === 'Venta' ? 'V' : 'A'}
                      </Badge>
                    </div>
                  </Link>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Link href={`/propiedades/${property.id}`}>
                          <h4 className="font-medium text-sm line-clamp-1 hover:text-red-600 transition-colors">
                            {property.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                          📍 {property.address}, {property.city}
                        </p>
                        <p className="text-sm font-semibold text-red-600 mt-1">
                          {formatPrice(property.price, property.currency)}
                        </p>
                        
                        {/* Detalles de la propiedad */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          {property.rooms > 0 && <span>{property.rooms} amb.</span>}
                          {property.bedrooms > 0 && <span>• {property.bedrooms} dorm.</span>}
                          {property.bathrooms > 0 && <span>• {property.bathrooms} baños</span>}
                        </div>

                        {/* Fecha agregado */}
                        <p className="text-xs text-gray-400 mt-1">
                          Guardado {formatTimeAgo(property.addedAt)}
                        </p>

                        {/* Nota si existe */}
                        {property.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {property.notes}
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/propiedades/${property.id}`} className="cursor-pointer">
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => handleRemoveFavorite(property.id, e)}
                            className="text-red-600 cursor-pointer"
                          >
                            <Heart className="h-3 w-3 mr-2" />
                            Quitar de favoritos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Link completo invisible */}
                <Link 
                  href={`/propiedades/${property.id}`} 
                  className="absolute inset-0 z-0"
                />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No tienes favoritos guardados</p>
              <p className="text-sm">Guarda propiedades para acceder fácilmente</p>
              <Link href="/propiedades">
                <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                  Explorar propiedades
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {favoritesCount > 0 && (
          <div className="border-t p-3">
            <Link href="/perfil?tab=favoritos">
              <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                Ver todos los favoritos ({favoritesCount})
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Función helper para formatear tiempo
function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  
  if (diffInDays === 0) {
    if (diffInHours === 0) return 'hace un momento'
    return `hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`
  }
  if (diffInDays === 1) return 'ayer'
  if (diffInDays < 7) return `hace ${diffInDays} días`
  if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} semana${Math.floor(diffInDays / 7) === 1 ? '' : 's'}`
  
  return `hace ${Math.floor(diffInDays / 30)} mes${Math.floor(diffInDays / 30) === 1 ? '' : 'es'}`
}
