// hooks/use-url-filters.ts
"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import type { SearchFilters, LocationData } from "@/lib/location-utils"

/**
 * Hook para manejar filtros desde parámetros de URL
 */
export function useUrlFilters() {
  const searchParams = useSearchParams()

  // Parsear filtros desde URL
  const filtersFromUrl = useMemo((): Partial<SearchFilters> => {
    const filters: Partial<SearchFilters> = {}

    // Operación
    const operacion = searchParams.get("operacion")
    if (operacion) {
      filters.operationType = operacion
    }

    // Tipo de propiedad
    const tipo = searchParams.get("tipo")
    if (tipo) {
      filters.propertyType = tipo
    }

    // Radio de búsqueda
    const radio = searchParams.get("radio")
    if (radio && !isNaN(Number(radio))) {
      filters.radius = Number(radio)
    }

    // Ubicación desde parámetros específicos
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const ubicacion = searchParams.get("ubicacion")
    
    if (lat && lng && ubicacion && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      filters.location = {
        address: ubicacion,
        lat: Number(lat),
        lng: Number(lng)
      }
    }

    // Ciudad (búsqueda más general)
    const ciudad = searchParams.get("ciudad")
    if (ciudad && !filters.location) {
      const cityCoordinates = getCityCoordinates(ciudad)
      if (cityCoordinates) {
        filters.location = cityCoordinates
        filters.radius = 15 // Radio más amplio para ciudades
      }
    }

    // Rango de precios
    const precioMin = searchParams.get("precio_min")
    const precioMax = searchParams.get("precio_max")
    if (precioMin && precioMax && !isNaN(Number(precioMin)) && !isNaN(Number(precioMax))) {
      filters.priceRange = [Number(precioMin), Number(precioMax)]
    }

    // Ambientes
    const ambientes = searchParams.get("ambientes")
    if (ambientes && !isNaN(Number(ambientes))) {
      filters.rooms = Number(ambientes)
    }

    // Baños
    const banos = searchParams.get("banos")
    if (banos && !isNaN(Number(banos))) {
      filters.bathrooms = Number(banos)
    }

    return filters
  }, [searchParams])

  return filtersFromUrl
}

/**
 * Mapea nombres de ciudades a coordenadas aproximadas
 */
function getCityCoordinates(citySlug: string): LocationData | null {
  const cityMap: Record<string, LocationData> = {
    "vicente-lopez": {
      address: "Vicente López, Buenos Aires",
      lat: -34.5329,
      lng: -58.4695
    },
    "palermo": {
      address: "Palermo, Buenos Aires",
      lat: -34.5889,
      lng: -58.4298
    },
    "colegiales": {
      address: "Colegiales, Buenos Aires", 
      lat: -34.5624,
      lng: -58.4512
    },
    "san-telmo": {
      address: "San Telmo, Buenos Aires",
      lat: -34.6142,
      lng: -58.3776
    },
    "recoleta": {
      address: "Recoleta, Buenos Aires",
      lat: -34.5875,
      lng: -58.3974
    },
    "belgrano": {
      address: "Belgrano, Buenos Aires",
      lat: -34.5633,
      lng: -58.4578
    },
    "puerto-madero": {
      address: "Puerto Madero, Buenos Aires",
      lat: -34.6084,
      lng: -58.3640
    },
    "villa-urquiza": {
      address: "Villa Urquiza, Buenos Aires",
      lat: -34.5707,
      lng: -58.4815
    },
    "villa-pueyrredon": {
      address: "Villa Pueyrredón, Buenos Aires",
      lat: -34.5983,
      lng: -58.5017
    },
    "san-fernando": {
      address: "San Fernando, Buenos Aires",
      lat: -34.4415,
      lng: -58.5594
    }
  }

  return cityMap[citySlug] || null
}

/**
 * Genera URL con filtros aplicados
 */
export function generateSearchUrl(filters: SearchFilters): string {
  const params = new URLSearchParams()

  if (filters.operationType && filters.operationType !== "venta") {
    params.set("operacion", filters.operationType)
  }

  if (filters.propertyType && filters.propertyType !== "cualquier-tipo") {
    params.set("tipo", filters.propertyType)
  }

  if (filters.location) {
    params.set("ubicacion", filters.location.address)
    params.set("lat", filters.location.lat.toString())
    params.set("lng", filters.location.lng.toString())
  }

  if (filters.radius && filters.radius !== 10) {
    params.set("radio", filters.radius.toString())
  }

  if (filters.priceRange) {
    params.set("precio_min", filters.priceRange[0].toString())
    params.set("precio_max", filters.priceRange[1].toString())
  }

  if (filters.rooms) {
    params.set("ambientes", filters.rooms.toString())
  }

  if (filters.bathrooms) {
    params.set("banos", filters.bathrooms.toString())
  }

  const queryString = params.toString()
  return queryString ? `/propiedades?${queryString}` : "/propiedades"
}

/**
 * Hook para actualizar URL cuando cambian los filtros
 */
export function useUpdateUrl() {
  const updateUrl = (filters: SearchFilters, replace: boolean = true) => {
    const url = generateSearchUrl(filters)
    if (replace) {
      window.history.replaceState({}, "", url)
    } else {
      window.history.pushState({}, "", url)
    }
  }

  return updateUrl
}