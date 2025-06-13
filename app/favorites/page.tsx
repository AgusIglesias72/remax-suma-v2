
// pages/favorites/page.tsx - PÁGINA COMPLETA DE FAVORITOS
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Grid3X3, List, Filter, SortAsc, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import PropertyCard from "@/components/property-card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useFavorites } from "@/hooks/use-favorites"

export default function FavoritesPage() {
  const { 
    favorites, 
    favoritesCount, 
    mounted, 
    clearFavorites, 
    getFavoritesSorted 
  } = useFavorites()
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price">("newest")
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar y ordenar favoritos
  const filteredFavorites = getFavoritesSorted(sortBy).filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/propiedades" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Volver a propiedades
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Heart className="text-red-600" />
                  Mis Favoritos
                </h1>
                <p className="text-gray-600 mt-1">
                  {favoritesCount === 0 
                    ? "No tienes propiedades guardadas" 
                    : `${favoritesCount} ${favoritesCount === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
                  }
                </p>
              </div>
              {favoritesCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFavorites}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 size={16} className="mr-2" />
                  Limpiar favoritos
                </Button>
              )}
            </div>
          </div>

          {favoritesCount > 0 ? (
            <>
              {/* Controles */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="Buscar en favoritos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Más recientes</SelectItem>
                        <SelectItem value="oldest">Más antiguos</SelectItem>
                        <SelectItem value="price">Por precio</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className={viewMode === "grid" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <Grid3X3 size={18} />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className={viewMode === "list" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        <List size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de propiedades */}
              {filteredFavorites.length > 0 ? (
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {filteredFavorites.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      showFavoriteButton={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron favoritos</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? `No hay favoritos que coincidan con "${searchTerm}"`
                      : "No tienes propiedades guardadas con estos filtros"
                    }
                  </p>
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Mostrar todos los favoritos
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Estado vacío */
            <div className="text-center py-16">
              <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No tienes favoritos guardados</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Guarda las propiedades que más te interesen para acceder fácilmente a ellas más tarde.
              </p>
              <Link href="/propiedades">
                <Button className="bg-red-600 hover:bg-red-700">
                  Explorar propiedades
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}