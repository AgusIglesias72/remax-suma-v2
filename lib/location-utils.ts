// lib/location-utils.ts
// RUTA: lib/location-utils.ts
import type { PropertyType } from "@/lib/types"

export interface LocationData {
  address: string
  lat: number
  lng: number
  placeId?: string
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  types?: string[] // Para identificar si es barrio, ciudad, etc.
}

export interface SearchFilters {
  location?: LocationData
  radius?: number // en kilómetros - solo si no hay bounds
  operationType?: string
  propertyType?: string
  priceRange?: [number, number]
  rooms?: number
  bathrooms?: number
  features?: string[]
}

/**
 * Verifica si un punto está dentro de bounds geográficos
 */
export function isPointInBounds(
  lat: number, 
  lng: number, 
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return lat >= bounds.south && 
         lat <= bounds.north && 
         lng >= bounds.west && 
         lng <= bounds.east
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 */
export function calculateDistance(
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180)
  const dLng = (coords2.lng - coords1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1.lat * (Math.PI / 180)) *
      Math.cos(coords2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}


/**
 * Determina si una ubicación es un área específica (barrio, ciudad)
 * basado en los types de Google Places
 */
export function isSpecificArea(location: LocationData): boolean {
  if (!location.types) return false
  
  const areaTypes = [
    'sublocality',
    'sublocality_level_1', 
    'locality',
    'administrative_area_level_2',
    'neighborhood',
    'political'
  ]
  
  return location.types.some(type => areaTypes.includes(type))
}

/**
 * Obtiene información del tipo de lugar para mostrar al usuario
 */
export function getLocationTypeLabel(location: LocationData): string {
  if (!location.types) return "Ubicación"
  
  if (location.types.includes('neighborhood') || location.types.includes('sublocality')) {
    return "Barrio"
  }
  if (location.types.includes('locality')) {
    return "Ciudad"
  }
  if (location.types.includes('administrative_area_level_2')) {
    return "Partido"
  }
  if (location.types.includes('route')) {
    return "Calle"
  }
  if (location.types.includes('establishment')) {
    return "Lugar"
  }
  
  return "Zona"
}

/**
 * Genera un mensaje descriptivo para la búsqueda
 */
export function getSearchDescription(location: LocationData, count: number): string {
  const typeLabel = getLocationTypeLabel(location)
  const method = location.bounds ? "en" : "cerca de"
  
  return `${count} propiedades ${method} ${typeLabel.toLowerCase()} ${location.address}`
}

/**
 * Filtra propiedades por operación
 */
export function filterPropertiesByOperation(
    properties: PropertyType[],
    operationType: string
  ): PropertyType[] {
    if (!operationType || operationType === "cualquier-operacion") {
      return properties
    }
    
    // Mapeo de slugs de URL a valores reales de la base de datos
    const operationMap: Record<string, string> = {
      "venta": "Venta",
      "alquiler": "Alquiler", 
      "alquiler-temporal": "Alquiler temporal"
    }
    
    const mappedOperation = operationMap[operationType.toLowerCase()] || operationType
    return properties.filter(property => 
      property.operation_type.toLowerCase() === mappedOperation.toLowerCase()
    )
  }

/**
 * Filtra propiedades por tipo
 */
export function filterPropertiesByType(
    properties: PropertyType[],
    propertyType: string
  ): PropertyType[] {
    if (!propertyType || propertyType === "cualquier-tipo") {
      return properties
    }
    
    // Mapeo de slugs de URL a valores reales de la base de datos
    const typeMap: Record<string, string> = {
      "departamento-estandar": "Departamento Estándar",
      "casa": "Casa",
      "departamento-duplex": "Departamento Dúplex", 
      "local": "Local",
      "terrenos-lotes": "Terrenos y Lotes",
      "terrenos-y-lotes": "Terrenos y Lotes",
      "departamento-monoambiente": "Departamento Monoambiente",
      "oficina": "Oficina",
      "cochera": "Cochera",
      "casa-duplex": "Casa Dúplex",
      "departamento-penthouse": "Departamento Penthouse",
      "casa-triplex": "Casa Triplex",
      "ph": "PH"
    }
    
    const mappedType = typeMap[propertyType.toLowerCase()] || propertyType
    return properties.filter(property => 
      property.property_type.toLowerCase() === mappedType.toLowerCase()
    )
  }

/**
 * Filtra propiedades por rango de precio
 */
export function filterPropertiesByPrice(
  properties: PropertyType[],
  priceRange: [number, number]
): PropertyType[] {
  const [min, max] = priceRange
  return properties.filter(property => {
    const price = property.price || 0
    return price >= min && price <= max
  })
}

/**
 * Filtra propiedades por número de ambientes
 */
export function filterPropertiesByRooms(
  properties: PropertyType[],
  rooms: number
): PropertyType[] {
  if (rooms === 0) return properties
  return properties.filter(property => property.rooms === rooms)
}

/**
 * Aplicar todos los filtros a la vez
 */
export function applyAllFilters(
  properties: PropertyType[],
  filters: SearchFilters
): PropertyType[] {
  return properties.filter((property) => {
    // Filtro de ubicación por coincidencia de texto
    if (filters.location?.lat && filters.location?.lng) {
      if (!property.latitude || !property.longitude) return false
      
      const searchAddress = filters.location.address.toLowerCase()
      const propertyNeighborhood = property.neighborhood?.toLowerCase()
      
      if (propertyNeighborhood && !searchAddress.includes(propertyNeighborhood)) {
        return false
      }
    }

    // Otros filtros
    if (filters.operationType && property.operation_type !== filters.operationType) {
      return false
    }
    if (filters.propertyType && property.property_type !== filters.propertyType) {
      return false
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      if (property.price < min || property.price > max) {
        return false
      }
    }
    if (filters.rooms) {
      if (filters.rooms === 0 && property.property_type !== 'departamento-monoambiente') return false; // Monoambiente
      if (filters.rooms >= 5 && property.rooms < 5) return false; // 5 o más
      if (filters.rooms > 0 && filters.rooms < 5 && property.rooms !== filters.rooms) return false;
    }
    if (filters.bathrooms) {
      if (filters.bathrooms >= 4 && property.bathrooms < 4) return false; // 4 o más
      if (filters.bathrooms < 4 && property.bathrooms !== filters.bathrooms) return false;
    }
    if (filters.features && filters.features.length > 0) {
      if (!filters.features.every(feature => (property as any)[feature])) {
        return false
      }
    }

    return true
  })
}


/**
 * Obtiene el centro geográfico de un conjunto de propiedades
 */
export function getPropertiesCenter(
  properties: PropertyType[]
): { lat: number; lng: number } | undefined {
  if (properties.length === 0) return undefined
  if (properties.length === 1) {
    return { lat: properties[0].latitude!, lng: properties[0].longitude! }
  }

  const { totalLat, totalLng } = properties.reduce(
    (acc, prop) => {
      if (prop.latitude && prop.longitude) {
        acc.totalLat += prop.latitude
        acc.totalLng += prop.longitude
      }
      return acc
    },
    { totalLat: 0, totalLng: 0 }
  )

  const validPropertiesCount = properties.filter(p => p.latitude && p.longitude).length
  
  if (validPropertiesCount === 0) return undefined

  return {
    lat: totalLat / validPropertiesCount,
    lng: totalLng / validPropertiesCount,
  }
}

/**
 * Convierte Google Maps LatLngBounds a nuestro formato
 */
export function convertGoogleBounds(bounds: google.maps.LatLngBounds) {
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  
  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng()
  }
}

/**
 * Radios de búsqueda predefinidos (solo para fallback)
 */
export const SEARCH_RADIUS_OPTIONS = [
  { value: 1, label: "1 km" },
  { value: 2, label: "2 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 15, label: "15 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" }
]