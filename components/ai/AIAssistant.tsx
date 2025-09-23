// components/ai/AIAssistant.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface AIAssistantProps {
  propertyData: any
  onDescriptionGenerated: (description: string) => void
}

export function AIAssistant({ propertyData, onDescriptionGenerated }: AIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [validation, setValidation] = useState<any>(null)

  const generateDescription = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyData })
      })

      if (response.status === 429) {
        toast.error("Has alcanzado el límite de solicitudes. Intenta más tarde.")
        return
      }

      const { description } = await response.json()
      onDescriptionGenerated(description)
      toast.success("¡Descripción generada con éxito!")
    } catch (error) {
      toast.error("Error al generar la descripción")
    } finally {
      setIsGenerating(false)
    }
  }

  const validateListing = async () => {
    try {
      const response = await fetch('/api/ai/validate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: propertyData.titulo,
          description: propertyData.descripcion,
          images: propertyData.images || [],
          propertyData
        })
      })

      const validation = await response.json()
      setValidation(validation)
    } catch (error) {
      toast.error("Error al validar la publicación")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border-purple-200 bg-purple-50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Asistente IA</h3>
        </div>

        <div className="space-y-3">
          <Button
            onClick={generateDescription}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Descripción con IA
              </>
            )}
          </Button>

          <Button
            onClick={validateListing}
            variant="outline"
            className="w-full"
          >
            Validar Publicación
          </Button>
        </div>

        {validation && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold">
                Puntuación: {validation.score}/100
              </div>
            </div>
            
            {validation.improvements?.map((improvement: string, index: number) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <span className="text-gray-700">{improvement}</span>
              </div>
            ))}

            {validation.strengths?.map((strength: string, index: number) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}