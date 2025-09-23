// app/admin/propiedades/nueva/components/steps/StepMultimedia.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues, UploadedFiles } from "../../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormLabel, FormDescription } from "@/components/ui/form"
import { 
  Upload, 
  AlertTriangle, 
  GripVertical, 
  Eye, 
  X, 
  Camera,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Star
} from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"

interface StepMultimediaProps {
  form: UseFormReturn<PropertyFormValues>
  uploadedFiles: UploadedFiles
  handleFileUpload: (type: 'multimedia' | 'documentacion', files: FileList) => void
  removeFile: (type: 'multimedia' | 'documentacion', index: number) => void
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>
}

export function StepMultimedia({ 
  form, 
  uploadedFiles, 
  handleFileUpload, 
  removeFile,
  setUploadedFiles 
}: StepMultimediaProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    setUploadedFiles(prev => {
      const newMultimedia = [...prev.multimedia]
      const draggedItem = newMultimedia[draggedIndex]
      
      newMultimedia.splice(draggedIndex, 1)
      newMultimedia.splice(dropIndex, 0, draggedItem)
      
      return {
        ...prev,
        multimedia: newMultimedia
      }
    })
    
    setDraggedIndex(null)
  }

  // Función para analizar imágenes con IA
  const analyzeImages = async () => {
    if (uploadedFiles.multimedia.length === 0) {
      toast.error("No hay imágenes para analizar")
      return
    }

    setIsAnalyzing(true)
    setShowAnalysis(true)
    
    try {
      // Convertir las imágenes a base64
      const imagesBase64 = await Promise.all(
        uploadedFiles.multimedia.slice(0, 10).map(async (img) => {
          return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              try {
                const base64String = reader.result as string
                const base64Data = base64String.split(',')[1]
                resolve({ 
                  base64: base64Data, 
                  mimeType: img.file.type || 'image/jpeg'
                })
              } catch (error) {
                reject(error)
              }
            }
            reader.onerror = reject
            reader.readAsDataURL(img.file)
          })
        })
      )

      const response = await fetch('/api/ai/analyze-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesBase64 })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al analizar imágenes')
      }

      const analysis = await response.json()
      setAnalysisResult(analysis)
      
      // Toast según el score
      if (analysis.overallScore >= 80) {
        toast.success(`¡Excelentes fotos! Score: ${analysis.overallScore}/100`)
      } else if (analysis.overallScore >= 60) {
        toast.info(`Buenas fotos con espacio para mejorar. Score: ${analysis.overallScore}/100`)
      } else {
        toast.warning(`Las fotos necesitan mejoras. Score: ${analysis.overallScore}/100`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error("Error al analizar las imágenes")
      setShowAnalysis(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Función para obtener el color del score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <FormLabel className="text-lg font-semibold">Fotos de la propiedad</FormLabel>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {uploadedFiles.multimedia.length}/10 imágenes
            </Badge>
            {uploadedFiles.multimedia.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={analyzeImages}
                disabled={isAnalyzing}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analizar con IA
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <FormDescription>
          Sube hasta 10 fotos de alta calidad. Puedes arrastrar para reordenar.
        </FormDescription>

        {/* Área de carga */}
        <div className="mt-4">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="multimedia-upload"
            onChange={(e) => e.target.files && handleFileUpload('multimedia', e.target.files)}
            disabled={uploadedFiles.multimedia.length >= 10}
          />
          <label
            htmlFor="multimedia-upload"
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all block ${
              uploadedFiles.multimedia.length >= 10
                ? 'border-muted-foreground/10 bg-muted/20 cursor-not-allowed'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className="text-center">
              {uploadedFiles.multimedia.length >= 10 ? (
                <>
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Límite máximo de 10 imágenes alcanzado
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para subir fotos o arrastra archivos aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG hasta 10MB cada una • Máximo 10 imágenes
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Resultados del análisis de IA */}
        {showAnalysis && analysisResult && (
          <Card className="mt-6 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Análisis de Imágenes con IA
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalysis(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Score general */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Puntuación General:</span>
              <Badge 
                className={`text-lg px-3 py-1 ${
                  analysisResult.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                  analysisResult.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {analysisResult.overallScore}/100
              </Badge>
            </div>
            
            <Progress value={analysisResult.overallScore} className="h-2" />

            {/* Scores individuales */}
            {analysisResult.individualScores && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Puntuación por imagen:</p>
                <div className="flex gap-2 flex-wrap">
                  {analysisResult.individualScores.map((score: number, idx: number) => (
                    <div key={idx} className="relative">
                      {uploadedFiles.multimedia[idx] && (
                        <div className="relative">
                          <img
                            src={uploadedFiles.multimedia[idx].preview}
                            alt={`Imagen ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <Badge 
                            className={`absolute -bottom-2 -right-2 text-xs ${
                              score >= 80 ? 'bg-green-600' :
                              score >= 60 ? 'bg-yellow-600' :
                              'bg-red-600'
                            } text-white`}
                          >
                            {score}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fortalezas */}
            {analysisResult.strengths && analysisResult.strengths.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-700">✅ Puntos fuertes:</p>
                <ul className="space-y-1">
                  {analysisResult.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendaciones */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-700">💡 Recomendaciones:</p>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fotos faltantes */}
            {analysisResult.missingShots && analysisResult.missingShots.length > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <span className="font-medium">Fotos sugeridas para completar:</span>
                  <ul className="mt-1 space-y-1">
                    {analysisResult.missingShots.map((shot: string, idx: number) => (
                      <li key={idx} className="text-sm">• {shot}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </Card>
        )}

        {/* Grid de imágenes con drag & drop */}
        {uploadedFiles.multimedia.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Arrastra las imágenes para reordenar
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.multimedia.map((imageObj, index) => (
                <div
                  key={imageObj.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative group cursor-move transition-all ${
                    draggedIndex === index
                      ? 'opacity-50 scale-95'
                      : 'hover:scale-105'
                  }`}
                >
                  {/* Imagen preview */}
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary/30">
                    <img
                      src={imageObj.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay con controles */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={() => {
                          window.open(imageObj.preview, '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile('multimedia', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Indicador de posición */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>

                  {/* Indicador de imagen principal */}
                  {index === 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                      <Star className="h-3 w-3 text-white fill-white" />
                    </div>
                  )}
                  
                  {/* Handle de arrastre */}
                  {index !== 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-white" />
                    </div>
                  )}

                  {/* Score individual si existe */}
                  {analysisResult?.individualScores?.[index] && (
                    <div className={`absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold ${
                      getScoreColor(analysisResult.individualScores[index])
                    }`}>
                      {analysisResult.individualScores[index]}
                    </div>
                  )}
                  
                  {/* Nombre del archivo */}
                  <p className="text-xs mt-2 truncate text-center px-1" title={imageObj.file.name}>
                    {imageObj.file.name}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Consejos para mejores fotos
                  </p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• La primera imagen será la foto principal (marcada con ⭐)</li>
                    <li>• Incluye fotos de sala, cocina, dormitorios y baños</li>
                    <li>• Usa buena iluminación natural cuando sea posible</li>
                    <li>• Evita fotos borrosas o muy oscuras</li>
                    <li>• Ordena y limpia los espacios antes de fotografiar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}