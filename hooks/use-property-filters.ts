// hooks/use-property-filters.ts
// RUTA: hooks/use-property-filters.ts
"use client"

import { useState, useMemo, useCallback } from "react"
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

  // Propiedades filtradas
  const filteredProperties = useMemo(() => {
    return applyAllFilters(properties, filters)
  }, [properties, filters])

  // Centro del mapa basado en propiedades filtradas o ubicación de búsqueda
  const mapCenter = useMemo(() => {
    if (filters.location) {
      return { lat: filters.location.lat, lng: filters.location.lng }
    }
    return getPropertiesCenter(filteredProperties)
  }, [filters.location, filteredProperties])

  // Zoom del mapa basado en el radio de búsqueda
  const mapZoom = useMemo(() => {
    if (!filters.radius) return 12
    
    // Ajustar zoom basado en el radio
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
  }, [filters.radius])

  // Setters específicos para cada tipo de filtro
  const setLocation = useCallback((location: LocationData | undefined) => {
    setFilters((prev: any) => ({ ...prev, location }))
  }, [])

  const setRadius = useCallback((radius: number) => {
    setFilters((prev: any) => ({ ...prev, radius }))
  }, [])

  const setOperationType = useCallback((operationType: string | undefined) => {
    setFilters((prev: any) => ({ ...prev, operationType }))
  }, [])

  const setPropertyType = useCallback((propertyType: string | undefined) => {
    setFilters((prev: any) => ({ ...prev, propertyType }))
  }, [])

  const setPriceRange = useCallback((priceRange: [number, number] | undefined) => {
    setFilters((prev: any) => ({ ...prev, priceRange }))
  }, [])

  const setRooms = useCallback((rooms: number | undefined) => {
    setFilters((prev: any) => ({ ...prev, rooms }))
  }, [])

  const setBathrooms = useCallback((bathrooms: number | undefined) => {
    setFilters((prev: any) => ({ ...prev, bathrooms }))
  }, [])

  const setFeatures = useCallback((features: string[] | undefined) => {
    setFilters((prev: any) => ({ ...prev, features }))
  }, [])

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters({ radius: 10 })
  }, [])

  // Función para limpiar solo la ubicación
  const clearLocation = useCallback(() => {
    setFilters((prev: any) => ({ ...prev, location: undefined }))
  }, [])

  // Función para actualizar múltiples filtros a la vez
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }))
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
      filters.features?.length
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