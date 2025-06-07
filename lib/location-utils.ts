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
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Filtra propiedades por ubicación usando bounds o radio
 */
export function filterPropertiesByLocation(
  properties: PropertyType[],
  location: LocationData,
  radius: number = 10 // km por defecto, solo usado si no hay bounds
): PropertyType[] {
  return properties.filter((property) => {
    // Si tenemos bounds geográficos, usarlos (más preciso)
    if (location.bounds) {
      return isPointInBounds(
        property.latitude,
        property.longitude,
        location.bounds
      )
    }
    
    // Fallback: usar radio circular
    const distance = calculateDistance(
      location.lat,
      location.lng,
      property.latitude,
      property.longitude
    )
    return distance <= radius
  })
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
  
  const operationMap: Record<string, string> = {
    "venta": "Venta",
    "alquiler": "Alquiler",
    "alquiler-temporal": "Alquiler temporal"
  }
  
  const mappedOperation = operationMap[operationType] || operationType
  return properties.filter(property => property.operation_type === mappedOperation)
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
  
  const typeMap: Record<string, string> = {
    "departamento-estandar": "Departamento Estándar",
    "casa": "Casa",
    "departamento-duplex": "Departamento Dúplex",
    "local": "Local",
    "terrenos-lotes": "Terrenos y Lotes",
    "departamento-monoambiente": "Departamento Monoambiente",
    "oficina": "Oficina"
  }
  
  const mappedType = typeMap[propertyType] || propertyType
  return properties.filter(property => property.property_type === mappedType)
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
  let filtered = [...properties]
  
  // Filtro por ubicación (bounds o radio)
  if (filters.location) {
    filtered = filterPropertiesByLocation(
      filtered,
      filters.location,
      filters.radius || 10
    )
  }
  
  // Filtro por tipo de operación
  if (filters.operationType) {
    filtered = filterPropertiesByOperation(filtered, filters.operationType)
  }
  
  // Filtro por tipo de propiedad
  if (filters.propertyType) {
    filtered = filterPropertiesByType(filtered, filters.propertyType)
  }
  
  // Filtro por precio
  if (filters.priceRange) {
    filtered = filterPropertiesByPrice(filtered, filters.priceRange)
  }
  
  // Filtro por ambientes
  if (filters.rooms) {
    filtered = filterPropertiesByRooms(filtered, filters.rooms)
  }
  
  return filtered
}

/**
 * Obtiene el centro geográfico de un conjunto de propiedades
 */
export function getPropertiesCenter(properties: PropertyType[]): { lat: number; lng: number } | null {
  if (properties.length === 0) return null
  
  const totalLat = properties.reduce((sum, prop) => sum + prop.latitude, 0)
  const totalLng = properties.reduce((sum, prop) => sum + prop.longitude, 0)
  
  return {
    lat: totalLat / properties.length,
    lng: totalLng / properties.length
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