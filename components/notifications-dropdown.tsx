
// components/notifications-dropdown.tsx - VERSIÓN COMPLETA
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Check, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  mockNotifications, 
  getUnreadNotifications, 
  getNotificationIcon, 
  getPriorityColor,
  type NotificationType 
} from "@/lib/notifications-data"

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NotificationType[]>(mockNotifications)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calcular estadísticas
  const unreadNotifications = notifications.filter(n => !n.read)
  const hasUnread = unreadNotifications.length > 0
  const actionRequired = notifications.filter(n => n.actionRequired && !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  // Renderizar versión simple si no está montado
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
            <>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-medium">
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </span>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-base">Notificaciones</h3>
            <p className="text-sm text-gray-500">
              {hasUnread ? `${unreadNotifications.length} sin leer` : 'Todo al día'} 
              {actionRequired > 0 && ` • ${actionRequired} requieren acción`}
            </p>
          </div>
          {hasUnread && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Marcar todo
            </Button>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.slice(0, 8).map((notification) => (
              <div
                key={notification.id}
                className={`relative border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Indicador de no leído */}
                {!notification.read && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                )}

                <div className="flex items-start gap-3 p-4 pl-8">
                  {/* Avatar/Imagen */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={notification.image}
                      alt=""
                      fill
                      className="object-cover rounded-full"
                    />
                    {/* Ícono de tipo de notificación */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs border">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              Urgente
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs px-1 py-0 border-orange-200 text-orange-700">
                              Acción
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timeAgo}
                        </p>
                      </div>

                      {/* Acciones */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {!notification.read && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="h-3 w-3 mr-2" />
                              Marcar como leído
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600"
                          >
                            <X className="h-3 w-3 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Botón de acción si es necesario */}
                    {notification.actionRequired && !notification.read && (
                      <div className="mt-2">
                        <Link href={notification.link}>
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            {notification.type === 'inquiry' && 'Responder'}
                            {notification.type === 'visit' && 'Ver agenda'}
                            {notification.type === 'contract' && 'Revisar propuesta'}
                            {notification.type === 'reminder' && 'Ver detalles'}
                            {!['inquiry', 'visit', 'contract', 'reminder'].includes(notification.type) && 'Ver más'}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link completo invisible para hacer clickeable toda la notificación */}
                <Link 
                  href={notification.link} 
                  className="absolute inset-0 z-0"
                  onClick={() => !notification.read && markAsRead(notification.id)}
                />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No tienes notificaciones</p>
              <p className="text-sm">Te notificaremos cuando haya novedades</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3">
          <Link href="/perfil?tab=notificaciones">
            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
              Ver todas las notificaciones
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
