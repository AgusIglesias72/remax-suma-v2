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
    radius: 2, // Este radio ya no se usa para filtrar, pero puede servir para el zoom.
    ...initialFilters
  })

  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...initialFilters }))
    }
  }, [initialFilters])

  const filteredProperties = useMemo(() => {
    try {
      return applyAllFilters(properties, filters)
    } catch (error) {
      console.error('Error aplicando filtros:', error)
      return properties
    }
  }, [properties, filters])

  const mapCenter = useMemo(() => {
    if (filters.location) {
      return { lat: filters.location.lat, lng: filters.location.lng }
    }
    return getPropertiesCenter(filteredProperties)
  }, [filters.location, filteredProperties])

  const mapZoom = useMemo(() => {
    if (filters.location && filters.radius) {
      const zoomLevels: Record<number, number> = {
        1: 15, 2: 14, 5: 13, 10: 12, 15: 11, 25: 10, 50: 9
      }
      return zoomLevels[filters.radius] || 12
    }
    if (filteredProperties.length > 1) return 11
    if (filteredProperties.length === 1) return 15
    return 12
  }, [filters.location, filters.radius, filteredProperties.length])

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

  const clearFilters = useCallback(() => {
    setFilters({ radius: 2 })
  }, [])

  const clearLocation = useCallback(() => {
    setFilters((prev) => {
      const { location, ...rest } = prev
      return rest
    })
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

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

  const stats = useMemo(() => {
    const total = properties.length
    const filtered = filteredProperties.length
    const percentage = total > 0 ? Math.round((filtered / total) * 100) : 0
    return { total, filtered, percentage, hasResults: filtered > 0 }
  }, [properties.length, filteredProperties.length])

  return {
    filters,
    filteredProperties,
    mapCenter,
    mapZoom,
    stats,
    hasActiveFilters,
    setLocation,
    setRadius,
    setOperationType,
    setPropertyType,
    setPriceRange,
    setRooms,
    setBathrooms,
    setFeatures,
    updateFilters,
    clearFilters,
    clearLocation,
    setFilters
  }
}