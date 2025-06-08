// components/debug-info.tsx
"use client"

import { useState } from "react"
import { Bug, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DebugInfoProps {
  data: any
  title?: string
}

export default function DebugInfo({ data, title = "Debug Info" }: DebugInfoProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bg-orange-100 border border-orange-300 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-orange-200">
          <div className="flex items-center gap-2">
            <Bug size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-800">{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
          >
            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
        </div>
        
        {isVisible && (
          <div className="p-3 max-h-96 overflow-auto">
            <pre className="text-xs text-orange-800 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}