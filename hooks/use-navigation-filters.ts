// hooks/use-navigation-filters.ts
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { SearchFilters } from "@/lib/location-utils"

/**
 * Hook para manejar navegación con filtros
 */
export function useNavigationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Función para generar URL con filtros
  const generateFilterUrl = useCallback((filters: Partial<SearchFilters>, basePath: string = "/propiedades"): string => {
    const params = new URLSearchParams()

    // Operación
    if (filters.operationType && filters.operationType !== "venta") {
      params.set("operacion", filters.operationType)
    }

    // Tipo de propiedad
    if (filters.propertyType && filters.propertyType !== "cualquier-tipo") {
      params.set("tipo", filters.propertyType)
    }

    // Ubicación
    if (filters.location) {
      params.set("ubicacion", filters.location.address)
      params.set("lat", filters.location.lat.toString())
      params.set("lng", filters.location.lng.toString())
    }

    // Radio
    if (filters.radius && filters.radius !== 10) {
      params.set("radio", filters.radius.toString())
    }

    // Precio
    if (filters.priceRange) {
      params.set("precio_min", filters.priceRange[0].toString())
      params.set("precio_max", filters.priceRange[1].toString())
    }

    // Ambientes
    if (filters.rooms) {
      params.set("ambientes", filters.rooms.toString())
    }

    // Baños
    if (filters.bathrooms) {
      params.set("banos", filters.bathrooms.toString())
    }

    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }, [])

  // Navegar con filtros
  const navigateWithFilters = useCallback((filters: Partial<SearchFilters>, replace: boolean = false) => {
    const url = generateFilterUrl(filters)
    if (replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }, [router, generateFilterUrl])

  // Actualizar URL actual con nuevos filtros
  const updateCurrentUrl = useCallback((newFilters: Partial<SearchFilters>) => {
    // Obtener filtros actuales desde URL
    const currentFilters: Partial<SearchFilters> = {}
    
    // Parsear filtros actuales desde searchParams
    const operacion = searchParams.get("operacion")
    if (operacion) currentFilters.operationType = operacion
    
    const tipo = searchParams.get("tipo")
    if (tipo) currentFilters.propertyType = tipo
    
    const ubicacion = searchParams.get("ubicacion")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    if (ubicacion && lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      currentFilters.location = {
        address: ubicacion,
        lat: Number(lat),
        lng: Number(lng)
      }
    }
    
    const radio = searchParams.get("radio")
    if (radio && !isNaN(Number(radio))) {
      currentFilters.radius = Number(radio)
    }
    
    const precioMin = searchParams.get("precio_min")
    const precioMax = searchParams.get("precio_max")
    if (precioMin && precioMax && !isNaN(Number(precioMin)) && !isNaN(Number(precioMax))) {
      currentFilters.priceRange = [Number(precioMin), Number(precioMax)]
    }
    
    const ambientes = searchParams.get("ambientes")
    if (ambientes && !isNaN(Number(ambientes))) {
      currentFilters.rooms = Number(ambientes)
    }
    
    const banos = searchParams.get("banos")
    if (banos && !isNaN(Number(banos))) {
      currentFilters.bathrooms = Number(banos)
    }
    
    // Combinar filtros actuales con nuevos filtros
    const combinedFilters = { ...currentFilters, ...newFilters }

    const url = generateFilterUrl(combinedFilters, window.location.pathname)
    router.replace(url)
  }, [searchParams, router, generateFilterUrl])

  // Navegación rápida a búsquedas comunes
  const quickSearch = {
    byOperation: useCallback((operation: string) => {
      navigateWithFilters({ operationType: operation })
    }, [navigateWithFilters]),

    byPropertyType: useCallback((propertyType: string) => {
      navigateWithFilters({ propertyType })
    }, [navigateWithFilters]),

    byCity: useCallback((city: string) => {
      // Mapear ciudades a coordenadas conocidas
      const cityCoordinates: Record<string, { address: string; lat: number; lng: number }> = {
        "palermo": { address: "Palermo, Buenos Aires", lat: -34.5889, lng: -58.4298 },
        "recoleta": { address: "Recoleta, Buenos Aires", lat: -34.5875, lng: -58.3974 },
        "puerto-madero": { address: "Puerto Madero, Buenos Aires", lat: -34.6084, lng: -58.3640 },
        "belgrano": { address: "Belgrano, Buenos Aires", lat: -34.5633, lng: -58.4578 },
        "san-telmo": { address: "San Telmo, Buenos Aires", lat: -34.6142, lng: -58.3776 },
        "colegiales": { address: "Colegiales, Buenos Aires", lat: -34.5624, lng: -58.4512 },
        "vicente-lopez": { address: "Vicente López, Buenos Aires", lat: -34.5329, lng: -58.4695 }
      }

      const coords = cityCoordinates[city.toLowerCase().replace(" ", "-")]
      if (coords) {
        navigateWithFilters({
          location: {
            address: coords.address,
            lat: coords.lat,
            lng: coords.lng
          },
          radius: 15
        })
      }
    }, [navigateWithFilters]),

    clearAll: useCallback(() => {
      router.push("/propiedades")
    }, [router])
  }

  return {
    generateFilterUrl,
    navigateWithFilters,
    updateCurrentUrl,
    quickSearch
  }
}