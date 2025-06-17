// app/propiedades/nueva/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchAutocomplete } from "@/components/google-autocomplete"
import { ArrowLeft, Building, DollarSign, MapPin, Ruler, FileText, Save, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

// Tipos para el formulario
interface FormData {
  operation_type: string
  property_type: string
  title: string
  description: string
  address: string
  latitude: number | null
  longitude: number | null
  covered_surface: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  garages: number | null
  price: number | null
  price_currency: string
  expenses: number | null
  expenses_currency: string
}

const OPERATION_TYPES = [
  { value: "Venta", label: "Venta" },
  { value: "Alquiler", label: "Alquiler" },
  { value: "Alquiler Temporal", label: "Alquiler Temporario" }
]

const PROPERTY_TYPES = [
  { value: "Departamento Estándar", label: "Departamento Estándar" },
  { value: "Casa", label: "Casa" },
  { value: "Departamento Dúplex", label: "Departamento Dúplex" },
  { value: "Local", label: "Local" },
  { value: "Terrenos y Lotes", label: "Terrenos y Lotes" },
  { value: "Departamento Monoambiente", label: "Departamento Monoambiente" },
  { value: "Oficina", label: "Oficina" },
  { value: "Cochera", label: "Cochera" },
  { value: "PH", label: "PH" },
  { value: "Casa Dúplex", label: "Casa Dúplex" },
  { value: "Departamento Penthouse", label: "Departamento Penthouse" },
  { value: "Casa Triplex", label: "Casa Triplex" }
]

const CURRENCIES = [
  { value: "USD", label: "US$ (Dólares)" },
  { value: "ARS", label: "$ (Pesos Argentinos)" }
]

const STEPS = [
  { id: 1, title: "Información Básica", icon: Building, description: "Tipo de operación y propiedad" },
  { id: 2, title: "Ubicación", icon: MapPin, description: "Dirección y coordenadas" },
  { id: 3, title: "Características", icon: Ruler, description: "Superficie y ambientes" },
  { id: 4, title: "Información Económica", icon: DollarSign, description: "Precios y expensas" },
  { id: 5, title: "Descripción", icon: FileText, description: "Título y detalles" },
  { id: 6, title: "Revisión y Confirmación", icon: CheckCircle, description: "Revisa y confirma la información" }
]

export default function NuevaPropiedadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastApiResponse, setLastApiResponse] = useState<any>(null) // Para mostrar respuesta de debug
  const [formData, setFormData] = useState<FormData>({
    operation_type: "",
    property_type: "",
    title: "",
    description: "",
    address: "",
    latitude: null,
    longitude: null,
    covered_surface: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    garages: null,
    price: null,
    price_currency: "USD",
    expenses: null,
    expenses_currency: "ARS"
  })

  // 🔍 Monitorear cambios de paso para debugging
  useEffect(() => {
    console.log(`📍 PASO ACTUAL: ${currentStep}`)
    if (currentStep === 6) {
      console.log('⚠️ ESTAMOS EN PASO 6 - Solo mostrar resumen, NO hacer POST automático')
    }
  }, [currentStep])

  const handleInputChange = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng
    }))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.operation_type && formData.property_type
      case 2:
        return formData.address && formData.latitude && formData.longitude
      case 3:
        return formData.covered_surface
      case 4:
        return formData.price
      case 5:
        return formData.title && formData.description
      case 6:
        return true
      default:
        return false
    }
  }

  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return formData.operation_type && formData.property_type
      case 2:
        return formData.address && formData.latitude && formData.longitude
      case 3:
        return formData.covered_surface
      case 4:
        return formData.price
      case 5:
        return formData.title && formData.description
      case 6:
        return false
      default:
        return false
    }
  }

  const nextStep = () => {
    console.log(`🔄 Navegando de paso ${currentStep} al siguiente...`)
    if (validateCurrentStep() && currentStep < 6) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      console.log(`✅ Avanzado al paso ${newStep}`)
      
      // 🔍 LOG ESPECIAL cuando lleguemos al paso 6
      if (newStep === 6) {
        console.log('🎯 LLEGANDO AL PASO 6 - REVISIÓN. NO se debe hacer POST automáticamente.')
      }
    } else {
      console.log(`❌ No se puede avanzar - Validación: ${validateCurrentStep()}, Paso actual: ${currentStep}`)
    }
  }

  const prevStep = () => {
    console.log(`🔄 Retrocediendo del paso ${currentStep} al anterior...`)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      console.log(`✅ Retrocedido al paso ${currentStep - 1}`)
    }
  }

  const validateForm = () => {
    const required = [
      'operation_type', 'property_type', 'title', 'description', 
      'address', 'price', 'covered_surface'
    ]
    
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        alert(`El campo ${field} es requerido`)
        return false
      }
    }
    
    if (!formData.latitude || !formData.longitude) {
      alert("Por favor selecciona una ubicación válida usando el buscador")
      return false
    }
    
    return true
  }

  // Función para manejar SOLO el click del botón final
  const handleFinalSubmit = async () => {
    console.log('🎯 BOTÓN FINAL CLICKEADO - Iniciando envío...')
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      console.log('🚀 Enviando datos al endpoint...')
      const response = await fetch('/api/propiedades/nueva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // ✅ ÉXITO: Mostrar mensaje pero NO redirigir
        setLastApiResponse(result) // Guardar respuesta para debug
        alert(`¡Éxito! ${result.message}\n\nID Local: ${result.data?.localId}\nEstado: ${result.data?.status}`)
        console.log('✅ Respuesta exitosa:', result)
        
        // Opcionalmente resetear el formulario para una nueva carga
        const resetForm = confirm('¿Quieres resetear el formulario para cargar otra propiedad?')
        if (resetForm) {
          setFormData({
            operation_type: "",
            property_type: "",
            title: "",
            description: "",
            address: "",
            latitude: null,
            longitude: null,
            covered_surface: null,
            rooms: null,
            bedrooms: null,
            bathrooms: null,
            garages: null,
            price: null,
            price_currency: "USD",
            expenses: null,
            expenses_currency: "ARS"
          })
          setCurrentStep(1)
          setLastApiResponse(null) // Limpiar respuesta anterior
        }
      } else {
        setLastApiResponse(result) // Guardar error para debug
        alert(`❌ Error: ${result.message || 'Error al crear la propiedad'}`)
        console.error('❌ Error en respuesta:', result)
      }
    } catch (error: unknown) {
      console.error('💥 Error al enviar formulario:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setLastApiResponse({ error: errorMessage, type: 'connection_error' }) // Guardar error de conexión
      alert('❌ Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Función para prevenir envío accidental del form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🛑 FORM SUBMIT INTERCEPTADO - No se enviará automáticamente')
    // No hacer nada - solo prevenir el comportamiento por defecto
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="operation_type" className="text-sm font-medium text-gray-700 mb-3 block">
                Tipo de Operación *
              </Label>
              <Select 
                value={formData.operation_type} 
                onValueChange={(value) => handleInputChange('operation_type', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona el tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property_type" className="text-sm font-medium text-gray-700 mb-3 block">
                Tipo de Propiedad *
              </Label>
              <Select 
                value={formData.property_type} 
                onValueChange={(value) => handleInputChange('property_type', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecciona el tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-3 block">
                Dirección *
              </Label>
              <SearchAutocomplete
                onLocationSelect={handleLocationSelect}
                placeholder="Buscar dirección (ej: Libertador 1024, Buenos Aires)"
                className="h-12"
              />
              {formData.address && (
                <p className="text-sm text-green-600 mt-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ubicación seleccionada: {formData.address}
                </p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="covered_surface" className="text-sm font-medium text-gray-700 mb-3 block">
                Superficie Cubierta (m²) *
              </Label>
              <Input
                id="covered_surface"
                type="number"
                min="1"
                placeholder="ej: 85"
                className="h-12"
                value={formData.covered_surface || ""}
                onChange={(e) => handleInputChange('covered_surface', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            
            <div>
              <Label htmlFor="rooms" className="text-sm font-medium text-gray-700 mb-3 block">
                Cantidad de Ambientes
              </Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                placeholder="ej: 3"
                className="h-12"
                value={formData.rooms || ""}
                onChange={(e) => handleInputChange('rooms', e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-3 block">
                  Dormitorios
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="ej: 2"
                  className="h-12"
                  value={formData.bedrooms || ""}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700 mb-3 block">
                  Baños
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  placeholder="ej: 1"
                  className="h-12"
                  value={formData.bathrooms || ""}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="garages" className="text-sm font-medium text-gray-700 mb-3 block">
                  Cocheras
                </Label>
                <Input
                  id="garages"
                  type="number"
                  min="0"
                  placeholder="ej: 1"
                  className="h-12"
                  value={formData.garages || ""}
                  onChange={(e) => handleInputChange('garages', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-3 block">
                Precio *
              </Label>
              <div className="flex gap-3">
                <Select 
                  value={formData.price_currency} 
                  onValueChange={(value) => handleInputChange('price_currency', value)}
                >
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  placeholder="ej: 150000"
                  className="flex-1 h-12"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange('price', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expenses" className="text-sm font-medium text-gray-700 mb-3 block">
                Expensas (opcional)
              </Label>
              <div className="flex gap-3">
                <Select 
                  value={formData.expenses_currency} 
                  onValueChange={(value) => handleInputChange('expenses_currency', value)}
                >
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="expenses"
                  type="number"
                  min="0"
                  placeholder="ej: 25000"
                  className="flex-1 h-12"
                  value={formData.expenses || ""}
                  onChange={(e) => handleInputChange('expenses', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-3 block">
                Título *
              </Label>
              <Input
                id="title"
                placeholder="ej: Hermoso departamento 3 ambientes en Palermo"
                className="h-12"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-3 block">
                Descripción *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe la propiedad, sus características principales, estado, comodidades..."
                rows={8}
                className="resize-none"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        )

      case 6:
        console.log('🎯 Renderizando paso 6 - SOLO MOSTRAR, no hacer POST')
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Resumen de la Propiedad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Operación:</strong> {formData.operation_type}<br/>
                  <strong>Tipo:</strong> {formData.property_type}<br/>
                  <strong>Superficie:</strong> {formData.covered_surface} m²<br/>
                  {formData.rooms && <span><strong>Ambientes:</strong> {formData.rooms}<br/></span>}
                </div>
                <div>
                  <strong>Precio:</strong> {formData.price_currency === 'USD' ? 'US$' : '$'} {formData.price?.toLocaleString()}<br/>
                  <strong>Dirección:</strong> {formData.address}<br/>
                  {formData.expenses && <span><strong>Expensas:</strong> {formData.expenses_currency === 'USD' ? 'US$' : '$'} {formData.expenses.toLocaleString()}<br/></span>}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <strong>Título:</strong> {formData.title}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">¿Todo está correcto?</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Al confirmar, se procesará automáticamente en RedRemax. Puedes volver atrás para modificar cualquier dato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop&crop=center')`
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href="/propiedades" 
              className="inline-flex items-center gap-2 text-white hover:text-red-300 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a propiedades
            </Link>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                Cargar Nueva Propiedad
              </h1>
              <p className="text-white/80 text-lg">
                Completa la información paso a paso para agregar una nueva propiedad
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = isStepCompleted(step.id)
                const isCurrent = currentStep === step.id
                const IconComponent = step.icon
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={`flex flex-col items-center cursor-pointer transition-all ${
                        isCurrent ? 'scale-110' : ''
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-white/20 border-white/40 text-white/60'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <IconComponent size={20} />
                        )}
                      </div>
                      <span 
                        className={`mt-2 text-xs font-medium text-center transition-colors ${
                          isCurrent ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    
                    {index < STEPS.length - 1 && (
                      <div 
                        className={`w-16 h-0.5 mx-4 transition-colors ${
                          isStepCompleted(step.id) ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
                  {(() => {
                    const StepIcon = STEPS[currentStep - 1].icon
                    return <StepIcon size={28} className="text-red-600" />
                  })()}
                  {STEPS[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {STEPS[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <div className="mb-8">
                  {renderStepContent()}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    type="button" // 🔧 IMPORTANTE: type="button" para evitar submit
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6"
                  >
                    Anterior
                  </Button>

                  <div className="text-sm text-gray-500">
                    Paso {currentStep} de {STEPS.length}
                  </div>

                  {currentStep < 6 ? (
                    <Button
                      type="button" // 🔧 IMPORTANTE: type="button" para evitar submit
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="px-6 bg-red-600 hover:bg-red-700"
                    >
                      {currentStep === 5 ? 'Revisar' : 'Siguiente'}
                    </Button>
                  ) : (
                    <Button 
                      type="button" // 🔥 CAMBIADO: type="button" en lugar de submit
                      onClick={handleFinalSubmit} // 🎯 CLICK ESPECÍFICO para enviar
                      disabled={isLoading || !validateCurrentStep()}
                      className="px-8 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publicando en RedRemax...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar y Publicar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 🛠️ Panel de Debug - Solo en desarrollo */}
            {lastApiResponse && (
              <Card className="backdrop-blur-sm bg-yellow-50/95 border-yellow-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-yellow-800 text-lg">
                    🛠️ Última Respuesta de la API (Debug)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-yellow-100 p-4 rounded-lg overflow-auto max-h-60 text-yellow-900">
                    {JSON.stringify(lastApiResponse, null, 2)}
                  </pre>
                  <Button 
                    onClick={() => setLastApiResponse(null)}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Limpiar Debug
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}