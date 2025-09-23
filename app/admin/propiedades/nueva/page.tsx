// app/admin/propiedades/nueva/page.tsx
"use client"

import React from "react"
import { usePropertyWizard } from "./hooks/usePropertyWizard"
import { PropertyWizardHeader } from "./components/PropertyWizardHeader"
import { PropertyWizardStepper } from "./components/PropertyWizardStepper"
import { PropertyWizardNavigation } from "./components/PropertyWizardNavigation"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { STEPS } from "./constants"

// Importar todos los pasos
import { StepInformation } from "./components/steps/StepInformation"
import { StepLocation } from "./components/steps/StepLocation"
import { StepFeatures } from "./components/steps/StepFeatures"
import { StepDescription } from "./components/steps/StepDescription"
import { StepMultimedia } from "./components/steps/StepMultimedia"
import { StepDocumentation } from "./components/steps/StepDocumentation"
import { StepPreview } from "./components/steps/StepPreview"

const stepComponents = {
  1: StepInformation,
  2: StepLocation,
  3: StepFeatures,
  4: StepDescription,
  5: StepMultimedia,
  6: StepDocumentation,
  7: StepPreview,
}

export default function NuevaPropiedadPage() {
  const wizard = usePropertyWizard()
  const CurrentStepComponent = stepComponents[wizard.currentStep as keyof typeof stepComponents]
  const currentStepConfig = STEPS[wizard.currentStep - 1]

  return (
    <div className="min-h-full">
      <div className="container mx-auto p-6 max-w-4xl">
        <PropertyWizardHeader />
        
        <PropertyWizardStepper
          currentStep={wizard.currentStep}
          completedSteps={wizard.completedSteps}
          hasStepErrors={wizard.hasStepErrors}
          isStepComplete={wizard.isStepComplete}
          goToStep={wizard.goToStep}
        />

        <Form {...wizard.form}>
          <form onSubmit={wizard.form.handleSubmit(wizard.onSubmit)} className="space-y-6">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader className="pb-4 px-0 md:px-6">
                <CardTitle className="flex items-center gap-2">
                  <currentStepConfig.icon className="h-5 w-5" />
                  {currentStepConfig.title}
                </CardTitle>
                <Separator className="mt-4" />
              </CardHeader>
              
              <CardContent className="space-y-6 px-0 md:px-6">
                <CurrentStepComponent
                  form={wizard.form}
                  uploadedFiles={wizard.uploadedFiles}
                  setUploadedFiles={wizard.setUploadedFiles}
                  handleFileUpload={wizard.handleFileUpload}
                  removeFile={wizard.removeFile}
                  setCurrentStep={wizard.currentStep === 7 ? wizard.goToStep : undefined}
                />
              </CardContent>
            </Card>

            <PropertyWizardNavigation
              currentStep={wizard.currentStep}
              totalSteps={STEPS.length}
              onPrevious={wizard.prevStep}
              onNext={wizard.nextStep}
              isSubmitting={wizard.isSubmitting}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}