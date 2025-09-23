// app/admin/propiedades/nueva/components/PropertyWizardNavigation.tsx
"use client"

import { ChevronLeft, ChevronRight, CheckCircle2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyWizardNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isSubmitting?: boolean
}

export function PropertyWizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false
}: PropertyWizardNavigationProps) {
  return (
    <div className="flex justify-between">
      {/* Botón Anterior */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {/* Botones de Siguiente/Preview/Enviar según el paso */}
      <div className="flex gap-2">
        {currentStep === totalSteps ? (
          // Último paso - Botón de envío
          <Button 
            type="submit" 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                Enviar para Revisión
                <CheckCircle2 className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : currentStep === 6 ? (
          // Penúltimo paso - Botón de Ver Preview
          <Button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            Ver Preview
            <Eye className="h-4 w-4" />
          </Button>
        ) : (
          // Resto de pasos - Botón Siguiente normal
          <Button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}