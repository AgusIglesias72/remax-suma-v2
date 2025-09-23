// app/admin/propiedades/nueva/components/steps/StepDescription.tsx
"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues } from "../../types"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface StepDescriptionProps {
  form: UseFormReturn<PropertyFormValues>
}

export function StepDescription({ form }: StepDescriptionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validation, setValidation] = useState<any>(null)
  
  // Verificar si tenemos los datos mínimos para generar
  const hasMinimumData = form.watch('tipo') && form.watch('operacion')
  const hasGoodData = hasMinimumData && 
    (form.watch('ambientes') || form.watch('dormitorios') || form.watch('superficieTotales'))

  const generateDescription = async () => {
    // Verificar que tengamos datos mínimos necesarios ANTES de iniciar
    const propertyData = form.getValues()
    
    // Lista de campos requeridos para generar descripción
    const missingFields = []
    if (!propertyData.tipo) missingFields.push('Tipo de propiedad')
    if (!propertyData.operacion) missingFields.push('Tipo de operación')
    
    if (missingFields.length > 0) {
      toast.error(
        `Por favor completa primero: ${missingFields.join(', ')}`,
        {
          description: 'Ve al Paso 1 (Información) para completar estos campos',
          duration: 5000
        }
      )
      return
    }

    // Campos opcionales pero recomendados
    const recommendedFields = []
    if (!propertyData.ambientes) recommendedFields.push('ambientes')
    if (!propertyData.dormitorios) recommendedFields.push('dormitorios')
    if (!propertyData.baños) recommendedFields.push('baños')
    if (!propertyData.superficieTotales) recommendedFields.push('superficie')
    if (!propertyData.precio) recommendedFields.push('precio')
    
    // Si faltan muchos campos recomendados, preguntar si desea continuar
    if (recommendedFields.length >= 3) {
      const continuar = window.confirm(
        `Faltan datos importantes (${recommendedFields.join(', ')}). ` +
        'La descripción será más genérica. ¿Deseas continuar de todos modos?'
      )
      if (!continuar) return
    }
    
    setIsGenerating(true)
    try {
      console.log('Enviando datos:', propertyData) // Debug
      
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyData })
      })

      // Primero obtener el response como texto para debuggear
      const responseText = await response.text()
      console.log('Response status:', response.status)
      console.log('Response text:', responseText)

      if (response.status === 429) {
        try {
          const error = JSON.parse(responseText)
          toast.error(error.message || "Has alcanzado el límite de solicitudes")
        } catch {
          toast.error("Has alcanzado el límite de solicitudes")
        }
        return
      }

      if (!response.ok) {
        // Intentar parsear el error
        try {
          const errorData = JSON.parse(responseText)
          console.error('Error del servidor:', errorData)
          throw new Error(errorData.error || 'Error en la respuesta del servidor')
        } catch {
          throw new Error(`Error ${response.status}: ${responseText || 'Error en la respuesta del servidor'}`)
        }
      }

      // Si todo está bien, parsear la respuesta
      const data = JSON.parse(responseText)

      const { description, remaining } = await response.json()
      
      // Establecer la descripción en el formulario
      form.setValue('descripcion', description)
      
      toast.success(`¡Descripción generada! Te quedan ${remaining} generaciones esta hora.`)
    } catch (error) {
      console.error('Error completo:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error al generar la descripción. Por favor, intenta nuevamente.")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const validateContent = async () => {
    setIsValidating(true)
    try {
      const response = await fetch('/api/ai/validate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.watch('titulo'),
          description: form.watch('descripcion'),
          images: [], // Por ahora sin imágenes
          propertyData: form.getValues()
        })
      })

      if (!response.ok) {
        throw new Error('Error en la validación')
      }

      const validationResult = await response.json()
      setValidation(validationResult)
      
      // Mostrar toast según el score
      if (validationResult.score >= 80) {
        toast.success("¡Excelente publicación! Score: " + validationResult.score + "/100")
      } else if (validationResult.score >= 60) {
        toast.info("Buena publicación con espacio para mejorar. Score: " + validationResult.score + "/100")
      } else {
        toast.warning("La publicación necesita mejoras. Score: " + validationResult.score + "/100")
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error("Error al validar la publicación")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de ayuda si faltan datos */}
      {!hasMinimumData && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <span className="font-medium">Para generar una descripción con IA necesitas completar primero:</span>
            <ul className="mt-2 space-y-1 text-sm">
              {!form.watch('tipo') && <li>• Tipo de propiedad (Paso 1)</li>}
              {!form.watch('operacion') && <li>• Tipo de operación (Paso 1)</li>}
            </ul>
            <p className="mt-2 text-sm">
              Para mejores resultados, también completa: ambientes, dormitorios, baños, superficie y precio.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Campo de título */}
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título de la propiedad *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: Hermoso departamento en Palermo" 
                {...field} 
                className="h-11" 
              />
            </FormControl>
            <FormDescription>
              Un título atractivo aumenta las visitas a tu publicación
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo de descripción con botón de IA */}
      <FormField
        control={form.control}
        name="descripcion"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between mb-3">
              <FormLabel>Descripción *</FormLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={isGenerating || !hasMinimumData}
                  className={
                    hasMinimumData 
                      ? "text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      : "text-gray-400 border-gray-200"
                  }
                  title={
                    !hasMinimumData 
                      ? "Completa tipo y operación en el Paso 1"
                      : hasGoodData
                      ? "Generar descripción con IA"
                      : "Generar descripción (faltan algunos datos para mejor resultado)"
                  }
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : !hasMinimumData ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Faltan datos
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generar con IA
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={validateContent}
                  disabled={isValidating || (!field.value && !form.watch('titulo'))}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Validar
                    </>
                  )}
                </Button>
              </div>
            </div>
            <FormControl>
              <Textarea
                placeholder="Describe la propiedad detalladamente..."
                className="min-h-[200px] resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Incluye detalles sobre la propiedad, el barrio, servicios cercanos, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Resultados de validación */}
      {validation && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Análisis de IA
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Puntuación:</span>
              <Badge 
                variant={
                  validation.score >= 80 ? "default" : 
                  validation.score >= 60 ? "secondary" : 
                  "destructive"
                }
                className="text-lg px-3 py-1"
              >
                {validation.score}/100
              </Badge>
            </div>
          </div>

          {/* Barra de progreso visual del score */}
          <Progress value={validation.score} className="h-2" />

          {/* Fortalezas */}
          {validation.strengths && validation.strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-700">✅ Puntos fuertes:</h4>
              <ul className="space-y-1">
                {validation.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mejoras sugeridas */}
          {validation.improvements && validation.improvements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-amber-700">💡 Sugerencias de mejora:</h4>
              <ul className="space-y-1">
                {validation.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Acciones rápidas */}
          {validation.quickFixes && validation.quickFixes.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <span className="font-medium">Acciones rápidas:</span>
                <ul className="mt-1 space-y-1">
                  {validation.quickFixes.map((fix: string, index: number) => (
                    <li key={index} className="text-sm">• {fix}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Feedback específico */}
          <div className="space-y-2 text-sm">
            {validation.titleFeedback && (
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">Título:</span> {validation.titleFeedback}
              </div>
            )}
            {validation.descriptionFeedback && (
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">Descripción:</span> {validation.descriptionFeedback}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tips para una buena descripción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Tips para una descripción efectiva
        </h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Menciona las características únicas de la propiedad</li>
          <li>• Describe el barrio y los servicios cercanos</li>
          <li>• Incluye información sobre transporte y accesibilidad</li>
          <li>• Resalta las mejoras o renovaciones recientes</li>
          <li>• Sé honesto y transparente sobre el estado de la propiedad</li>
          <li>• Usa un lenguaje claro y evita términos técnicos complejos</li>
        </ul>
      </div>
    </div>
  )
}