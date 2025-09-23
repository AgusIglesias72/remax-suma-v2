// app/admin/propiedades/nueva/types.ts
import * as z from "zod"

export const propertySchema = z.object({
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

  // Detalles de la propiedad
  contratoExclusivo: z.boolean().optional(),
  cartel: z.boolean().optional(),
  ofreceFinanciamiento: z.boolean().optional(),
  aptoCredito: z.boolean().optional(),
  aptoComercial: z.boolean().optional(),
  aptoProfesional: z.boolean().optional(),
  aptoMovilidadReducida: z.boolean().optional(),
  pozo: z.boolean().optional(),
  countryBarrioPrivado: z.boolean().optional(),

  // Estado y características
  estadoPropiedad: z.array(z.string()).optional(),
  caracteristicasPropiedad: z.array(z.string()).optional(),

  // Descripción
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  caracteristicas: z.array(z.string()).optional(),

  // Archivos
  multimedia: z.array(z.any()).optional(),
  documentacion: z.array(z.any()).optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>

export interface UploadedFile {
  file: File
  preview?: string
  id: string
  type?: string
}

export interface UploadedFiles {
  multimedia: UploadedFile[]
  documentacion: UploadedFile[]
}

export interface StepConfig {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  fields: string[]
}

export interface Client {
  id: string
  name: string
  dni: string
  email: string
  phone: string
}

export interface NewClientForm {
  nombre: string
  apellido: string
  dni: string
  celular: string
  email: string
  genero: string
  tipoCliente: string
  origen: string
  categoria: string
}

export interface LocationData {
  lat: number
  lng: number
  address: string
}