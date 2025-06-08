// components/error-boundary.tsx
"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log del error
    console.error('Error Boundary capturó un error:', error, errorInfo)
    
    // Aquí podrías enviar el error a un servicio de tracking como Sentry
    // if (typeof window !== 'undefined') {
    //   trackError(error, errorInfo)
    // }
    
    // Llamar callback personalizado si existe
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Si hay un componente fallback personalizado, usarlo
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Componente de error por defecto
      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Componente de error por defecto
function DefaultErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error
  resetError: () => void 
}) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Oops! Algo salió mal</CardTitle>
          <CardDescription>
            Se produjo un error inesperado. Por favor, intenta recargar la página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && error && (
            <details className="bg-gray-50 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Detalles del error (solo en desarrollo)
              </summary>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1 gap-2">
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para capturar errores en componentes funcionales
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Error capturado:', error, errorInfo)
    
    // Aquí podrías enviar el error a un servicio de tracking como Sentry
    // reportError(error, errorInfo)
  }
}

// Error Boundary específico para el mapa
export function MapErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Error al cargar el mapa</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verifica tu conexión a internet y la configuración de Google Maps
            </p>
            <Button onClick={resetError} size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Error Boundary para filtros
export function FiltersErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Error en los filtros</h3>
            <p className="text-sm text-gray-600 mb-3">
              Hubo un problema al aplicar los filtros
            </p>
            <Button onClick={resetError} size="sm" variant="outline">
              Reiniciar filtros
            </Button>
          </div>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary