// app/admin/propiedades/nueva/hooks/usePropertyWizard.ts
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  PropertyFormValues, 
  UploadedFiles,
  LocationData,
  NewClientForm,
  propertySchema 
} from "../types"
import { STEPS } from "../constants"

export const usePropertyWizard = () => {
  const router = useRouter()
  
  // Estado del wizard
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado de modales y sheets
  const [mobileStepperOpen, setMobileStepperOpen] = useState(false)
  const [clientSelectorOpen, setClientSelectorOpen] = useState(false)
  const [newClientSheetOpen, setNewClientSheetOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  
  // Estado de ubicación
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)
  
  // Estado de archivos
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    multimedia: [],
    documentacion: []
  })
  
  // Estado del formulario de nuevo cliente
  const [newClientForm, setNewClientForm] = useState<NewClientForm>({
    nombre: "",
    apellido: "",
    dni: "",
    celular: "",
    email: "",
    genero: "femenino",
    tipoCliente: "activo",
    origen: "",
    categoria: ""
  })

  // Formulario principal con react-hook-form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      cliente: "",
      tipo: "",
      operacion: "venta",
      precio: "",
      moneda: "ARS",
      expensas: "",
      fechaDisponibilidad: new Date(),
      fechaVencimiento: addDays(new Date(), 120),
      titulo: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      barrio: "",
      piso: "",
      departamento: "",
      ambientes: "",
      dormitorios: "",
      baños: "",
      superficieTotales: "",
      superficieCubiertos: "",
      superficieDescubiertos: "",
      cocheras: "",
      antiguedad: "",
      orientacion: "",
      contratoExclusivo: false,
      cartel: false,
      ofreceFinanciamiento: false,
      aptoCredito: false,
      aptoComercial: false,
      aptoProfesional: false,
      aptoMovilidadReducida: false,
      pozo: false,
      countryBarrioPrivado: false,
      estadoPropiedad: [],
      caracteristicasPropiedad: [],
      descripcion: "",
      caracteristicas: [],
    },
  })

  const { formState: { errors } } = form

  // Calcular superficie total automáticamente
  const superficieCubiertos = Number(form.watch("superficieCubiertos")) || 0
  const superficieDescubiertos = Number(form.watch("superficieDescubiertos")) || 0
  const superficieTotal = superficieCubiertos + superficieDescubiertos

  // Actualizar el campo total cuando cambien los otros
  useEffect(() => {
    if (superficieTotal > 0) {
      form.setValue("superficieTotales", superficieTotal.toString())
    } else {
      form.setValue("superficieTotales", "")
    }
  }, [superficieCubiertos, superficieDescubiertos, superficieTotal, form])

  // Ocultar scrollbar del navegador al montar el componente
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Cleanup de URLs de preview al desmontar
  useEffect(() => {
    return () => {
      uploadedFiles.multimedia.forEach(imageObj => {
        if (imageObj.preview) {
          URL.revokeObjectURL(imageObj.preview)
        }
      })
    }
  }, [])

  // Verificar si el paso actual tiene errores
  const hasStepErrors = useCallback((stepId: number) => {
    const step = STEPS.find(s => s.id === stepId)
    if (!step) return false
    return step.fields.some(field => errors[field as keyof typeof errors])
  }, [errors])

  // Verificar si el paso está completo
  const isStepComplete = useCallback((stepId: number) => {
    return completedSteps.includes(stepId)
  }, [completedSteps])

  // Navegación entre pasos
  const goToStep = useCallback((stepId: number) => {
    setCurrentStep(stepId)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length) {
      if (!hasStepErrors(currentStep)) {
        setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, hasStepErrors])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // Manejo de archivos
  const handleFileUpload = useCallback((
    stepType: 'multimedia' | 'documentacion',
    files: FileList
  ) => {
    const newFiles = Array.from(files)
    
    if (stepType === 'multimedia') {
      const currentCount = uploadedFiles.multimedia.length
      const availableSlots = 10 - currentCount
      const filesToAdd = newFiles.slice(0, availableSlots)
      
      if (newFiles.length > availableSlots) {
        toast.warning(`Solo puedes subir ${availableSlots} imágenes más. Límite máximo: 10 imágenes.`)
      }
      
      const multimediaFiles = filesToAdd.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }))
      
      setUploadedFiles(prev => ({
        ...prev,
        multimedia: [...prev.multimedia, ...multimediaFiles]
      }))
    } else {
      const documentFiles = newFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        type: file.type || 'application/octet-stream'
      }))
      
      setUploadedFiles(prev => ({
        ...prev,
        documentacion: [...prev.documentacion, ...documentFiles]
      }))
    }
  }, [uploadedFiles])

  const removeFile = useCallback((
    stepType: 'multimedia' | 'documentacion',
    index: number
  ) => {
    if (stepType === 'multimedia') {
      setUploadedFiles(prev => {
        const fileToRemove = prev.multimedia[index]
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview)
        }
        return {
          ...prev,
          multimedia: prev.multimedia.filter((_, i) => i !== index)
        }
      })
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        documentacion: prev.documentacion.filter((_, i) => i !== index)
      }))
    }
  }, [])

  // Funciones para drag & drop de imágenes
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
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
  }, [draggedIndex])

  // Submit del formulario
  const onSubmit = useCallback(async (data: PropertyFormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Datos del formulario:", data)
      console.log("Archivos subidos:", uploadedFiles)
      
      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("¡Propiedad creada exitosamente!", {
        description: "La propiedad ha sido enviada para revisión"
      })
      
      router.push("/admin/propiedades")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al crear la propiedad", {
        description: "Por favor, intente nuevamente"
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [uploadedFiles, router])

  // Función para obtener el icono correcto según el tipo de archivo
  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.includes('pdf')) return 'FileText'
    if (fileType.includes('image')) return 'Image'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'FileText'
    if (fileType.includes('word') || fileType.includes('text')) return 'FileText'
    return 'File'
  }, [])

  // Función para formatear el tamaño del archivo
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  return {
    // Estado del wizard
    currentStep,
    completedSteps,
    draggedIndex,
    isSubmitting,
    
    // Estado de modales
    mobileStepperOpen,
    setMobileStepperOpen,
    clientSelectorOpen,
    setClientSelectorOpen,
    newClientSheetOpen,
    setNewClientSheetOpen,
    selectedClient,
    setSelectedClient,
    
    // Estado de ubicación
    selectedLocation,
    setSelectedLocation,
    apiDebugInfo,
    setApiDebugInfo,
    
    // Estado de archivos
    uploadedFiles,
    setUploadedFiles,
    
    // Estado de nuevo cliente
    newClientForm,
    setNewClientForm,
    
    // Formulario principal
    form,
    errors,
    
    // Valores calculados
    superficieCubiertos,
    superficieDescubiertos,
    superficieTotal,
    
    // Métodos de navegación
    goToStep,
    nextStep,
    prevStep,
    
    // Métodos de validación
    hasStepErrors,
    isStepComplete,
    
    // Métodos de archivos
    handleFileUpload,
    removeFile,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    
    // Métodos de utilidad
    getFileIcon,
    formatFileSize,
    
    // Submit
    onSubmit
  }
}