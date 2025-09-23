// app/admin/propiedades/nueva/components/steps/StepPreview.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues, UploadedFiles } from "../../types"
import { MOCK_CLIENTS } from "../../constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Camera,
  MapPin,
  Square,
  Home,
  Bed,
  Bath,
  Car,
  Building2,
  Star,
  ChevronLeft
} from "lucide-react"

interface StepPreviewProps {
  form: UseFormReturn<PropertyFormValues>
  uploadedFiles: UploadedFiles
  setCurrentStep?: (step: number) => void
}

export function StepPreview({ form, uploadedFiles, setCurrentStep }: StepPreviewProps) {
  return (
    <div className="space-y-8">
      {/* Header del Preview */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
          <CheckCircle2 className="h-4 w-4" />
          ¡Formulario completado!
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preview de tu publicación
        </h2>
        <p className="text-muted-foreground">
          Revisa cómo se verá tu propiedad antes de publicar
        </p>
      </div>

      {/* Preview Card - Simula cómo se vería la publicación */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Carousel de imágenes */}
          {uploadedFiles.multimedia.length > 0 ? (
            <div className="relative h-80 bg-muted">
              <img
                src={uploadedFiles.multimedia[0].preview}
                alt="Imagen principal"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                1 / {uploadedFiles.multimedia.length}
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 hover:bg-red-700 text-white">
                  {form.watch("operacion") === "venta" ? "VENTA" : 
                   form.watch("operacion") === "alquiler" ? "ALQUILER" : "ALQUILER TEMPORAL"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="h-80 bg-muted flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Sin imágenes</p>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Título y precio */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {form.watch("titulo") || "Título de la propiedad"}
              </h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {form.watch("direccion") || "Dirección"}, {form.watch("ciudad") || "Ciudad"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {form.watch("moneda") === "USD" ? "US$" : "$"} {
                  form.watch("precio") ? 
                  Number(form.watch("precio")).toLocaleString('es-AR') : 
                  "Precio"
                }
              </p>
              {form.watch("expensas") && (
                <p className="text-sm text-muted-foreground">
                  + ${Number(form.watch("expensas")).toLocaleString('es-AR')} expensas
                </p>
              )}
            </div>
          </div>

          {/* Características */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            {form.watch("superficieTotales") && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{form.watch("superficieTotales")} m²</span>
              </div>
            )}
            {form.watch("ambientes") && (
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{form.watch("ambientes")} amb.</span>
              </div>
            )}
            {form.watch("dormitorios") && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{form.watch("dormitorios")} dorm.</span>
              </div>
            )}
            {form.watch("baños") && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{form.watch("baños")} baños</span>
              </div>
            )}
            {form.watch("cocheras") && form.watch("cocheras") !== "0" && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{form.watch("cocheras")} coch.</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          {form.watch("descripcion") && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Descripción</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {form.watch("descripcion")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información general */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">
                {form.watch("cliente") ? 
                  MOCK_CLIENTS.find(c => c.id === form.watch("cliente"))?.name : 
                  "No seleccionado"
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">{form.watch("tipo") || "No especificado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operación:</span>
              <span className="font-medium capitalize">{form.watch("operacion") || "No especificado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Antigüedad:</span>
              <span className="font-medium">{form.watch("antiguedad") || "No especificado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orientación:</span>
              <span className="font-medium capitalize">{form.watch("orientacion") || "No especificado"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Multimedia y documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Archivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Imágenes:</span>
              <span className="font-medium">
                {uploadedFiles.multimedia.length} / 10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documentos:</span>
              <span className="font-medium">
                {uploadedFiles.documentacion.length}
              </span>
            </div>
            
            {/* Mini preview de imágenes */}
            {uploadedFiles.multimedia.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Vista previa de imágenes:</p>
                <div className="flex gap-1 flex-wrap">
                  {uploadedFiles.multimedia.slice(0, 5).map((img, idx) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      {idx === 0 && (
                        <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  ))}
                  {uploadedFiles.multimedia.length > 5 && (
                    <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{uploadedFiles.multimedia.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm">Dirección:</span>
              <p className="font-medium">{form.watch("direccion") || "No especificada"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Barrio:</span>
              <p className="font-medium">{form.watch("barrio") || "No especificado"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Ciudad:</span>
              <p className="font-medium">{form.watch("ciudad") || "No especificada"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Provincia:</span>
              <p className="font-medium capitalize">{form.watch("provincia") || "No especificada"}</p>
            </div>
          </div>
          {form.watch("piso") || form.watch("departamento") ? (
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                {form.watch("piso") && (
                  <div>
                    <span className="text-muted-foreground text-sm">Piso:</span>
                    <p className="font-medium">{form.watch("piso")}</p>
                  </div>
                )}
                {form.watch("departamento") && (
                  <div>
                    <span className="text-muted-foreground text-sm">Departamento:</span>
                    <p className="font-medium">{form.watch("departamento")}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Características adicionales */}
      {(form.watch("estadoPropiedad")?.length || form.watch("caracteristicasPropiedad")?.length) ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Características adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch("estadoPropiedad")?.length ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Estado de la propiedad:</p>
                <div className="flex flex-wrap gap-2">
                  {form.watch("estadoPropiedad")?.map((estado) => (
                    <Badge key={estado} variant="secondary">
                      {estado}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            
            {form.watch("caracteristicasPropiedad")?.length ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Amenidades:</p>
                <div className="flex flex-wrap gap-2">
                  {form.watch("caracteristicasPropiedad")?.map((caracteristica) => (
                    <Badge key={caracteristica} variant="outline">
                      {caracteristica}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* Botón de edición (opcional) */}
      {setCurrentStep && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a editar información
          </Button>
        </div>
      )}
    </div>
  )
}