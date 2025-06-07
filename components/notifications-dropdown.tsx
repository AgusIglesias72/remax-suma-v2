// components/notifications-dropdown.tsx
// RUTA: components/notifications-dropdown.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos de ejemplo para notificaciones
const sampleNotifications = [
  {
    id: 1,
    title: "Nueva consulta",
    message: "Juan Pérez está interesado en la propiedad en Puerto Madero",
    time: "Hace 10 minutos",
    read: false,
    link: "/mensajes/123",
    image: "/images/user-profile.jpg",
  },
  {
    id: 2,
    title: "Visita programada",
    message: "Recordatorio: Visita a la propiedad en Palermo mañana a las 15:00",
    time: "Hace 2 horas",
    read: true,
    link: "/agenda/456",
    image: "/images/calendar.jpg",
  },
  {
    id: 3,
    title: "Cambio de precio",
    message: "El propietario ha reducido el precio de la casa en Belgrano",
    time: "Ayer",
    read: true,
    link: "/propiedades/prop4",
    image: "/images/price-tag.jpg",
  },
]

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [hasUnread, setHasUnread] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Calcular hasUnread después de montar
    const unreadCount = notifications.filter(notif => !notif.read).length
    setHasUnread(unreadCount > 0)
  }, [notifications])

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    setHasUnread(false)
  }

  // Renderizado simple durante SSR y antes de hidratación
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full relative">
        <Bell className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaciones</span>
          {hasUnread && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto py-1">
              Marcar todo como leído
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link href={notification.link} className="flex items-start p-3 cursor-pointer">
                  <div className="relative w-10 h-10 mr-3 mt-1 flex-shrink-0">
                    <Image
                      src={notification.image || "/placeholder.svg"}
                      alt=""
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No tienes notificaciones</p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil?tab=notificaciones" className="cursor-pointer justify-center text-red-600">
            Ver todas las notificaciones
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}