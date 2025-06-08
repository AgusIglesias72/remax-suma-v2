// components/loading-states.tsx
"use client"

import { Loader2, Search, Home, MapPin, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Loading Spinner genérico
export function LoadingSpinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin text-red-600 ${className}`} 
    />
  )
}

// Loading para búsqueda
export function SearchLoading({ message = "Buscando propiedades..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <Search className="h-8 w-8 text-gray-400" />
        <LoadingSpinner size={16} className="absolute -bottom-1 -right-1" />
      </div>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  )
}

// Loading para mapa
export function MapLoading({ height = "400px" }: { height?: string }) {
  return (
    <div 
      className="w-full bg-gray-100 flex items-center justify-center rounded-lg animate-pulse"
      style={{ height }}
    >
      <div className="text-center text-gray-500">
        <div className="relative mb-3">
          <MapPin className="h-12 w-12 mx-auto text-gray-400" />
          <LoadingSpinner size={20} className="absolute -bottom-1 -right-1" />
        </div>
        <p className="text-sm">Cargando mapa...</p>
      </div>
    </div>
  )
}

// Loading para grid de propiedades
export function PropertiesGridLoading({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Estado vacío
export function EmptyState({ 
  icon: Icon = Search,
  title = "No se encontraron resultados",
  description = "Intenta ajustar los filtros para obtener más resultados",
  actionLabel = "Limpiar filtros",
  onAction
}: {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="bg-red-600 hover:bg-red-700">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Estado de error
export function ErrorState({
  title = "Algo salió mal",
  description = "Hubo un problema al cargar la información",
  actionLabel = "Intentar de nuevo",
  onRetry
}: {
  title?: string
  description?: string
  actionLabel?: string
  onRetry?: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Loading inline para botones
export function ButtonLoading({ children, isLoading, ...props }: { 
  children: React.ReactNode
  isLoading: boolean
  [key: string]: any
}) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <LoadingSpinner size={16} className="mr-2" />}
      {children}
    </Button>
  )
}

// Loading para autocompletado
export function AutocompleteLoading() {
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <LoadingSpinner size={16} />
    </div>
  )
}

// Skeleton para cards de propiedades
export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="pt-2 border-t">
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}