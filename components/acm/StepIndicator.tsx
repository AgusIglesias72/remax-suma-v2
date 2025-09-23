'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps?: number[];
}

export function StepIndicator({ currentStep, completedSteps = [] }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Búsqueda' },
    { number: 2, label: 'Selección' },
    { number: 3, label: 'Análisis' }
  ];

  return (
    <div className="flex items-center gap-3">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200",
                completedSteps.includes(step.number)
                  ? "bg-green-500 text-white"
                  : currentStep === step.number
                  ? "bg-blue-600 text-white shadow-lg scale-110"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {completedSteps.includes(step.number) ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            
            {/* Step Label - Hidden on mobile */}
            <span 
              className={cn(
                "ml-2 text-sm font-medium hidden lg:block",
                currentStep === step.number ? "text-blue-600" : 
                completedSteps.includes(step.number) ? "text-green-600" : 
                "text-gray-500"
              )}
            >
              {step.label}
            </span>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 lg:w-20 h-0.5 mx-3 transition-all duration-300",
                completedSteps.includes(step.number)
                  ? "bg-green-500"
                  : currentStep > step.number
                  ? "bg-blue-600"
                  : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}