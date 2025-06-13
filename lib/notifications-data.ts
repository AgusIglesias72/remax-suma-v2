// lib/notifications-data.ts
// RUTA: lib/notifications-data.ts
import type { StaticImageData } from 'next/image'

export interface NotificationType {
  id: string
  type: 'inquiry' | 'visit' | 'price_change' | 'new_property' | 'contract' | 'reminder' | 'system'
  title: string
  message: string
  time: string
  timeAgo: string
  read: boolean
  link: string
  image: string
  priority: 'low' | 'medium' | 'high'
  actionRequired?: boolean
  propertyId?: string
  clientName?: string
}

export const mockNotifications: NotificationType[] = [
  {
    id: "notif-001",
    type: "inquiry",
    title: "Nueva consulta",
    message: "María Fernández está interesada en el departamento de 3 ambientes en Palermo",
    time: "2024-06-12T10:30:00Z",
    timeAgo: "Hace 5 minutos",
    read: false,
    link: "/mensajes/maria-fernandez-001",
    image: "https://media.istockphoto.com/id/1202445672/es/foto/retrato-de-una-hermosa-mujer-de-sesenta-a%C3%B1os.webp?a=1&b=1&s=612x612&w=0&k=20&c=ym5W0jfRQwQRWnlf2hZNOq1XbLsWo5supw_h6DTiQ5E=",
    priority: "high",
    actionRequired: true,
    propertyId: "prop-001",
    clientName: "María Fernández"
  },
  {
    id: "notif-002",
    type: "visit",
    title: "Visita programada",
    message: "Recordatorio: Visita con Juan Pérez mañana a las 15:00 en Vicente López",
    time: "2024-06-12T09:45:00Z",
    timeAgo: "Hace 50 minutos",
    read: false,
    link: "/agenda/visita-juan-perez-002",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    priority: "high",
    actionRequired: true,
    clientName: "Juan Pérez"
  },
  {
    id: "notif-003",
    type: "price_change",
    title: "Cambio de precio",
    message: "El propietario redujo el precio de la casa en Belgrano a USD 450,000",
    time: "2024-06-12T08:15:00Z",
    timeAgo: "Hace 2 horas",
    read: true,
    link: "/propiedades/casa-belgrano-003",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop",
    priority: "medium",
    propertyId: "prop-003"
  },
  {
    id: "notif-004",
    type: "contract",
    title: "Propuesta recibida",
    message: "Carolina López envió una propuesta por el departamento en Recoleta",
    time: "2024-06-12T07:30:00Z",
    timeAgo: "Hace 3 horas",
    read: true,
    link: "/propuestas/carolina-lopez-004",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    priority: "high",
    actionRequired: true,
    clientName: "Carolina López"
  },
  {
    id: "notif-005",
    type: "new_property",
    title: "Nueva propiedad",
    message: "Se agregó un nuevo departamento de 2 ambientes en Puerto Madero",
    time: "2024-06-11T16:20:00Z",
    timeAgo: "Ayer",
    read: true,
    link: "/propiedades/depto-puerto-madero-005",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop",
    priority: "medium",
    propertyId: "prop-005"
  },
  {
    id: "notif-006",
    type: "inquiry",
    title: "Consulta internacional",
    message: "Roberto Silva desde España consulta por propiedades de inversión",
    time: "2024-06-11T14:10:00Z",
    timeAgo: "Ayer",
    read: false,
    link: "/mensajes/roberto-silva-006",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    priority: "medium",
    clientName: "Roberto Silva"
  },
  {
    id: "notif-007",
    type: "reminder",
    title: "Recordatorio",
    message: "Tienes 3 propiedades sin actualizar hace más de 30 días",
    time: "2024-06-11T09:00:00Z",
    timeAgo: "Hace 2 días",
    read: true,
    link: "/propiedades/pendientes",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop",
    priority: "low"
  },
  {
    id: "notif-008",
    type: "visit",
    title: "Visita completada",
    message: "Se completó la visita con Ana Martínez. ¿Cómo fue la experiencia?",
    time: "2024-06-10T17:45:00Z",
    timeAgo: "Hace 2 días",
    read: false,
    link: "/feedback/ana-martinez-008",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
    priority: "medium",
    actionRequired: true,
    clientName: "Ana Martínez"
  },
  {
    id: "notif-009",
    type: "system",
    title: "Actualización del sistema",
    message: "Nuevas funcionalidades disponibles en tu portal de agente",
    time: "2024-06-10T12:00:00Z",
    timeAgo: "Hace 3 días",
    read: true,
    link: "/sistema/actualizaciones",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop",
    priority: "low"
  },
  {
    id: "notif-010",
    type: "contract",
    title: "Contrato firmado",
    message: "¡Felicitaciones! Se firmó el contrato de la casa en San Isidro",
    time: "2024-06-09T11:30:00Z",
    timeAgo: "Hace 4 días",
    read: true,
    link: "/contratos/casa-san-isidro-010",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop",
    priority: "high",
    propertyId: "prop-010"
  }
]

// Función para obtener notificaciones no leídas
export function getUnreadNotifications(): NotificationType[] {
  return mockNotifications.filter(notification => !notification.read)
}

// Función para obtener notificaciones por tipo
export function getNotificationsByType(type: NotificationType['type']): NotificationType[] {
  return mockNotifications.filter(notification => notification.type === type)
}

// Función para obtener notificaciones con acción requerida
export function getActionRequiredNotifications(): NotificationType[] {
  return mockNotifications.filter(notification => notification.actionRequired)
}

// Función para obtener el ícono por tipo de notificación
export function getNotificationIcon(type: NotificationType['type']): React.ReactNode {
  const iconMap = {
    inquiry: '💬',
    visit: '🏠',
    price_change: '💰',
    new_property: '🆕',
    contract: '📋',
    reminder: '⏰',
    system: '⚙️'
  }
  return iconMap[type] || '📬'
}

// Función para obtener el color por prioridad
export function getPriorityColor(priority: NotificationType['priority']): string {
  const colorMap = {
    low: 'text-gray-500',
    medium: 'text-blue-600',
    high: 'text-red-600'
  }
  return colorMap[priority]
}