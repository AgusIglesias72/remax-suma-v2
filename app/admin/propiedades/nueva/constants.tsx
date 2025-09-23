// app/admin/propiedades/nueva/constants.ts
import { Building2, MapPin, FileText, Camera, File, Eye } from "lucide-react"
import { StepConfig, Client } from "./types"

export const STEPS: StepConfig[] = [
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

export const MOCK_CLIENTS: Client[] = [
  { id: "1", name: "Roberto Martínez", dni: "12345678", email: "roberto@email.com", phone: "+54 11 1234-5678" },
  { id: "2", name: "Ana Rodríguez", dni: "23456789", email: "ana@email.com", phone: "+54 11 2345-6789" },
  { id: "3", name: "Luis González", dni: "34567890", email: "luis@email.com", phone: "+54 11 3456-7890" },
  { id: "4", name: "María García", dni: "45678901", email: "maria@email.com", phone: "+54 11 4567-8901" },
  { id: "5", name: "Carlos López", dni: "56789012", email: "carlos@email.com", phone: "+54 11 5678-9012" }
]

export const PROPERTY_TYPES = [
  { value: "departamento", label: "🏢 Departamento" },
  { value: "casa", label: "🏠 Casa" },
  { value: "ph", label: "🏘️ PH" },
  { value: "local", label: "🏪 Local Comercial" },
  { value: "oficina", label: "🏢 Oficina" },
  { value: "terreno", label: "🌍 Terreno" },
  { value: "quinta", label: "🌳 Quinta" }
]

export const PROVINCES = [
  { value: "caba", label: "CABA" },
  { value: "buenos-aires", label: "Buenos Aires" },
  { value: "cordoba", label: "Córdoba" },
  { value: "santa-fe", label: "Santa Fe" },
  { value: "mendoza", label: "Mendoza" }
]

export const PROPERTY_AMENITIES = {
  ambientes: [
    "Dormitorio", "Comedor", "Vestidor", "Jardín",
    "Baño", "Cocina", "Living", "Patio",
    "Terraza", "Estudio", "Lavadero", "Altillo",
    "Playroom", "Lobby", "Quincho", "Sala de reuniones",
    "Balcón", "Pileta"
  ],
  // Agregar más categorías según necesites
}

export const PROPERTY_STATES = [
  "A estrenar", "Excelente", "En construcción", "Muy bueno",
  "Refaccionado", "Bueno", "A refaccionar", "Regular"
]

export const MAX_IMAGES = 10
export const ACCEPTED_IMAGE_TYPES = "image/*"
export const ACCEPTED_DOC_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"