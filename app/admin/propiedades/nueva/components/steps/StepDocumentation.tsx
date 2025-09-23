// app/admin/propiedades/nueva/components/steps/StepDocumentation.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { PropertyFormValues, UploadedFiles } from "../../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FormLabel, FormDescription } from "@/components/ui/form"
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  ExternalLink 
} from "lucide-react"

interface StepDocumentationProps {
  form: UseFormReturn<PropertyFormValues>
  uploadedFiles: UploadedFiles
  handleFileUpload: (type: 'multimedia' | 'documentacion', files: FileList) => void
  removeFile: (type: 'multimedia' | 'documentacion', index: number) => void
}

export function StepDocumentation({ 
  form, 
  uploadedFiles, 
  handleFileUpload, 
  removeFile 
}: StepDocumentationProps) {
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('image')) return Image
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileText
    if (fileType.includes('word') || fileType.includes('text')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <FormLabel className="text-lg font-semibold">Documentos de la propiedad</FormLabel>
          <Badge variant="outline" className="text-xs">
            {uploadedFiles.documentacion.length} documento{uploadedFiles.documentacion.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <FormDescription>
          Sube documentos legales, planos, escrituras, etc. (opcional)
        </FormDescription>

        {/* Área de carga */}
        <div className="mt-4">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
            className="hidden"
            id="documentacion-upload"
            onChange={(e) => e.target.files && handleFileUpload('documentacion', e.target.files)}
          />
          <label
            htmlFor="documentacion-upload"
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all block"
          >
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Haz clic para subir documentos o arrastra archivos aquí
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX, XLS, TXT, JPG hasta 25MB cada uno
              </p>
            </div>
          </label>
        </div>

        {/* Lista de documentos */}
        {uploadedFiles.documentacion.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Documentos subidos
            </h4>
            <div className="space-y-3">
              {uploadedFiles.documentacion.map((docObj, index) => {
                const FileIcon = getFileIcon(docObj.type || '')
                return (
                  <div 
                    key={docObj.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={docObj.file.name}>
                          {docObj.file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(docObj.file.size)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {docObj.type?.split('/')[1]?.toUpperCase() || 'Archivo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const url = URL.createObjectURL(docObj.file)
                          window.open(url, '_blank')
                          setTimeout(() => URL.revokeObjectURL(url), 1000)
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFile('documentacion', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <File className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Documentos recomendados
                  </p>
                  <ul className="text-xs text-amber-700 mt-1 space-y-1">
                    <li>• Escritura o boleto de compraventa</li>
                    <li>• Planos aprobados por la municipalidad</li>
                    <li>• Certificado de dominio actualizado</li>
                    <li>• Constancia de servicios (luz, gas, agua)</li>
                    <li>• Expensas del consorcio (si aplica)</li>
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