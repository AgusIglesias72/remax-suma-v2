// components/testing-utilities.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Play, Beaker } from "lucide-react"
import { useNavigationFilters } from "@/hooks/use-navigation-filters"
import { usePropertyFilters } from "@/hooks/use-property-filters"
import { allProperties } from "@/lib/data"

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
}

export default function TestingUtilities() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { navigateWithFilters } = useNavigationFilters()
  
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []

    // Test 1: Verificar que hay propiedades cargadas
    try {
      if (allProperties.length > 0) {
        results.push({
          name: "Datos de propiedades",
          status: 'success',
          message: `${allProperties.length} propiedades cargadas correctamente`
        })
      } else {
        results.push({
          name: "Datos de propiedades", 
          status: 'error',
          message: "No se encontraron propiedades"
        })
      }
    } catch (error) {
      results.push({
        name: "Datos de propiedades",
        status: 'error', 
        message: `Error al cargar propiedades: ${error}`
      })
    }

    // Test 2: Verificar Google Maps API Key
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (apiKey && apiKey !== 'tu_api_key_aqui') {
        results.push({
          name: "Google Maps API Key",
          status: 'success',
          message: "API Key configurada correctamente"
        })
      } else {
        results.push({
          name: "Google Maps API Key",
          status: 'error',
          message: "API Key no configurada o usando valor por defecto"
        })
      }
    } catch (error) {
      results.push({
        name: "Google Maps API Key",
        status: 'error',
        message: "Error al verificar API Key"
      })
    }

    // Test 3: Verificar Google Maps disponible
    try {
      if (typeof window !== 'undefined' && window.google) {
        results.push({
          name: "Google Maps SDK",
          status: 'success',
          message: "SDK de Google Maps cargado"
        })
      } else {
        results.push({
          name: "Google Maps SDK",
          status: 'warning',
          message: "SDK de Google Maps no disponible (puede estar cargando)"
        })
      }
    } catch (error) {
      results.push({
        name: "Google Maps SDK",
        status: 'error',
        message: "Error al verificar SDK de Google Maps"
      })
    }

    // Test 4: Verificar filtros por operación
    try {
      const ventaProperties = allProperties.filter(p => p.operation_type === "Venta")
      const alquilerProperties = allProperties.filter(p => p.operation_type === "Alquiler")
      
      if (ventaProperties.length > 0 && alquilerProperties.length > 0) {
        results.push({
          name: "Filtros por operación",
          status: 'success',
          message: `Venta: ${ventaProperties.length}, Alquiler: ${alquilerProperties.length}`
        })
      } else {
        results.push({
          name: "Filtros por operación",
          status: 'warning',
          message: "Algunos tipos de operación pueden estar faltando"
        })
      }
    } catch (error) {
      results.push({
        name: "Filtros por operación",
        status: 'error',
        message: `Error al filtrar por operación: ${error}`
      })
    }

    // Test 5: Verificar filtros por tipo de propiedad
    try {
      const propertyTypes = [...new Set(allProperties.map(p => p.property_type))]
      
      if (propertyTypes.length > 1) {
        results.push({
          name: "Filtros por tipo",
          status: 'success',
          message: `${propertyTypes.length} tipos de propiedades disponibles`
        })
      } else {
        results.push({
          name: "Filtros por tipo",
          status: 'warning',
          message: "Pocos tipos de propiedades disponibles"
        })
      }
    } catch (error) {
      results.push({
        name: "Filtros por tipo",
        status: 'error',
        message: `Error al verificar tipos de propiedades: ${error}`
      })
    }

    // Test 6: Verificar coordenadas de propiedades
    try {
      const validCoordinates = allProperties.filter(p => 
        p.latitude && p.longitude && 
        p.latitude !== 0 && p.longitude !== 0
      )
      
      if (validCoordinates.length === allProperties.length) {
        results.push({
          name: "Coordenadas de propiedades",
          status: 'success',
          message: "Todas las propiedades tienen coordenadas válidas"
        })
      } else {
        results.push({
          name: "Coordenadas de propiedades",
          status: 'warning',
          message: `${validCoordinates.length}/${allProperties.length} propiedades con coordenadas válidas`
        })
      }
    } catch (error) {
      results.push({
        name: "Coordenadas de propiedades",
        status: 'error',
        message: `Error al verificar coordenadas: ${error}`
      })
    }

    // Test 7: Verificar imágenes de propiedades
    try {
      const propertiesWithImages = allProperties.filter(p => p.images && p.images.length > 0)
      
      if (propertiesWithImages.length > allProperties.length * 0.8) {
        results.push({
          name: "Imágenes de propiedades",
          status: 'success',
          message: `${propertiesWithImages.length}/${allProperties.length} propiedades con imágenes`
        })
      } else {
        results.push({
          name: "Imágenes de propiedades",
          status: 'warning',
          message: `Solo ${propertiesWithImages.length}/${allProperties.length} propiedades tienen imágenes`
        })
      }
    } catch (error) {
      results.push({
        name: "Imágenes de propiedades",
        status: 'error',
        message: `Error al verificar imágenes: ${error}`
      })
    }

    // Simular tiempo de testing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const successCount = testResults.filter(r => r.status === 'success').length
  const errorCount = testResults.filter(r => r.status === 'error').length
  const warningCount = testResults.filter(r => r.status === 'warning').length

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] z-50">
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Beaker className="h-5 w-5" />
              Testing & Validación
            </CardTitle>
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="sm"
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Ejecutar Tests
                </>
              )}
            </Button>
          </div>
          <CardDescription className="text-purple-600">
            Verifica el estado de la aplicación y sus funcionalidades
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {testResults.length > 0 && (
            <div className="flex gap-2 mb-4">
              {successCount > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  ✓ {successCount} éxitos
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  ⚠ {warningCount} advertencias
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  ✗ {errorCount} errores
                </Badge>
              )}
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-2">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{result.name}</h4>
                    <p className="text-xs opacity-90 mt-1">{result.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testResults.length === 0 && !isRunning && (
            <div className="text-center py-8 text-purple-600">
              <Beaker className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Haz clic en "Ejecutar Tests" para verificar el estado de la aplicación</p>
            </div>
          )}

          {/* Actions rápidas para testing */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-medium text-purple-800">Tests Rápidos:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWithFilters({ operationType: 'venta' })}
                className="text-xs"
              >
                Test Venta
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWithFilters({ 
                  location: { 
                    address: 'Palermo, Buenos Aires', 
                    lat: -34.5889, 
                    lng: -58.4298 
                  } 
                })}
                className="text-xs"
              >
                Test Ubicación
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWithFilters({ propertyType: 'casa' })}
                className="text-xs"
              >
                Test Tipo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWithFilters({ priceRange: [100000, 500000] })}
                className="text-xs"
              >
                Test Precio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}