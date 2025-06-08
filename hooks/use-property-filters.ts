// hooks/use-property-filters.ts
"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import type { PropertyType } from "@/lib/types"
import { 
  applyAllFilters, 
  getPropertiesCenter,
  type SearchFilters, 
  type LocationData 
} from "@/lib/location-utils"

interface UsePropertyFiltersProps {
  properties: PropertyType[]
  initialFilters?: Partial<SearchFilters>
}

export function usePropertyFilters({ 
  properties, 
  initialFilters = {} 
}: UsePropertyFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    radius: 10, // 10km por defecto
    ...initialFilters
  })

  // Sincronizar con filtros iniciales cuando cambien (ej: desde URL)
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }))
    }
  }, [initialFilters])

  // Propiedades filtradas
  const filteredProperties = useMemo(() => {
    try {
      return applyAllFilters(properties, filters)
    } catch (error) {
      console.error('Error aplicando filtros:', error)
      return properties // Fallback a mostrar todas las propiedades si hay error
    }
  }, [properties, filters])

  // Centro del mapa basado en propiedades filtradas o ubicación de búsqueda
  const mapCenter = useMemo(() => {
    if (filters.location) {
      return { lat: filters.location.lat, lng: filters.location.lng }
    }
    return getPropertiesCenter(filteredProperties)
  }, [filters.location, filteredProperties])

  // Zoom del mapa basado en el radio de búsqueda y cantidad de propiedades
  const mapZoom = useMemo(() => {
    // Si hay una ubicación específica, usar el radio para calcular zoom
    if (filters.location && filters.radius) {
      const zoomLevels: Record<number, number> = {
        1: 15,
        2: 14,
        5: 13,
        10: 12,
        15: 11,
        25: 10,
        50: 9
      }
      return zoomLevels[filters.radius] || 12
    }
    
    // Si hay múltiples propiedades, zoom para mostrar todas
    if (filteredProperties.length > 1) {
      return 11
    }
    
    // Para una sola propiedad, zoom más cercano
    if (filteredProperties.length === 1) {
      return 15
    }
    
    // Zoom por defecto para Buenos Aires
    return 12
  }, [filters.location, filters.radius, filteredProperties.length])

  // Setters específicos para cada tipo de filtro
  const setLocation = useCallback((location: LocationData | undefined) => {
    setFilters((prev) => ({ ...prev, location }))
  }, [])

  const setRadius = useCallback((radius: number) => {
    setFilters((prev) => ({ ...prev, radius }))
  }, [])

  const setOperationType = useCallback((operationType: string | undefined) => {
    setFilters((prev) => ({ ...prev, operationType }))
  }, [])

  const setPropertyType = useCallback((propertyType: string | undefined) => {
    setFilters((prev) => ({ ...prev, propertyType }))
  }, [])

  const setPriceRange = useCallback((priceRange: [number, number] | undefined) => {
    setFilters((prev) => ({ ...prev, priceRange }))
  }, [])

  const setRooms = useCallback((rooms: number | undefined) => {
    setFilters((prev) => ({ ...prev, rooms }))
  }, [])

  const setBathrooms = useCallback((bathrooms: number | undefined) => {
    setFilters((prev) => ({ ...prev, bathrooms }))
  }, [])

  const setFeatures = useCallback((features: string[] | undefined) => {
    setFilters((prev) => ({ ...prev, features }))
  }, [])

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters({ radius: 10 })
  }, [])

  // Función para limpiar solo la ubicación
  const clearLocation = useCallback(() => {
    setFilters((prev) => ({ ...prev, location: undefined }))
  }, [])

  // Función para actualizar múltiples filtros a la vez
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Estado de si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.location ||
      filters.operationType ||
      filters.propertyType ||
      filters.priceRange ||
      filters.rooms ||
      filters.bathrooms ||
      (filters.features && filters.features.length > 0)
    )
  }, [filters])

  // Estadísticas de los resultados
  const stats = useMemo(() => {
    const total = properties.length
    const filtered = filteredProperties.length
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0
    
    return {
      total,
      filtered,
      percentage,
      hasResults: filtered > 0
    }
  }, [properties.length, filteredProperties.length])

  return {
    // Estado
    filters,
    filteredProperties,
    mapCenter,
    mapZoom,
    stats,
    hasActiveFilters,
    
    // Setters individuales
    setLocation,
    setRadius,
    setOperationType,
    setPropertyType,
    setPriceRange,
    setRooms,
    setBathrooms,
    setFeatures,
    
    // Funciones de utilidad
    updateFilters,
    clearFilters,
    clearLocation,
    
    // Para compatibilidad con componentes existentes
    setFilters
  }
}