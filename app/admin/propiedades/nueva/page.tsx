"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  MapPin,
  Building2,
  Camera,
  File,
  Menu,
  Plus,
  Search,
  Check,
  ChevronsUpDown,
  User,
  Users,
  Globe,
  Megaphone,
  Share2,
  Tv,
  MapPin as MapPinIcon,
  Link,
  ShoppingCart,
  Home,
  TrendingUp,
  Calendar as CalendarIcon,
  DollarSign,
  Bed,
  Bath,
  Car,
  Ruler,
  Warehouse,
  Compass,
  Clock,
  Square,
  ArrowUpDown,
  Sparkles,
  GripVertical,
  AlertTriangle,
  Eye,
  Download,
  Image,
  FileText,
  Star,
  ExternalLink
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import Flag from "react-world-flags"
import React from "react"
import { SearchAutocomplete } from "@/components/search/google-autocomplete"
import GoogleMapComponent from "@/components/maps/google-map"

// Schema de validación
const propertySchema = z.object({
  // Información básica
  cliente: z.string().min(1, "El cliente es requerido"),
  tipo: z.string().min(1, "El tipo de propiedad es requerido"),
  operacion: z.string().min(1, "El tipo de operación es requerido"),
  precio: z.string().min(1, "El precio es requerido"),
  moneda: z.string().min(1, "La moneda es requerida"),
  expensas: z.string().optional(),
  fechaDisponibilidad: z.date().optional(),
  fechaVencimiento: z.date().optional(),

  // Ubicación
  direccion: z.string().min(1, "La dirección es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  provincia: z.string().min(1, "La provincia es requerida"),
  codigoPostal: z.string().min(1, "El código postal es requerido"),
  barrio: z.string().optional(),
  piso: z.string().optional(),
  departamento: z.string().optional(),

  // Características principales
  ambientes: z.string().min(1, "Los ambientes son requeridos"),
  dormitorios: z.string().min(1, "Los dormitorios son requeridos"),
  baños: z.string().min(1, "Los baños son requeridos"),
  superficieTotales: z.string().min(1, "La superficie total es requerida"),
  superficieCubiertos: z.string().optional(),
  superficieDescubiertos: z.string().optional(),
  cocheras: z.string().optional(),
  antiguedad: z.string().optional(),
  orientacion: z.string().optional(),

  // Detalles de la propiedad (Si/No)
  contratoExclusivo: z.boolean().optional(),
  cartel: z.boolean().optional(),
  ofreceFinanciamiento: z.boolean().optional(),
  aptoCredito: z.boolean().optional(),
  aptoComercial: z.boolean().optional(),
  aptoProfesional: z.boolean().optional(),
  aptoMovilidadReducida: z.boolean().optional(),
  pozo: z.boolean().optional(),
  countryBarrioPrivado: z.boolean().optional(),

  // Estado de la propiedad
  estadoPropiedad: z.array(z.string()).optional(),

  // Características específicas
  caracteristicasPropiedad: z.array(z.string()).optional(),

  // Descripción
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  caracteristicas: z.array(z.string()).optional(),

  // Estado interno - no se valida desde el form
  multimedia: z.array(z.any()).optional(),
  documentacion: z.array(z.any()).optional(),
})

type PropertyFormValues = z.infer<typeof propertySchema>

const steps = [
  {
    id: 1,
    title: "Información",
    description: "Datos básicos de la propiedad",
    icon: Building2,
    fields: ["cliente", "operacion", "tipo", "precio", "moneda", "expensas", "fechaDisponibilidad", "fechaVencimiento"]
  },
  {
    id: 2,
    title: "Ubicación",
    description: "Dirección y localización",
    icon: MapPin,
    fields: ["direccion", "ciudad", "provincia", "codigoPostal", "barrio"]
  },
  {
    id: 3,
    title: "Características",
    description: "Detalles técnicos",
    icon: Building2,
    fields: ["superficie", "dormitorios", "baños", "cocheras", "antiguedad", "orientacion"]
  },
  {
    id: 4,
    title: "Descripción",
    description: "Información detallada",
    icon: FileText,
    fields: ["titulo", "descripcion", "caracteristicas"]
  },
  {
    id: 5,
    title: "Multimedia",
    description: "Fotos y videos",
    icon: Camera,
    fields: ["multimedia"]
  },
  {
    id: 6,
    title: "Documentación",
    description: "Documentos legales",
    icon: File,
    fields: ["documentacion"]
  },
  {
    id: 7,
    title: "Preview",
    description: "Revisión y confirmación",
    icon: Eye,
    fields: []
  }
]

// Datos mock de clientes
const mockClients = [
  { id: "1", name: "Roberto Martínez", dni: "12345678", email: "roberto@email.com", phone: "+54 11 1234-5678" },
  { id: "2", name: "Ana Rodríguez", dni: "23456789", email: "ana@email.com", phone: "+54 11 2345-6789" },
  { id: "3", name: "Luis González", dni: "34567890", email: "luis@email.com", phone: "+54 11 3456-7890" },
  { id: "4", name: "María García", dni: "45678901", email: "maria@email.com", phone: "+54 11 4567-8901" },
  { id: "5", name: "Carlos López", dni: "56789012", email: "carlos@email.com", phone: "+54 11 5678-9012" }
]

export default function NuevaPropiedadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ 
    multimedia: Array<{ file: File; preview: string; id: string }>; 
    documentacion: Array<{ file: File; id: string; type: string }>
  }>({
    multimedia: [],
    documentacion: []
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [mobileStepperOpen, setMobileStepperOpen] = useState(false)
  const [clientSelectorOpen, setClientSelectorOpen] = useState(false)
  const [newClientSheetOpen, setNewClientSheetOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number, address: string } | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)
  const [newClientForm, setNewClientForm] = useState({
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

  // Ocultar scrollbar del navegador al montar el componente
  React.useEffect(() => {
    // Agregar clase para ocultar scrollbar
    document.body.style.overflow = 'hidden'

    // Cleanup: restaurar scrollbar al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Cleanup de URLs de preview al desmontar el componente
  React.useEffect(() => {
    return () => {
      // Limpiar todas las URLs de preview para evitar memory leaks
      uploadedFiles.multimedia.forEach(imageObj => {
        if (imageObj.preview) {
          URL.revokeObjectURL(imageObj.preview)
        }
      })
    }
  }, [])

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
  React.useEffect(() => {
    if (superficieTotal > 0) {
      form.setValue("superficieTotales", superficieTotal.toString())
    } else {
      form.setValue("superficieTotales", "")
    }
  }, [superficieCubiertos, superficieDescubiertos, superficieTotal, form])

  // Verificar si el paso actual tiene errores
  const hasStepErrors = (stepId: number) => {
    const step = steps.find(s => s.id === stepId)
    if (!step) return false
    return step.fields.some(field => errors[field as keyof typeof errors])
  }

  // Verificar si el paso está completo
  const isStepComplete = (stepId: number) => {
    return completedSteps.includes(stepId)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      // Marcar el paso actual como completado si no tiene errores
      if (!hasStepErrors(currentStep)) {
        setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId)
  }

  const handleFileUpload = (stepType: 'multimedia' | 'documentacion', files: FileList) => {
    const newFiles = Array.from(files)
    
    if (stepType === 'multimedia') {
      // Verificar límite de 10 imágenes
      const currentCount = uploadedFiles.multimedia.length
      const availableSlots = 10 - currentCount
      const filesToAdd = newFiles.slice(0, availableSlots)
      
      if (newFiles.length > availableSlots) {
        alert(`Solo puedes subir ${availableSlots} imágenes más. Límite máximo: 10 imágenes.`)
      }
      
      // Crear objetos con preview para imágenes
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
      // Para documentación, crear objetos con metadata
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
  }

  const removeFile = (stepType: 'multimedia' | 'documentacion', index: number) => {
    if (stepType === 'multimedia') {
      setUploadedFiles(prev => {
        const fileToRemove = prev.multimedia[index]
        // Limpiar URL del preview para evitar memory leaks
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
  }

  // Funciones para drag & drop de imágenes
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
      
      // Remover el item de la posición original
      newMultimedia.splice(draggedIndex, 1)
      
      // Insertar en la nueva posición
      newMultimedia.splice(dropIndex, 0, draggedItem)
      
      return {
        ...prev,
        multimedia: newMultimedia
      }
    })
    
    setDraggedIndex(null)
  }

  // Función para obtener el icono correcto según el tipo de archivo
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('image')) return Image
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileText
    if (fileType.includes('word') || fileType.includes('text')) return FileText
    return File
  }

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const onSubmit = (data: PropertyFormValues) => {
    console.log("Datos del formulario:", data)
    console.log("Archivos subidos:", uploadedFiles)
    // Aquí iría la lógica para enviar los datos al backend
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Información
        return (
          <div className="space-y-6">
            {/* Selector de Cliente */}
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Popover open={clientSelectorOpen} onOpenChange={setClientSelectorOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value
                            ? mockClients.find((client) => client.id === field.value)?.name
                            : "Seleccionar cliente..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar por nombre o DNI..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                          <CommandGroup>
                            {mockClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={`${client.name} ${client.dni}`}
                                onSelect={() => {
                                  form.setValue("cliente", client.id)
                                  setSelectedClient(client.id)
                                  setClientSelectorOpen(false)
                                }}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <User className="h-4 w-4" />
                                  <div className="flex-1">
                                    <p className="font-medium">{client.name}</p>
                                    <p className="text-sm text-muted-foreground">DNI: {client.dni}</p>
                                  </div>
                                  <Check
                                    className={`ml-auto h-4 w-4 ${field.value === client.id ? "opacity-100" : "opacity-0"
                                      }`}
                                  />
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <Separator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                setClientSelectorOpen(false)
                                setNewClientSheetOpen(true)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Nuevo Cliente
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Operación - Tabs */}
            <FormField
              control={form.control}
              name="operacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de operación *</FormLabel>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="venta">Venta</TabsTrigger>
                        <TabsTrigger value="alquiler">Alquiler</TabsTrigger>
                        <TabsTrigger value="alquiler-temporal">Alquiler Temporal</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Propiedad */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de propiedad *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full min-w-[300px]">
                        <SelectValue placeholder="Seleccionar tipo de propiedad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="departamento">🏢 Departamento</SelectItem>
                      <SelectItem value="casa">🏠 Casa</SelectItem>
                      <SelectItem value="ph">🏘️ PH</SelectItem>
                      <SelectItem value="local">🏪 Local Comercial</SelectItem>
                      <SelectItem value="oficina">🏢 Oficina</SelectItem>
                      <SelectItem value="terreno">🌍 Terreno</SelectItem>
                      <SelectItem value="quinta">🌳 Quinta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio con Tabs de Moneda */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio *</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Tabs
                          value={form.watch("moneda")}
                          onValueChange={(value) => form.setValue("moneda", value)}
                          className="w-auto"
                        >
                          <TabsList className="grid grid-cols-2 h-11 rounded-r-none border-r">
                            <TabsTrigger value="ARS" className="flex items-center gap-2">
                              <Flag code="AR" className="w-4 h-3" />
                              ARS
                            </TabsTrigger>
                            <TabsTrigger value="USD" className="flex items-center gap-2">
                              <Flag code="US" className="w-4 h-3" />
                              USD
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                        <Input
                          type="text"
                          placeholder={form.watch("moneda") === "ARS" ? "Ej: 45.000.000" : "Ej: 450.000"}
                          className="h-11 text-lg rounded-l-none flex-1"
                          value={field.value ? Number(field.value).toLocaleString('es-AR') : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '')
                            field.onChange(value)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expensas */}
            <FormField
              control={form.control}
              name="expensas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expensas (opcional)</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted h-11">
                        <Flag code="AR" className="w-4 h-3 mr-2" />
                        <span className="text-sm font-medium">ARS</span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Ej: 35.000"
                        className="h-11 rounded-l-none flex-1"
                        value={field.value ? Number(field.value).toLocaleString('es-AR') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(value)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Gastos de mantenimiento del edificio o complejo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaDisponibilidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de disponibilidad</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full h-11 justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                              }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Cuándo estará disponible la propiedad
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de vencimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full h-11 justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                              }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Cuándo vence la publicación
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sheet para Nuevo Cliente */}
            <Sheet open={newClientSheetOpen} onOpenChange={setNewClientSheetOpen}>
              <SheetContent side="right" className="w-full max-w-none overflow-y-auto">
                <SheetHeader className="px-6 py-4">
                  <SheetTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Nuevo Cliente
                  </SheetTitle>
                  <Separator className="mt-4" />
                </SheetHeader>
                <div className="px-6 pb-6 space-y-8">
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información Personal</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre *</Label>
                          <Input
                            id="nombre"
                            placeholder="Nombre"
                            value={newClientForm.nombre}
                            onChange={(e) => setNewClientForm(prev => ({ ...prev, nombre: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido *</Label>
                          <Input
                            id="apellido"
                            placeholder="Apellido"
                            value={newClientForm.apellido}
                            onChange={(e) => setNewClientForm(prev => ({ ...prev, apellido: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dni">DNI</Label>
                          <Input
                            id="dni"
                            placeholder="12345678"
                            value={newClientForm.dni}
                            onChange={(e) => setNewClientForm(prev => ({ ...prev, dni: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="genero">Género</Label>
                          <Select
                            value={newClientForm.genero}
                            onValueChange={(value) => setNewClientForm(prev => ({ ...prev, genero: value }))}
                          >
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Seleccione género" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="femenino">Femenino</SelectItem>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="otros">Otros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contacto</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="celular">Celular</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="+54">
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+54">🇦🇷 +54</SelectItem>
                              <SelectItem value="+1">🇺🇸 +1</SelectItem>
                              <SelectItem value="+34">🇪🇸 +34</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="celular"
                            placeholder="11 1234-5678"
                            className="flex-1 h-10"
                            value={newClientForm.celular}
                            onChange={(e) => setNewClientForm(prev => ({ ...prev, celular: e.target.value }))}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Formato WhatsApp</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ejemplo@email.com"
                          className="h-10"
                          value={newClientForm.email}
                          onChange={(e) => setNewClientForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Información Adicional</h3>


                    <div className="space-y-2">
                      <Label>Tipo de cliente</Label>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Button
                          type="button"
                          variant={newClientForm.tipoCliente === 'activo' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'activo' }))}
                          className="w-full"
                        >
                          Activo
                        </Button>
                        <Button
                          type="button"
                          variant={newClientForm.tipoCliente === 'potencial' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'potencial' }))}
                          className="w-full"
                        >
                          Potencial
                        </Button>
                        <Button
                          type="button"
                          variant={newClientForm.tipoCliente === 'antiguo' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewClientForm(prev => ({ ...prev, tipoCliente: 'antiguo' }))}
                          className="w-full"
                        >
                          Antiguo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="origen">Origen</Label>
                        <Select
                          value={newClientForm.origen}
                          onValueChange={(value) => setNewClientForm(prev => ({ ...prev, origen: value }))}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="referido">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Referido</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="web">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Página Web</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="redes">
                              <div className="flex items-center gap-2">
                                <Share2 className="h-4 w-4" />
                                <span>Redes Sociales</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="publicidad">
                              <div className="flex items-center gap-2">
                                <Megaphone className="h-4 w-4" />
                                <span>Publicidad</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="cartel">
                              <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" />
                                <span>Cartel en propiedad</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="portal">
                              <div className="flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                <span>Portal inmobiliario</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select
                          value={newClientForm.categoria}
                          onValueChange={(value) => setNewClientForm(prev => ({ ...prev, categoria: value }))}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comprador">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                <span>Comprador</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="vendedor">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>Vendedor</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="inquilino">
                              <div className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                <span>Inquilino</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="propietario">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>Propietario</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="inversor">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>Inversor</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      onClick={() => {
                        // Validar campos requeridos
                        if (!newClientForm.nombre || !newClientForm.apellido) {
                          alert('Por favor complete nombre y apellido')
                          return
                        }

                        // Crear nuevo cliente
                        const newClient = {
                          id: (mockClients.length + 1).toString(),
                          name: `${newClientForm.nombre} ${newClientForm.apellido}`,
                          dni: "00000000", // Se generaría o se pediría
                          email: newClientForm.email,
                          phone: newClientForm.celular
                        }

                        // Aquí se agregaría a la lista de clientes
                        // Por ahora solo lo seleccionamos
                        form.setValue("cliente", newClient.id)
                        setSelectedClient(newClient.id)

                        // Resetear formulario y cerrar
                        setNewClientForm({
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
                        setNewClientSheetOpen(false)
                      }}
                      className="flex-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Crear Cliente
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNewClientForm({
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
                        setNewClientSheetOpen(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )

      case 2: // Ubicación
        return (
          <div className="space-y-6">
            {/* Campo de búsqueda principal */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <FormLabel className="text-base font-medium">Buscar dirección *</FormLabel>
                {apiDebugInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">
                          ?
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-md p-4">
                        <div className="text-xs">
                          <strong>API Response Debug:</strong>
                          <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-64">
                            {JSON.stringify(apiDebugInfo, null, 2)}
                          </pre>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <SearchAutocomplete
                placeholder="Ej: Av. Santa Fe 3421, Palermo, CABA"
                className="h-12 text-base"
                onLocationSelect={(location) => {
                  setSelectedLocation({
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address
                  })

                  // Auto-rellenar dirección
                  form.setValue("direccion", location.address)

                  // Parsear dirección con Google Geocoding API
                  if (window.google && location.lat && location.lng) {
                    const geocoder = new window.google.maps.Geocoder()
                    geocoder.geocode(
                      { location: { lat: location.lat, lng: location.lng } },
                      (results, status) => {
                        if (status === 'OK' && results && results[0]) {
                          const components = results[0].address_components

                          // Debug: Guardar toda la información de la API
                          setApiDebugInfo({
                            status,
                            formatted_address: results[0].formatted_address,
                            place_id: results[0].place_id,
                            address_components: components.map(comp => ({
                              long_name: comp.long_name,
                              short_name: comp.short_name,
                              types: comp.types
                            })),
                            location: {
                              lat: location.lat,
                              lng: location.lng
                            }
                          })

                          // Limpiar campos antes de procesarlos
                          form.setValue("barrio", "")

                          let foundNeighborhood = false
                          let detectedProvince = ''

                          // Primera pasada: Detectar la provincia
                          components.forEach((component) => {
                            const types = component.types
                            if (types.includes('administrative_area_level_1')) {
                              const provinceName = component.long_name
                              if (provinceName.includes('Buenos Aires') && !provinceName.includes('Ciudad')) {
                                detectedProvince = 'buenos-aires'
                              } else if (provinceName.includes('Ciudad Autónoma') || provinceName.includes('Autonomous City')) {
                                detectedProvince = 'caba'
                              }
                            }
                          })

                          components.forEach((component) => {
                            const types = component.types

                            if (types.includes('route')) {
                              // Extraer nombre de calle del resultado completo
                              const fullAddress = results[0].formatted_address
                              const streetMatch = fullAddress.match(/^([^0-9]+)\s*(\d+)?/)
                              if (streetMatch) {
                                form.setValue("direccion", streetMatch[0].trim())
                              }
                            }

                            // Lógica diferente para Ciudad vs Barrio según la provincia
                            if (detectedProvince === 'buenos-aires') {
                              // En Buenos Aires Provincia: locality = barrio, administrative_area_level_2 = ciudad
                              if (types.includes('administrative_area_level_2')) {
                                form.setValue("ciudad", component.long_name)
                              }
                              if (types.includes('locality') && !foundNeighborhood) {
                                form.setValue("barrio", component.long_name)
                                foundNeighborhood = true
                              }
                            } else {
                              // En CABA y otras provincias: locality = ciudad
                              if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                                form.setValue("ciudad", component.long_name)
                              }
                            }

                            if (types.includes('administrative_area_level_1')) {
                              let provinceName = component.long_name
                              let provinceValue = ''

                              // Mapear nombres de provincias a valores del select
                              if (provinceName.includes('Buenos Aires') && !provinceName.includes('Ciudad')) {
                                provinceValue = 'buenos-aires'
                              } else if (provinceName.includes('Ciudad Autónoma') || provinceName.includes('Autonomous City')) {
                                provinceValue = 'caba'
                              } else if (provinceName.includes('Córdoba') || provinceName === 'Córdoba') {
                                provinceValue = 'cordoba'
                              } else if (provinceName.includes('Santa Fe')) {
                                provinceValue = 'santa-fe'
                              } else if (provinceName.includes('Mendoza')) {
                                provinceValue = 'mendoza'
                              }

                              if (provinceValue) {
                                form.setValue("provincia", provinceValue)
                              }
                            }

                            if (types.includes('postal_code')) {
                              form.setValue("codigoPostal", component.long_name)
                            }

                            // Para CABA y otras provincias, usar la lógica tradicional de barrio
                            if (detectedProvince !== 'buenos-aires' && !foundNeighborhood) {
                              if (types.includes('sublocality_level_1')) {
                                form.setValue("barrio", component.long_name)
                                foundNeighborhood = true
                              } else if (types.includes('neighborhood')) {
                                form.setValue("barrio", component.long_name)
                                foundNeighborhood = true
                              } else if (types.includes('sublocality')) {
                                form.setValue("barrio", component.long_name)
                                foundNeighborhood = true
                              }
                            }
                          })

                          // Si no se encontró barrio, mantenerlo vacío
                          if (!foundNeighborhood) {
                            form.setValue("barrio", "")
                          }
                        }
                      }
                    )
                  }
                }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Busca la dirección y se autocompletarán los campos a continuación
              </p>
            </div>

            {/* Layout de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna izquierda - Formulario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Detalles de la ubicación</h3>

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección completa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Av. Santa Fe 3421" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="piso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Piso</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 5" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: A" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ciudad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: CABA" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            className="max-w-[--radix-select-trigger-width] w-[--radix-select-trigger-width]"
                            position="popper"
                            sideOffset={4}
                          >
                            <SelectItem value="caba">CABA</SelectItem>
                            <SelectItem value="buenos-aires">Buenos Aires</SelectItem>
                            <SelectItem value="cordoba">Córdoba</SelectItem>
                            <SelectItem value="santa-fe">Santa Fe</SelectItem>
                            <SelectItem value="mendoza">Mendoza</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigoPostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 1425" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barrio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barrio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Palermo" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Columna derecha - Mapa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Vista en el mapa</h3>
                <div className="border rounded-lg overflow-hidden bg-muted">
                  {selectedLocation ? (
                    <GoogleMapComponent
                      properties={[{
                        id: "temp-location",
                        title: "Ubicación seleccionada",
                        latitude: selectedLocation.lat,
                        longitude: selectedLocation.lng,
                        price: 0,
                        address: selectedLocation.address,
                        operation_type: "Venta",
                        images: []
                      }]}
                      center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                      zoom={16}
                      height="400px"
                    />
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Selecciona una dirección</p>
                        <p className="text-sm">Para ver la ubicación en el mapa</p>
                      </div>
                    </div>
                  )}
                </div>
                {selectedLocation && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <strong>Dirección seleccionada:</strong><br />
                    {selectedLocation.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3: // Características
        return (
          <div className="space-y-8">
            {/* Características Principales */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Características Principales
              </h3>

              {/* Fila única: Ambientes, Dormitorios, Baños y Cocheras */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="ambientes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-primary" />
                        Ambientes *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dormitorios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-primary" />
                        Dormitorios *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baños"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-primary" />
                        Baños *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cocheras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        Cocheras
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tercera fila: Superficies */}
              <div className="space-y-4">
                <h4 className="text-base font-medium flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Metros Cuadrados
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="superficieCubiertos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Cubiertos (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder=""
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="superficieDescubiertos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Descubiertos (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder=""
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="superficieTotales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Totales (m²) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-11 bg-muted text-muted-foreground cursor-not-allowed"
                            value={superficieTotal > 0 ? superficieTotal : ''}
                            readOnly
                            disabled
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Cuarta fila: Antigüedad y Orientación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="antiguedad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Antigüedad
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="0">A estrenar</SelectItem>
                          <SelectItem value="1-5">1 a 5 años</SelectItem>
                          <SelectItem value="6-10">6 a 10 años</SelectItem>
                          <SelectItem value="11-20">11 a 20 años</SelectItem>
                          <SelectItem value="21-50">21 a 50 años</SelectItem>
                          <SelectItem value="50+">Más de 50 años</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orientacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        Orientación
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="norte">Norte</SelectItem>
                          <SelectItem value="sur">Sur</SelectItem>
                          <SelectItem value="este">Este</SelectItem>
                          <SelectItem value="oeste">Oeste</SelectItem>
                          <SelectItem value="noreste">Noreste</SelectItem>
                          <SelectItem value="noroeste">Noroeste</SelectItem>
                          <SelectItem value="sureste">Sureste</SelectItem>
                          <SelectItem value="suroeste">Suroeste</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Detalles de la Propiedad */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Detalles de la propiedad</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "contratoExclusivo", label: "Contrato Exclusivo" },
                  { name: "cartel", label: "Cartel", optional: true },
                  { name: "ofreceFinanciamiento", label: "Ofrece financiamiento" },
                  { name: "aptoCredito", label: "Apto crédito" },
                  { name: "aptoComercial", label: "Apto comercial" },
                  { name: "aptoProfesional", label: "Apto profesional" },
                  { name: "aptoMovilidadReducida", label: "Apto movilidad reducida" },
                  { name: "pozo", label: "Pozo" },
                  { name: "countryBarrioPrivado", label: "Country o barrio privado", optional: true }
                ].map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as any}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex items-center gap-2">
                            {item.label}
                            {item.optional && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Opcional</span>
                            )}
                          </FormLabel>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={field.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => field.onChange(true)}
                              className="w-16"
                            >
                              Sí
                            </Button>
                            <Button
                              type="button"
                              variant={!field.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => field.onChange(false)}
                              className="w-16"
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Estado de la Propiedad */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Estado de la propiedad</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Opcional</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "A estrenar", "Excelente", "En construcción", "Muy bueno",
                  "Refaccionado", "Bueno", "A refaccionar", "Regular"
                ].map((estado) => (
                  <FormField
                    key={estado}
                    control={form.control}
                    name="estadoPropiedad"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(estado)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || []
                              if (checked) {
                                field.onChange([...currentValues, estado])
                              } else {
                                field.onChange(currentValues.filter((value) => value !== estado))
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {estado}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Características de la Propiedad */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Características de la propiedad</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Opcional</span>
              </div>

              {/* Buscador de características */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar característica"
                  className="pl-10 h-11"
                />
              </div>

              {/* Categorías colapsables */}
              <div className="space-y-4">
                {/* Ambientes */}
                <div className="border rounded-lg">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
                  >
                    <span className="font-medium">Ambientes</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                  <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                    {[
                      "Dormitorio", "Comedor", "Vestidor", "Jardín",
                      "Baño", "Cocina", "Living", "Patio",
                      "Terraza", "Estudio", "Lavadero", "Altillo",
                      "Playroom", "Lobby", "Quincho", "Sala de reuniones",
                      "Balcón", "Pileta"
                    ].map((caracteristica) => (
                      <FormField
                        key={caracteristica}
                        control={form.control}
                        name="caracteristicasPropiedad"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(caracteristica)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || []
                                  if (checked) {
                                    field.onChange([...currentValues, caracteristica])
                                  } else {
                                    field.onChange(currentValues.filter((value) => value !== caracteristica))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {caracteristica}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Descripción
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la propiedad *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Hermoso departamento en Palermo" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-3">
                    <FormLabel>Descripción *</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                            disabled
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Crear con IA
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Próximamente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la propiedad detalladamente..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Incluye detalles sobre la propiedad, el barrio, servicios cercanos, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 5: // Multimedia
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <FormLabel className="text-lg font-semibold">Fotos de la propiedad</FormLabel>
                <Badge variant="secondary" className="text-xs">
                  {uploadedFiles.multimedia.length}/10 imágenes
                </Badge>
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
                                // Abrir imagen en nueva pestaña para preview
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
                        
                        {/* Handle de arrastre */}
                        <div className="absolute top-2 right-2 bg-black/70 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4 text-white" />
                        </div>
                        
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
                          <li>• La primera imagen será la foto principal</li>
                          <li>• Incluye fotos de sala, cocina, dormitorios y baños</li>
                          <li>• Usa buena iluminación natural cuando sea posible</li>
                          <li>• Evita fotos borrosas o muy oscuras</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 6: // Documentación
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
                      const FileIcon = getFileIcon(docObj.type)
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
                                  {docObj.type.split('/')[1]?.toUpperCase() || 'Archivo'}
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
                                // Crear URL temporal para previsualizar el archivo
                                const url = URL.createObjectURL(docObj.file)
                                window.open(url, '_blank')
                                // Limpiar la URL después de un tiempo
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

      case 7: // Preview
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
                        mockClients.find(c => c.id === form.watch("cliente"))?.name : 
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
                    <span className="font-medium">{form.watch("orientacion") || "No especificado"}</span>
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

            {/* Botones de acción */}
            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Editar información
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Enviar para Revisión
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-full">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nueva Propiedad</h1>
          <p className="text-muted-foreground">
            Completa la información de la propiedad paso a paso
          </p>
        </div>

        {/* Stepper Navigation - Desktop */}
        <div className="mb-8 hidden md:block">
          <div className="relative">
            {/* Línea de conexión que va de extremo a extremo */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted" />

            <div className="flex justify-between relative">
              {steps.map((step, index) => {
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
                      <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
                {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              </div>
              <div>
                <p className="font-medium text-primary">{steps[currentStep - 1].title}</p>
                <p className="text-sm text-muted-foreground">Paso {currentStep} de {steps.length}</p>
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
                <div className="px-2 space-y-2">
                  {steps.map((step) => {
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
                        justify-center  transition-colors bg-background
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

        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader className="pb-4 px-0 md:px-6">
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                  {steps[currentStep - 1].title}
                </CardTitle>
                <Separator className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-6 px-0 md:px-6">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentStep === steps.length ? (
                  <Button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    Enviar para Revisión
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                ) : currentStep === 6 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Ver Preview
                    <Eye className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}