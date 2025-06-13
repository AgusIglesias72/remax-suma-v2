// hooks/use-favorites.ts
// RUTA: hooks/use-favorites.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import type { PropertyType } from '@/lib/types'

const FAVORITES_STORAGE_KEY = 'remax-suma-favorites'

export interface FavoriteProperty extends PropertyType {
  addedAt: string // timestamp cuando se agregó a favoritos
  notes?: string // notas personales del agente
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [mounted, setMounted] = useState(false)

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsedFavorites = JSON.parse(stored)
        setFavorites(parsedFavorites)
      }
    } catch (error) {
      console.warn('Error loading favorites from localStorage:', error)
    }
  }, [])

  // Guardar favoritos en localStorage cuando cambien
  const saveFavorites = useCallback((newFavorites: FavoriteProperty[]) => {
    if (!mounted) return
    
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
    } catch (error) {
      console.warn('Error saving favorites to localStorage:', error)
    }
  }, [mounted])

  // Verificar si una propiedad está en favoritos
  const isFavorite = useCallback((propertyId: string): boolean => {
    return favorites.some(fav => fav.id === propertyId)
  }, [favorites])

  // Agregar propiedad a favoritos
  const addFavorite = useCallback((property: PropertyType) => {
    if (isFavorite(property.id)) return

    const favoriteProperty: FavoriteProperty = {
      ...property,
      addedAt: new Date().toISOString()
    }

    const newFavorites = [favoriteProperty, ...favorites]
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
  }, [favorites, isFavorite, saveFavorites])

  // Quitar propiedad de favoritos
  const removeFavorite = useCallback((propertyId: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== propertyId)
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
  }, [favorites, saveFavorites])

  // Toggle favorito (agregar o quitar)
  const toggleFavorite = useCallback((property: PropertyType) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id)
    } else {
      addFavorite(property)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  // Limpiar todos los favoritos
  const clearFavorites = useCallback(() => {
    setFavorites([])
    saveFavorites([])
  }, [saveFavorites])

  // Agregar nota a un favorito
  const addNoteToFavorite = useCallback((propertyId: string, note: string) => {
    const newFavorites = favorites.map(fav => 
      fav.id === propertyId ? { ...fav, notes: note } : fav
    )
    setFavorites(newFavorites)
    saveFavorites(newFavorites)
  }, [favorites, saveFavorites])

  // Obtener favoritos ordenados por fecha
  const getFavoritesSorted = useCallback((sortBy: 'newest' | 'oldest' | 'price' = 'newest') => {
    const sorted = [...favorites]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
      case 'price':
        return sorted.sort((a, b) => b.price - a.price)
      default:
        return sorted
    }
  }, [favorites])

  return {
    favorites,
    favoritesCount: favorites.length,
    mounted,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    addNoteToFavorite,
    getFavoritesSorted
  }
}