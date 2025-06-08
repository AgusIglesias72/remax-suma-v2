// lib/type-guards.ts
import type { SearchFilters, LocationData } from "@/lib/location-utils"
import type { PropertyType } from "@/lib/types"

/**
 * Type guards para validar tipos en runtime
 */

export function isValidLocationData(obj: any): obj is LocationData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.address === 'string' &&
    typeof obj.lat === 'number' &&
    typeof obj.lng === 'number' &&
    !isNaN(obj.lat) &&
    !isNaN(obj.lng)
  )
}

export function isValidSearchFilters(obj: any): obj is SearchFilters {
  if (!obj || typeof obj !== 'object') return false
  
  // Validar location si existe
  if (obj.location && !isValidLocationData(obj.location)) return false
  
  // Validar radius si existe
  if (obj.radius !== undefined && (typeof obj.radius !== 'number' || isNaN(obj.radius))) return false
  
  // Validar operationType si existe
  if (obj.operationType !== undefined && typeof obj.operationType !== 'string') return false
  
  // Validar propertyType si existe
  if (obj.propertyType !== undefined && typeof obj.propertyType !== 'string') return false
  
  // Validar priceRange si existe
  if (obj.priceRange && (!Array.isArray(obj.priceRange) || obj.priceRange.length !== 2)) return false
  
  // Validar rooms si existe
  if (obj.rooms !== undefined && (typeof obj.rooms !== 'number' || isNaN(obj.rooms))) return false
  
  // Validar bathrooms si existe  
  if (obj.bathrooms !== undefined && (typeof obj.bathrooms !== 'number' || isNaN(obj.bathrooms))) return false
  
  return true
}

export function isValidProperty(obj: any): obj is PropertyType {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.latitude === 'number' &&
    typeof obj.longitude === 'number' &&
    !isNaN(obj.latitude) &&
    !isNaN(obj.longitude)
  )
}

/**
 * Utilidades para sanitizar datos de entrada
 */

export function sanitizeLocationData(obj: any): LocationData | null {
  try {
    if (!obj) return null
    
    const address = typeof obj.address === 'string' ? obj.address : ''
    const lat = Number(obj.lat)
    const lng = Number(obj.lng)
    
    if (isNaN(lat) || isNaN(lng) || !address) return null
    
    const locationData: LocationData = { address, lat, lng }
    
    // Agregar propiedades opcionales si existen
    if (obj.placeId && typeof obj.placeId === 'string') {
      locationData.placeId = obj.placeId
    }
    
    if (obj.bounds && typeof obj.bounds === 'object') {
      const bounds = obj.bounds
      if (
        typeof bounds.north === 'number' &&
        typeof bounds.south === 'number' &&
        typeof bounds.east === 'number' &&
        typeof bounds.west === 'number'
      ) {
        locationData.bounds = bounds
      }
    }
    
    if (Array.isArray(obj.types)) {
      locationData.types = obj.types.filter((type: any) => typeof type === 'string')
    }
    
    return locationData
  } catch (error) {
    console.warn('Error sanitizing location data:', error)
    return null
  }
}

export function sanitizeSearchFilters(obj: any): Partial<SearchFilters> {
  try {
    if (!obj || typeof obj !== 'object') return {}
    
    const filters: Partial<SearchFilters> = {}
    
    // Sanitizar location
    if (obj.location) {
      const location = sanitizeLocationData(obj.location)
      if (location) filters.location = location
    }
    
    // Sanitizar radius
    if (obj.radius !== undefined) {
      const radius = Number(obj.radius)
      if (!isNaN(radius) && radius > 0) filters.radius = radius
    }
    
    // Sanitizar strings
    if (obj.operationType && typeof obj.operationType === 'string') {
      filters.operationType = obj.operationType.trim()
    }
    
    if (obj.propertyType && typeof obj.propertyType === 'string') {
      filters.propertyType = obj.propertyType.trim()
    }
    
    // Sanitizar priceRange
    if (Array.isArray(obj.priceRange) && obj.priceRange.length === 2) {
      const min = Number(obj.priceRange[0])
      const max = Number(obj.priceRange[1])
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filters.priceRange = [min, max]
      }
    }
    
    // Sanitizar numbers
    if (obj.rooms !== undefined) {
      const rooms = Number(obj.rooms)
      if (!isNaN(rooms) && rooms > 0) filters.rooms = rooms
    }
    
    if (obj.bathrooms !== undefined) {
      const bathrooms = Number(obj.bathrooms)
      if (!isNaN(bathrooms) && bathrooms > 0) filters.bathrooms = bathrooms
    }
    
    // Sanitizar features
    if (Array.isArray(obj.features)) {
      const features = obj.features.filter((feature: any) => typeof feature === 'string')
      if (features.length > 0) filters.features = features
    }
    
    return filters
  } catch (error) {
    console.warn('Error sanitizing search filters:', error)
    return {}
  }
}

/**
 * Utilidades para debugging
 */

export function logFilterState(filters: SearchFilters, label: string = 'Filters') {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 ${label}`)
    console.log('Raw filters:', filters)
    console.log('Has location:', !!filters.location)
    console.log('Has operation:', !!filters.operationType)
    console.log('Has property type:', !!filters.propertyType)
    console.log('Has price range:', !!filters.priceRange)
    console.log('Has rooms filter:', !!filters.rooms)
    console.log('Valid filters:', isValidSearchFilters(filters))
    console.groupEnd()
  }
}

export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Verificar Google Maps API Key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    errors.push('Google Maps API Key no configurada correctamente')
  }
  
  // Verificar que estamos en el browser si es necesario
  if (typeof window === 'undefined') {
    // Esto es normal durante SSR, no es un error
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Hook para validar el estado de la aplicación
 */
export function useValidation() {
  const envValidation = validateEnvironment()
  
  return {
    environment: envValidation,
    isLocationValid: isValidLocationData,
    isFiltersValid: isValidSearchFilters,
    sanitizeLocation: sanitizeLocationData,
    sanitizeFilters: sanitizeSearchFilters,
    logFilters: logFilterState
  }
}