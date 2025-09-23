// app/admin/propiedades/nueva/components/PropertyWizardStepper.tsx
"use client"

import React, { useState } from "react"
import { CheckCircle2, AlertCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { STEPS } from "../constants"

interface PropertyWizardStepperProps {
  currentStep: number
  completedSteps: number[]
  hasStepErrors: (stepId: number) => boolean
  isStepComplete: (stepId: number) => boolean
  goToStep: (stepId: number) => void
}

export function PropertyWizardStepper({
  currentStep,
  completedSteps,
  hasStepErrors,
  isStepComplete,
  goToStep
}: PropertyWizardStepperProps) {
  const [mobileStepperOpen, setMobileStepperOpen] = useState(false)

  return (
    <>
      {/* Stepper Navigation - Desktop */}
      <div className="mb-8 hidden md:block">
        <div className="relative">
          {/* Línea de conexión que va de extremo a extremo */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted" />

          <div className="flex justify-between relative">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = isStepComplete(step.id)
              const hasErrors = hasStepErrors(step.id)

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 
                      transition-colors bg-background
                      ${isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : hasErrors
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-muted-foreground bg-background text-muted-foreground"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : hasErrors ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </button>
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Línea separadora */}
        <Separator className="mt-8" />
      </div>

      {/* Stepper Navigation - Mobile */}
      <div className="mb-6 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors 
              border-primary bg-primary text-primary-foreground
            `}>
              {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5" })}
            </div>
            <div>
              <p className="font-medium text-primary">{STEPS[currentStep - 1].title}</p>
              <p className="text-sm text-muted-foreground">Paso {currentStep} de {STEPS.length}</p>
            </div>
          </div>

          <Sheet open={mobileStepperOpen} onOpenChange={setMobileStepperOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="pb-0">
                <SheetTitle>Pasos del formulario</SheetTitle>
                <Separator className="mt-4" />
              </SheetHeader>
              <div className="px-2 space-y-2 mt-4">
                {STEPS.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = isStepComplete(step.id)
                  const hasErrors = hasStepErrors(step.id)

                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        goToStep(step.id)
                        setMobileStepperOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-4 px-4 py-2 rounded-lg  
                        transition-colors text-left
                        hover:bg-primary/5
                        ${isActive
                          ? "border-primary bg-primary/5 text-primary"
                          : isCompleted
                            ? "border-green-200 bg-green-50 text-green-700"
                            : hasErrors
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-muted hover:border-muted-foreground"
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center 
                        justify-center transition-colors bg-background border-2
                        ${isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : hasErrors
                              ? "border-red-500 bg-red-50 text-red-500"
                              : "border-muted-foreground bg-background text-muted-foreground"
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : hasErrors ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm opacity-70">{step.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Separator className="mt-6" />
      </div>
    </>
  )
}